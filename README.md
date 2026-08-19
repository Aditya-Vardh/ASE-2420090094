Arqin AI

A modern AI-powered platform for generating architecture diagrams, technical documentation, and system design guidance from natural-language prompts.

Arqin AI helps product teams, developers, and architects move from an idea to a structured architecture model in minutes. It combines AI-assisted generation with Mermaid-based visual output and an interactive workspace for refinement and iteration.

Overview

The application is built with Next.js and uses a Groq-backed AI pipeline to generate architecture artifacts such as:

Mermaid-based system diagrams

Component and interaction views

Architecture explanations and trade-offs

Research insights for design patterns and best practices

Project templates and revision history

Features

AI-generated architecture and system design output from plain language prompts

Multiple diagram types, including architecture, flow, component, ER, and sequence views

Guided refinement workflow with iterative changes based on user instructions

Architecture research assistance for patterns, trade-offs, and implementation guidance

Project history and saved work using browser-based persistence

Reusable starter templates for common system types

Export-friendly architecture output for documentation and review

Tech Stack

Next.js 16

React 19

TypeScript

Tailwind CSS 4

Mermaid.js

Vercel AI SDK

Groq AI

Lucide React

Project Structure

ase_project/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   └── research/
│   ├── workspace/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── landing/
│   ├── ui/
│   └── workspace/
├── lib/
│   ├── ai/
│   ├── analysis/
│   ├── artifacts/
│   ├── graph/
│   ├── intelligence/
│   ├── optimizer/
│   ├── simulator/
│   ├── storage/
│   ├── adaptive.ts
│   ├── export.ts
│   ├── mermaid.ts
│   ├── mermaid-repair.ts
│   ├── rate-limit.ts
│   └── templates.ts
├── public/
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md

Getting Started

Prerequisites

Node.js 18 or newer

pnpm

A valid Groq API key

Installation

Clone the repository:

git clone <repository-url>
cd ase_project

Install dependencies:

pnpm install

Create a local environment file:

copy .env.example .env.local

If .env.example is not present, create .env.local manually with:

GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

Run the Application

pnpm dev

Then open:

http://localhost:3000 for the landing page

http://localhost:3000/workspace for the app workspace

Environment Variables

Variable

Description

GROQ_API_KEY

API key used by the server-side generation and research endpoints

NEXT_PUBLIC_SITE_URL

Base site URL used for app metadata and local routing

Core User Flow

Open the landing page and start a new architecture session.

Describe the system or application idea in natural language.

Select a diagram type or generation context.

Generate architecture output and review the Mermaid diagram.

Refine the design with follow-up prompts or edit the generated structure.

Save, export, or continue iterating in the workspace.

Available Routes

/ — marketing and product landing page

/workspace — main architecture generation interface

/workspace/generate — generation flow

/workspace/history — saved or previous sessions

/workspace/templates — starter templates

/workspace/research — architecture research assistant

/workspace/projects — project management area

/workspace/settings — user settings

Scripts

pnpm dev       # Start local development server
pnpm build     # Create production build
pnpm start     # Run the built app
pnpm lint      # Run ESLint checks

Notes

Generation is powered by AI and may gracefully fall back to local synthesis if no API key is configured.

Project data is stored in the browser via local storage rather than a backend database.

The app is designed for rapid ideation and architecture iteration, not for production-grade authentication or team collaboration out of the box.

License

This project is intended for educational, prototype, and internal-use scenarios unless otherwise specified by the repository owner.