## Defect Detection AI – Local Run Guide

Use this playbook to bring up the entire stack (Next.js frontend + FastAPI backend).

---

## 0. Quick Start Checklist
1. Install the required tooling (Git, Node.js 18 LTS, Python 3.10, pip 24.3, any IDE).
2. Clone/download this repository: `git clone https://.../Defect_test.git`.
3. Create two env files:
   - `./.env.local` for the frontend.
   - `./backend/.env` for the backend (contains `OPENAI_API_KEY`).
4. Install dependencies:
   - `npm install` (repo root).
   - `python -m venv backend/venv && pip install -r backend/requirements.txt`.
5. Start backend (`python main.py`) → start frontend (`npm run dev`) → open `http://localhost:3000`.

---

## 1. Download & Install Required Tools

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 20.19.5 LTS | [nodejs.org](https://nodejs.org). Includes npm 10.8.2 |
| npm | 10.8.2 | Bundled with Node 20.19.5 |
| Python | 3.10.18 | [python.org](https://www.python.org). Install with `Add to PATH`. |
| pip | 24.3.1 | `python -m pip install --upgrade pip==24.3.1`. |
| Git | 2.44.0 | [git-scm.com](https://git-scm.com). Required to clone the repo. |
| OpenAI Account | GPT-4o access | Needed to create `OPENAI_API_KEY`. |


Verify installations:
```bash
node -v
npm -v
python --version
pip --version
git --version
```

---

## 2. Grab the Codebase

```bash
git clone <your_repo_url>/Defect_test.git
cd Defect_test
```

Repo layout:
```
Defect_test/
├── app/, components/, services/, types/   # Next.js frontend
├── backend/                              # FastAPI backend
│   ├── app/ (routers, adapters, models)
│   ├── main.py
│   └── requirements.txt
├── package.json / package-lock.json      # Frontend deps
├── README.md                             # Frontend guide
├── backend/README.md                     # Backend guide
└── PRD.md                                # Product doc
```

Frontend commands run from the repo root. Backend commands run from `./backend`.

---

## 3. Frontend (Next.js 14 + Tailwind)

### 3.1 Dependencies

| Runtime deps | Version |
| --- | --- |
| next | 14.0.4 |
| react | 18.2.0 |
| react-dom | 18.2.0 |
| axios | 1.6.2 |

| Dev deps | Version |
| --- | --- |
| typescript | 5.3.3 |
| tailwindcss | 3.4.0 |
| postcss | 8.4.32 |
| autoprefixer | 10.4.16 |
| @types/node | 20.10.5 |
| @types/react | 18.2.45 |
| @types/react-dom | 18.2.18 |

### 3.2 Install
```bash
# from repo root
npm install
```

### 3.3 Configure Environment
Create `.env.local` in the repo root:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Adjust the URL if your backend runs elsewhere even fallback is added in api.ts file

### 3.4 Useful Scripts
```bash
npm run dev     # http://localhost:3000 with hot reload

```

Tailwind/PostCSS are already wired up (`tailwind.config.js`, `postcss.config.js`). No extra steps required.

---

## 4. Backend (FastAPI + OpenAI)

### 4.1 Dependencies (from `backend/requirements.txt`)

| Package | Purpose |
| --- | --- |
| fastapi | API framework |
| uvicorn[standard] | ASGI server |
| python-multipart | File uploads |
| openai | GPT-4o SDK |
| pydantic | Request/response schemas |
| python-dotenv | `.env` loading |

### 4.2 Virtual Environment + Install
```bash
cd backend
python -m venv venv
# Windows PowerShell
.\venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate

pip install --upgrade pip==24.3.1
pip install -r requirements.txt
```

### 4.3 Configure Environment
Create `backend/.env`:
```
OPENAI_API_KEY=sk-your-key
HOST=0.0.0.0          # optional override
PORT=8000             # default
CORS_ORIGINS=http://localhost:3000
```

### 4.4 Run the API
```bash
# still inside backend with venv active
python main.py
#uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Available endpoints:
- `POST /api/analyze`
- `GET /api/history`
- `GET /health`

Use `curl` or Postman to validate:
```bash
curl http://localhost:8000/health
```

---


Following these steps from a clean machine guarantees a reproducible local environment.

