# Approval Desk — human approval & audit trail for computer-use agents

> **Name note:** this project was previously branded "COASTY AI". That is the name of the company whose computer-use API this app calls, so it was renamed to avoid confusion. "Approval Desk" is a working name; rename freely. This is an independent project and is **not affiliated with or endorsed by Coasty**.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Approval Desk** is a control room for computer-use agents. It turns a goal into steps, sends them to an agent provider (the [Coasty](https://coasty.ai) computer-use API today, with an OpenAI fallback planner), rates each step's risk, pauses risky steps until a human approves them, and streams logs over SSE.

> **Prototype status:** the screen previews in the "perception canvas" are **simulated SVG illustrations** generated in the app, not real captures from the agent's machine. They are watermarked "SIMULATED" in the UI. Sign-in/registration are demo-only (no accounts are persisted), and the workspace-optimizer modules (focus tracking, duplicate finder) show sample data because a web app cannot read desktop activity.

---

## 🌟 Key Features

### 1. 🤖 Computer-Use Agent Runner
* **Goal Decomposer**: Translates complex human prompts (e.g. *"Clone repo, configure Docker environment, and deploy container"*) into structured multi-step execution graphs.
* **Dual Planning Engine**: Uses the **Coasty computer-use API** (`https://coasty.ai`) and **OpenAI GPT-4o**, with an offline fallback heuristic planner.
* **Recovery suggestions**: On a failed step, suggests recovery commands (experimental).

### 2. 🛡️ Human-in-the-Loop Risk Governance
* **Automated Risk Classifier**: Rates execution steps into `Low`, `Medium`, `High`, or `Critical` risk levels.
* **Approval Gates**: Prompts human supervisors for interactive approval before executing high-risk operations (e.g. `rm -rf`, production deployment, credential usage).
* **Audit Trail**: Full logging of human responses, custom modifications, and side-effect analysis.

### 3. 📺 Live Execution Control Room
* **Real-time SSE Streaming**: Stream step-by-step logs, status changes, and machine state updates live via Server-Sent Events.
* **Perception Canvas**: Shows the agent's screen when the provider returns one; otherwise a clearly labelled *simulated* preview.
* **Interactive Terminal**: Real-time stdout/stderr log inspector.

### 4. ⚡ Workspace Optimizer (demo data)
* **Focus & Activity Tracker**: Tracks app usage, context switches, deep work duration, and focus session scores.
* **Productivity Coach**: AI-generated insights pointing out workflow bottlenecks and context-switching fatigue.
* **Duplicate File Detector**: Scans workspace directories to identify duplicate files and reclaim storage space.
* **Automation Suggestions**: Identifies repetitive user habits and recommends one-click automated macros.

### 5. 🎯 Mission Control & Saved Workflows
* Pre-configured autonomous missions for common developer workflows (Browser Scraping, Docker Setup, Cloud Deployment, Security Scans).
* Save custom execution runs as reusable triggered workflows.

---

## 🏗️ Tech Stack

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Radix UI Primitives.
* **Backend**: Next.js Server Actions & API Routes, Server-Sent Events (SSE).
* **Database**: PostgreSQL (hosted on [Neon Serverless Postgres](https://neon.tech)), managed via **Prisma ORM**.
* **AI & Integration**: Coasty Computer-Use API (`@/lib/coasty.ts`), OpenAI API (`@/lib/openai.ts`).

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher
* **PostgreSQL Database**: Neon PostgreSQL or any standard PostgreSQL instance.

---

### 📥 1. Clone the Repository

```bash
git clone https://github.com/Tusharkhadde/autonomous-workspace-ops.git
cd autonomous-workspace-ops
```

---

### 📦 2. Install Dependencies

```bash
npm install
```

---

### 🔑 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill it in. The database is **PostgreSQL** (not SQLite):

```env
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"

# Coasty computer-use API key (https://coasty.ai)
COASTY_API_KEY=""
COASTY_BASE_URL="https://coasty.ai"

# OpenAI API Key (Optional fallback planner)
OPENAI_API_KEY=""
```

---

### 🗄️ 4. Set Up Database Schema & Prisma Client

Push the schema to your PostgreSQL database and generate the Prisma Client:

```bash
npx prisma db push
npx prisma generate
```

---

### 💻 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app!

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the **Framework Preset** to `Next.js`.
4. Set the **Build Command** under **Build & Development Settings**:
   ```bash
   npx prisma generate && npm run build
   ```
5. Add your Environment Variables in Vercel (**Project Settings > Environment Variables**):
   * `DATABASE_URL`
   * `COASTY_API_KEY`
   * `OPENAI_API_KEY` (Optional)
6. Click **Deploy**!

---

## 📁 Directory Structure

```text
├── prisma/
│   └── schema.prisma        # Prisma Database Schema (PostgreSQL)
├── src/
│   ├── app/                 # Next.js App Router (Pages & API Routes)
│   │   ├── api/             # REST & SSE API endpoints (coasty, activity, workflows)
│   │   ├── dashboard/       # Workspace Optimizer Dashboard
│   │   ├── live/            # Live CUA Execution Control Room
│   │   ├── missions/        # Mission Control Center
│   │   ├── focus/           # Focus & Productivity Tracker
│   │   └── page.tsx         # Landing Page
│   ├── components/          # UI Components
│   │   ├── approval/        # Human Approval Modals & Risk Badges
│   │   ├── execution/       # Live Terminal & Screenshot Canvas
│   │   ├── layout/          # Sidebar & Navigation
│   │   └── ui/              # Radix UI design tokens
│   ├── lib/                 # Core Clients & SDKs
│   │   ├── coasty.ts        # Coasty Computer-Use API Client
│   │   ├── openai.ts        # OpenAI Planner & Recovery Agent
│   │   └── db.ts            # Prisma Client Instance
│   └── types/               # TypeScript Interfaces
├── package.json
└── README.md
```

---

## 📄 License

No LICENSE file is included yet. Add one (for example MIT) before others reuse this code.
