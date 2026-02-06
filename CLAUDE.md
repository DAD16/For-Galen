# For Galen - Project Guidelines

## Project Overview

Personalized IT Manager Training Platform for Galen. Deployed on Vercel at <https://for-galen.vercel.app>.
GitHub: <https://github.com/DAD16/For-Galen> (master branch).
Next.js 16 + shadcn/ui + Tailwind CSS 4 + Vercel AI SDK v6 + Anthropic Claude.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, React 19, TypeScript)
- **UI**: shadcn/ui (new-york style) + Tailwind CSS 4
- **AI**: Vercel AI SDK v6 (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`)
- **Content**: MDX files with `next-mdx-remote/rsc` + `gray-matter`
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Markdown Rendering**: `react-markdown` + `remark-gfm`
- **Deployment**: Vercel (auto-deploys from master)

## Important Patterns

### Tailwind CSS 4

- Uses `@theme inline` block for CSS variables (not tailwind.config.js)
- Uses `@plugin "@tailwindcss/typography"` syntax (not `@import`)
- oklch color space for theme colors
- Dark/light via CSS custom properties in `:root` / `.dark`

### Vercel AI SDK v6

- `useChat()` requires `DefaultChatTransport` for api/body options
- Send messages with `sendMessage({ text: input })` (not `handleSubmit`)
- Check loading with `status === "streaming" || status === "submitted"`
- Server: `convertToModelMessages(messages)` is **async** - must `await`
- Server: use `toUIMessageStreamResponse()` (not `toDataStreamResponse`)
- Server: use `maxOutputTokens` (not `maxTokens`)
- Type is `UIMessage` (not `Message`)

### Next.js 16

- Dynamic params are async: `params: Promise<{ slug: string }>`
- Must `await params` before accessing values
- Content loaded at build time via `generateStaticParams()`

### Data Storage (File-based JSON)

- Runtime data stored in `data/` directory (JSON files)
- On Vercel: uses `/tmp/data` (read-only deploy FS; data is ephemeral)
- Locally: uses `process.cwd()/data`
- Shared helper: `src/lib/data-dir.ts` — `getDataFilePath(filename)` resolves the correct path
- Reads wrapped in try-catch, returns `[]` on failure
- Writes create parent directory if needed via `fs.mkdirSync(dir, { recursive: true })`

### AI Persona System

- 5 personas defined in `src/lib/ai/personas.ts`:
  - **Sarah Chen** (`sarah-chen`) — Senior Developer & AI Integration Specialist
  - **Marcus Rivera** (`marcus-rivera`) — PMP, Agile Coach
  - **Elena Kowalski** (`elena-kowalski`) — Enterprise Systems Architect
  - **James Okafor** (`james-okafor`) — Business Intelligence Analyst
  - **Priya Sharma** (`priya-sharma`) — Leadership & Personal Development Coach
- Mapped to tracks via `getPersonaForTrack()` and chat contexts via `getPersonaForContext()`
- Each persona has `systemPromptAddition` injected into chat system prompts
- Track `_meta.json` files include `authorId` field
- Instructor profile pages at `/instructors/[id]` with persona chat

### Content Structure

- MDX lessons in `content/{track-slug}/{lesson-slug}.mdx`
- Track metadata in `content/{track-slug}/_meta.json`
- Custom courses stored as JSON in `data/custom-courses.json`
- Projects stored as JSON in `data/projects.json`

### Kanban Board System

- Projects with embedded columns and tasks (single JSON read loads full board)
- Default columns: To Do, In Progress, Review, Done
- Tasks have priority (low/medium/high/urgent), labels, due dates, descriptions
- Drag-and-drop via `@dnd-kit` with `PointerSensor` + `TouchSensor` + `KeyboardSensor`
- `TouchSensor` uses `{ delay: 200, tolerance: 5 }` for mobile compatibility
- Optimistic updates: local state updates immediately, API persists in background
- Dedicated reorder endpoint recalculates sortOrder atomically
- AI Coach (Marcus Rivera) has full board context injected into system prompt

### Mobile / iOS Considerations

- Radix Select inside Dialog/Sheet: use `modal={false}` on the Dialog/Sheet to prevent iOS `inert` attribute from blocking touch events on portaled Select content
- Column widths: `w-[260px] sm:w-[300px]` for mobile responsiveness
- TouchSensor delay prevents conflict with scroll gestures

### Code Block Rendering

- Custom `CodeBlock` component with syntax highlighting and copy button
- `not-prose` wrapper to opt out of typography plugin styles
- Article element has `[&_pre_code]:bg-transparent` overrides to fix prose-code conflicts
- Copy button always semi-visible: `opacity-60 hover:opacity-100`

### Panic Corner

- Mouse velocity detection triggers redirect to innocent websites
- Parameters: CORNER_ZONE=120px, SPEED_THRESHOLD=1800px/s, SAMPLE_WINDOW=200ms
- localStorage queue cycles through sites without repeats, reshuffles when exhausted
- No directional constraint — any fast movement into upper-right corner triggers

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Pages (18)

```text
/                           Dashboard
/ask                        Ask Claude (general chat)
/learn                      Learning tracks overview
/learn/[track]              Track landing page
/learn/[track]/[slug]       Individual lesson
/my-courses                 Custom courses list
/my-courses/new             Create new course
/my-courses/[id]            View course
/my-courses/[id]/edit       Edit course
/skills                     Skills hub
/skills/tutor               Skill tutor wizard
/skills/coach               Project coach (Marcus Rivera)
/instructors/[id]           Instructor profile + chat
/projects                   Project list
/projects/new               Create new project
/projects/[id]              Kanban board
/progress                   Progress tracking
/settings                   Settings
```

## API Routes (15)

```text
/api/chat                   General chat
/api/chat/lesson            Lesson-specific chat
/api/chat/persona           Persona-based chat
/api/chat/project-coach     Marcus Rivera project coaching
/api/skills/tutor           Skills tutor
/api/skills/coach           Skills coach
/api/courses                GET all / POST new custom course
/api/courses/[id]           GET / PUT / DELETE custom course
/api/projects               GET all / POST new project
/api/projects/[id]          GET / PUT / DELETE project
/api/projects/[id]/tasks              POST new task
/api/projects/[id]/tasks/[taskId]     PUT / DELETE task
/api/projects/[id]/tasks/reorder      POST drag-and-drop reorder
/api/projects/[id]/columns            POST new / DELETE column
/api/projects/[id]/columns/reorder    POST reorder columns
```

## File Organization

```text
src/app/                    Pages and API routes
src/components/
  chat/                     Chat interface
  courses/                  Course editor, delete button
  instructors/              Persona chat
  layout/                   Sidebar, header, panic corner
  learn/                    Lesson renderer, code block, lesson chat, MDX components
  projects/                 Kanban board, columns, task cards, dialogs, AI coach
  skills/                   Tutor wizard, coach chat, assessment steps
  ui/                       shadcn/ui primitives (23 components)
src/lib/
  ai/                       System prompts, context prompts, personas
  content/                  Content loader, custom courses, projects
  data-dir.ts               Vercel-aware data directory resolution
  utils.ts                  Tailwind class merge utility
content/                    MDX training content (3 tracks, 5 lessons)
data/                       Runtime data (custom courses, projects JSON) - gitignored on Vercel
docs/                       Standalone project documentation HTML (navy/teal theme)
```

## Rules

- Never modify files outside `C:\Claude Projects\For Galen\for-galen`
- The `docs/` directory uses a standalone navy/teal HTML design - separate from the website
- The website UI uses shadcn/ui + Tailwind CSS - never mix with docs theme
- Always test `npm run build` before committing to ensure no TypeScript errors
- Data storage uses filesystem JSON - ephemeral on Vercel, persistent locally
- Environment variable `ANTHROPIC_API_KEY` required for AI features
- Push to `master` branch for auto-deployment to Vercel
