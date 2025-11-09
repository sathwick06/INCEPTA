# 🛠️ INCEPTA

**Incepta** is a multi-agent, AI-powered coding assistant built on [LangGraph](https://github.com/langchain-ai/langgraph).  
It operates like a team of collaborative developers. It interprets natural language requests and turns them into complete, functional projects — constructed file by file — following real-world development workflows.

---

## 🏗️ Architecture

- **Planner Agent** – Analyzes your request and generates a detailed project plan.
- **Architect Agent** – Breaks down the plan into specific engineering tasks with explicit context for each file.
- **Coder Agent** – Implements each task, writes directly into files, and uses available tools like a real developer.

<div style="text-align: center;">
    <img src="workflow/incepta_workflow" alt="Coder Agent Architecture" width="90%"/>
</div>

---

## 🚀 Getting Started
### Prerequisites
- Make sure you have uv installed, follow the instructions [here](https://docs.astral.sh/uv/getting-started/installation/) to install it.
- Ensure that you have created a groq account and have your API key ready. Create an API key [here](https://console.groq.com/keys).

### ⚙️ **Instsllstion and Startup**
- Create a virtual environment using: `uv venv` and activate it using `source .venv/bin/activate`
- Install the dependencies using: `uv pip install -r pyproject.toml`
- Create a `.env` file and add the variables and their respective values mentioned in the `.sample_env` file

Now that we are done with all the set-up & installation steps we can start the application using the following command:
  ```bash
    python main.py
  ```

### 🧪 Example Prompts
- Create a to-do list application using html, css, and javascript.
- Create a simple calculator web application.
- Create a simple blog API in FastAPI with a SQLite database.

---
Copyright©️ Codebasics Inc. All rights reserved.
