# StudyForge AI — Next.js prototype

A responsive exam-preparation workspace built with Next.js, React, TypeScript, Recharts, Lucide icons and browser-local storage.

## Run locally

1. Install Node.js 20 or newer.
2. Extract this folder and open a terminal inside it.
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3000

## Included in this prototype

- Responsive dashboard and mobile navigation
- Chapter workspace generator with class, subject, board and language selectors
- Structured study notes, revision checklist, question prompts and method/formula templates
- Visual studio with an interactive Recharts sample chart and visual-layout templates
- Interactive practice question with answer feedback
- YouTube transcript text analyser that runs locally in the browser
- Dark/light theme, font family and reading-size controls
- Save the current study pack in localStorage on this device
- Export a Word (.docx) study pack
- Print styles for saving the current page as PDF using the browser print dialog

## Important scope notes

This is a functioning **front-end prototype**, not a connected generative-AI service. The chapter generator currently produces a useful structured template, not verified chapter-specific textbook content. For production-quality notes, connect `generate()` in `app/page.tsx` to a server-side AI route and provide the official syllabus/textbook as grounding material. Do not expose provider API keys in browser code.

The YouTube analyser works on transcript/caption text pasted by the user. A video URL alone does not make captions available. To support automatic transcript retrieval, connect a permitted transcript/caption provider or a backend that respects YouTube's terms and copyright. Use transcripts to create original summaries and practice questions, not to reproduce long passages.

PDF export uses the browser's **Print / Save as PDF** flow; Word export is generated locally in the browser. Study pack saving uses localStorage and stays in the current browser/device.

## Recommended next production steps

- Add `/api/study-pack` with server-side model access, schema validation and rate limiting.
- Ground answers in uploaded textbook PDFs / syllabus and show source references.
- Implement actual downloadable SVG/PNG diagrams and a dedicated one-page print stylesheet.
- Add transcript source attribution and confidence labels to extracted exam signals.
- Add accessible keyboard navigation, tests, error states and secure upload handling.
