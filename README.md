# Jennifer Feenstra-Arengård — Portfolio

Interactive portfolio for **Jennifer Feenstra-Arengård**, a full-stack developer with a PhD background in developmental and cancer biology.

The site is meant to be shared with prospective employers. It has two ways in:

- A **traditional portfolio** (about, skills, and selected work)
- An **interactive lab** you can walk through to discover the same story at stations (bench, microscope, computer, lounge)

I prototyped the first version in [Lovable](https://lovable.dev), then moved the project here to own the codebase, keep iterating, and ship it from GitHub.

**Live site:** _soon to be found here_  
**LinkedIn:** [jennifer-feenstra-arengard](https://www.linkedin.com/in/jennifer-feenstra-arengard/)  
**Email:** [jennifer.feenstra.arengard@gmail.com](mailto:jennifer.feenstra.arengard@gmail.com)

## What’s in the lab

Walk the scientist to a station (or tap it on mobile). The character pathfinds around obstacles, then opens that station’s panel:

| Station            | What it covers                             |
| ------------------ | ------------------------------------------ |
| Chemical bench     | Background and research-to-code transition |
| Microscope         | Skills and how I work                      |
| Computer           | Selected projects (Partnex, Floccs, CVOOM) |
| Lounge / bookshelf | Contact and next steps                     |

Visit all four stations to unlock the exit. Layout and popups are built for desktop, tablet, and phone.

## Stack

React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, React Router, Vitest.

## Run locally

Requires Node.js and npm.

```sh
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:8080`).

```sh
npm run build    # production build
npm run preview  # serve the production build
npm test         # vitest
```

## Development notes

Early UI and structure came from Lovable. Ongoing work happens in this repo.
