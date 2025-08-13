import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { code, language, path, question } = await req.json()
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing code" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (apiKey) {
      try {
        // Use AI SDK with Google Gemini when available
        const { generateText } = await import("ai")
        const { google } = await import("@ai-sdk/google")

        const prompt = question
          ? buildFollowUpPrompt(code, language, path, question)
          : buildInitialPrompt(code, language, path)

        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          system: question
            ? "You are an expert code tutor. Answer the specific question about the provided code with clear explanations, examples, and practical insights. Use markdown formatting for better readability."
            : "You are an expert code tutor. Explain code in an engaging, educational way with examples, test cases, and practical insights. Use markdown formatting, bullet points, and code examples. Make it beginner-friendly but comprehensive.",
          prompt,
          temperature: 0.3,
          maxTokens: 1000,
        })
        return NextResponse.json({ explanation: text })
      } catch (err) {
        console.error("Gemini API error:", err)
        // Fallback to heuristic if AI fails
        const explanation = heuristicExplain(code as string, language as string, path as string | undefined)
        return NextResponse.json({ explanation, note: "Heuristic fallback" })
      }
    }

    // No API key: heuristic summary
    const explanation = heuristicExplain(code as string, language as string, path as string | undefined)
    return NextResponse.json({ explanation, note: "Heuristic mode (no GOOGLE_GENERATIVE_AI_API_KEY configured)" })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
}

function buildInitialPrompt(code: string, language?: string, path?: string) {
  return [
    `Analyze and explain the following ${language || "source"} code in an engaging, educational way.`,
    path ? `File: \`${path}\`` : "",
    "",
    "Please provide a comprehensive explanation that includes:",
    "",
    "## 🎯 **What This Code Does**",
    "- High-level purpose and functionality",
    "- Main objectives and use cases",
    "",
    "## 🔧 **Key Components**",
    "- Important functions, classes, and variables",
    "- How different parts work together",
    "",
    "## 📝 **Step-by-Step Breakdown**",
    "- Logical flow and execution order",
    "- Important algorithms or patterns used",
    "",
    "## 💡 **Example Usage & Test Cases**",
    "- Provide realistic input/output examples",
    "- Show what happens with different inputs",
    "- Include edge cases if relevant",
    "",
    "## ⚠️ **Important Notes**",
    "- Potential issues or gotchas",
    "- Best practices and improvements",
    "",
    "## 🚀 **How to Run**",
    language === "java"
      ? "- Compilation and execution steps"
      : language === "python"
        ? "- How to execute the script"
        : language === "c" || language === "cpp"
          ? "- Compilation commands and execution"
          : "- Execution instructions",
    "",
    "**Code:**",
    "```" + (language || "") + "\n" + code + "\n```",
    "",
    "Make the explanation beginner-friendly but comprehensive, with practical examples and clear formatting.",
  ]
    .filter(Boolean)
    .join("\n")
}

function buildFollowUpPrompt(code: string, language?: string, path?: string, question?: string) {
  return [
    `Here's the ${language || "source"} code for reference:`,
    path ? `File: \`${path}\`` : "",
    "",
    "```" + (language || "") + "\n" + code + "\n```",
    "",
    `**Question:** ${question}`,
    "",
    "Please provide a detailed answer that includes:",
    "- Direct answer to the question",
    "- Relevant code examples or snippets",
    "- Practical implications or use cases",
    "- Any related concepts that would be helpful",
    "",
    "Use clear formatting with markdown, code blocks, and examples where helpful.",
    "Reference specific line numbers or code sections when relevant.",
  ]
    .filter(Boolean)
    .join("\n")
}

function heuristicExplain(code: string, language?: string, path?: string) {
  const lines = code.split(/\r?\n/)
  const loc = lines.length
  const comments = lines.filter((l) => /^\s*(\/\/|#|\/\*|\*)/.test(l)).length
  const functions = (code.match(/\b([a-zA-Z_]\w*)\s*\(/g) || []).length
  const classes = (code.match(/\bclass\s+[A-Za-z_]\w*/g) || []).length
  const imports = (code.match(/\b(import|#include)\b/g) || []).length
  const detected =
    language ||
    (/\bpublic\s+class\b/.test(code)
      ? "java"
      : /^\s*#include/m.test(code)
        ? "c"
        : /\bdef\s+\w+\(/.test(code)
          ? "python"
          : "text")

  const md = [
    `## 🎯 **Code Overview**`,
    `This ${detected.toUpperCase()} ${path ? `file (\`${path}\`)` : "snippet"} contains **${loc} lines** of code.`,
    "",
    `## 📊 **Quick Stats**`,
    `- **Functions/Methods:** ${functions}`,
    `- **Classes:** ${classes}`,
    `- **Imports/Includes:** ${imports}`,
    `- **Comment Lines:** ${comments}`,
    "",
    `## 🔍 **What It Likely Does**`,
    detected === "c"
      ? `- **C Program:** Look for \`main()\` function as entry point\n- **Memory Management:** Check for \`malloc/free\` calls\n- **I/O Operations:** Uses \`printf/scanf\` for input/output`
      : detected === "java"
        ? `- **Java Application:** Contains classes and methods\n- **Entry Point:** Look for \`public static void main\`\n- **Object-Oriented:** Uses classes and objects`
        : detected === "python"
          ? `- **Python Script:** Contains function definitions\n- **Entry Point:** Look for \`if __name__ == "__main__":\`\n- **Dynamic:** Uses Python's flexible syntax`
          : `- **General Code:** Analyze function names and structure\n- **Data Flow:** Trace inputs to outputs\n- **Logic:** Identify loops and conditionals`,
    "",
    `## 🚀 **How to Run**`,
    detected === "c"
      ? `\`\`\`bash\ngcc ${path || "file.c"} -o app\n./app\n\`\`\``
      : detected === "java"
        ? `\`\`\`bash\njavac ${path || "File.java"}\njava ${path?.replace(".java", "") || "File"}\n\`\`\``
        : detected === "python"
          ? `\`\`\`bash\npython ${path || "script.py"}\n\`\`\``
          : `\`\`\`bash\n# Refer to project documentation\n\`\`\``,
    "",
    `## 💡 **Next Steps**`,
    `- **Analyze Functions:** Understand what each function does`,
    `- **Trace Execution:** Follow the program flow step by step`,
    `- **Test with Data:** Try different inputs to see outputs`,
    `- **Check Edge Cases:** Consider boundary conditions`,
  ].join("\n")

  return md
}
