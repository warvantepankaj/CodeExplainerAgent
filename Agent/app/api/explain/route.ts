import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

// Make sure to set your GEMINI_API_KEY in your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
        console.warn("⚠️ GEMINI_API_KEY not found. Using fallback.");
        const explanation = heuristicExplain(code, language);
        return NextResponse.json({ explanation, note: "Heuristic mode (no GEMINI_API_KEY configured)" });
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = buildPrompt(code, language);

      console.log("📤 Sending request to Google Gemini API...");

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log("✅ Got response from Gemini.");

      return NextResponse.json({ explanation: text });
    } catch (err) {
      console.error("❌ Google Gemini API call failed:", err);
      const explanation = heuristicExplain(code, language);
      return NextResponse.json({ explanation, note: "Heuristic fallback after API error" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}

function buildPrompt(code: string, language?: string) {
  return `
You are a senior software engineer providing a professional code review.

YOU MUST FOLLOW THESE FORMATTING RULES WITHOUT EXCEPTION:
- Do not use asterisks (*) for any purpose, including bolding, emphasis, or lists.
- Use hyphens (-) for all list items.
- Use markdown headings (e.g., ## Analysis) for section titles.
- To highlight a specific technical term, enclose it in backticks, like \`this\`.

Provide your analysis in the following structure:

## Analysis
A concise, step-by-step explanation of the code's logic and functionality. Focus on the 'why' behind the implementation. Explain the purpose of key functions, algorithms, and data structures.

## Recommendations
A list of actionable suggestions for improvement, focusing on readability, efficiency, and robustness. If the code is already optimal, state that no improvements are necessary.

---
**Code to Analyze:**
\`\`\`${language || ""}
${code}
\`\`\`
  `;
}

// Heuristic function remains the same as a fallback
function heuristicExplain(code: string, language?: string, path?: string) {
  const lines = code.split(/\r?\n/);
  const loc = lines.length;
  const comments = lines.filter((l) => /^\s*(\/\/|#|\/\*|\*)/.test(l)).length;
  const functions = (code.match(/\b([a-zA-Z_]\w*)\s*\(/g) || []).length;
  const classes = (code.match(/\bclass\s+[A-Za-z_]\w*/g) || []).length;
  const imports = (code.match(/\b(import|#include|using)\b/g) || []).length;
  const detected =
    language ||
    (/\bpublic\s+class\b/.test(code)
      ? "java"
      : /^\s*#include/m.test(code)
      ? "c"
      : /\bdef\s+\w+\(/.test(code)
      ? "python"
      : "text");

  const bullet = (s: string) => `- ${s}`;
  return [
    `### Overview`,
    `This ${detected.toUpperCase()} ${path ? `file (${path})` : "snippet"} contains approximately ${loc} lines of code.`,
    "",
    `### Quick stats`,
    bullet(`Functions/methods: ${functions}`),
    bullet(`Classes: ${classes}`),
    bullet(`Imports/includes: ${imports}`),
    bullet(`Comment lines: ${comments}`),
    "",
    `### Logic guess`,
    bullet(`Looks for main function or entry point.`),
    bullet(`Checks how data flows from inputs to outputs.`),
    bullet(`Identifies main loops and decision points.`),
  ].join("\n");
}