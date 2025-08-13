# 🤖 CodeExplainerAgent

An AI-powered agent that explains code, analyzes complexity, and helps users understand programming logic. This project uses the Google Gemini API to provide intelligent, line-by-line code explanations.

## ✨ Core Features

* **Full Code Analysis**: Get a complete breakdown of any code snippet, including its core objective, step-by-step logic, and key architectural concepts.
* **Targeted Explanations**: Ask a specific question about a line or block of code to get a focused, contextual answer.
* **Actionable Recommendations**: Receive suggestions for improving code readability, efficiency, and robustness.
* **Clean, Modern UI**: A user-friendly interface built with Next.js and Tailwind CSS.

---
## 🛠️ Tech Stack

* **Frontend**: Next.js (React Framework)
* **Backend**: Node.js with Express
* **AI Model**: Google Gemini 1.5 Pro / Flash
* **Styling**: Tailwind CSS

---
## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or later)
* PNPM
* A Google Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))
* A GithHub Token (get one at [Github](https://github.com/settings/personal-access-tokens))

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/CodeExplainerAgent.git](https://github.com/your-username/CodeExplainerAgent.git)
    cd Agent
    ```

2.  **Setup Backend:**
    ```sh
    cd Agent
    pnpm install
    ```
    Create a `.env` file and add your API key:
    ```
    GITHUB_TOKEN=your_github_token
    GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
    ```

3.  **Run the application:**
    * Start the backend server: `pnpm dev` in the `Agent` directory.

---
## 📄 License


This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


