# For Galen - Project Guidelines

## Project Overview
Personalized IT Manager Training Platform for Galen. Deployed on Vercel.
Next.js 16 + shadcn/ui + Tailwind CSS 4 + Vercel AI SDK v6 + Anthropic Claude.

## Tech Stack
- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **UI**: shadcn/ui (new-york style) + Tailwind CSS 4
- **AI**: Vercel AI SDK v6 (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`)
- **Content**: MDX files with `next-mdx-remote/rsc` + `gray-matter`
- **Deployment**: Vercel

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

### AI Persona System
- 4 personas defined in `src/lib/ai/personas.ts`
- Mapped to tracks via `getPersonaForTrack()` and chat contexts via `getPersonaForContext()`
- Each persona has `systemPromptAddition` injected into chat system prompts
- Track `_meta.json` files include `authorId` field

### Content Structure
- MDX lessons in `content/{track-slug}/{lesson-slug}.mdx`
- Track metadata in `content/{track-slug}/_meta.json`
- Custom courses stored as JSON in `data/custom-courses.json`

## Commands
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## File Organization
```
src/app/           # Pages and API routes
src/components/    # React components (layout, chat, learn, skills, courses, ui)
src/lib/ai/        # AI system prompts, context prompts, personas
src/lib/content/   # Content loader, custom courses
content/           # MDX training content
data/              # Runtime data (custom courses JSON)
docs/              # Project documentation HTML (navy/teal theme, separate from site)
```

## Rules
- Never modify files outside `C:\Claude Projects\For Galen\for-galen`
- The `docs/` directory uses a standalone navy/teal HTML design - separate from the website
- The website UI uses shadcn/ui + Tailwind CSS - never mix with docs theme
- Always test `npm run build` before committing to ensure no TypeScript errors
- Custom courses API uses filesystem JSON storage (no database yet)
- Environment variable `ANTHROPIC_API_KEY` required for AI features
