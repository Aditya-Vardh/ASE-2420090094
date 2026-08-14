# ArchiGen AI

Turn natural-language software ideas into professional architecture diagrams, UML models, and technical documentation — powered by Groq AI and Mermaid.js.

![ArchiGen AI](public/og-image.png)

## Features

- **AI Architecture Generation** — Describe your system and get structured architecture with Mermaid diagrams
- **Multiple Diagram Types** — Class, sequence, ER, flowchart, component, deployment, state, and architecture diagrams
- **Architecture Explanations** — Overview, components, data flow, scalability, security, reliability, trade-offs, and improvements
- **Diagram Refinement** — Iterate with natural language instructions without starting over
- **Architecture Research** — Ask structured questions about patterns, technologies, and trade-offs
- **Projects & History** — Save projects and browse generation history (localStorage)
- **Templates** — 13 starter templates for common systems
- **Export** — PNG, SVG, Markdown, and PDF (via print)

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Groq AI** via Vercel AI SDK
- **Mermaid.js** for diagram rendering
- **Lucide React** for icons
- **localStorage** for project persistence

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com/)

### Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd ase_project
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-username/archigen
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/workspace](http://localhost:3000/workspace) for the generator.

## Main User Flow

1. Visit the **landing page** and click **Generate Architecture** or **Open App**
2. In the **workspace**, describe your system and select a diagram type
3. Click **Generate Architecture** — AI returns a Mermaid diagram + structured explanation
4. **Refine** with follow-up instructions, **export** as PNG/SVG/Markdown, or **save** to projects
5. Browse **Templates**, **History**, or use **Research** for architecture questions

## Project Structure

```
app/
  page.tsx                 # Landing page
  workspace/               # Main application
    page.tsx               # Generator workspace
    projects/              # Project management
    history/               # Generation history
    templates/             # Architecture templates
    research/              # Architecture research
    settings/              # User preferences
  api/
    generate/route.ts      # Architecture generation (Groq)
    research/route.ts      # Research queries (Groq)
components/
  landing/                 # Landing page sections
  workspace/               # Workspace UI (sidebar, canvas, etc.)
lib/
  ai/                      # AI schemas, prompts, models
  storage/                 # localStorage persistence
  templates.ts             # Template definitions
  export.ts                # Export utilities
  rate-limit.ts            # API rate limiting
```

## Security

- `GROQ_API_KEY` is used **only** in server-side API routes — never exposed to the client
- Basic in-memory rate limiting (10 requests/minute per IP)
- Mermaid rendered with `securityLevel: "strict"`
- Input validation on all API endpoints

## Build

```bash
npm run build
npm start
```

## Limitations

- No authentication or cloud sync — projects stored in browser localStorage only
- Research uses AI knowledge only (no live web search)
- PDF export opens browser print dialog (not a native PDF library)
- Rate limiting is in-memory (resets on server restart)

## License

Private / educational use.
# ASE-2420090094
