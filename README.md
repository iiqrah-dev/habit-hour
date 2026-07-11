# 🌱 Habit Hour

A mindful livestream experience designed to help you step away from endless scrolling and spend intentional time on habits that nourish your mind, creativity, and wellbeing.

# 🛠️ Tech Stack

Built using:

* **React** — Component-based UI architecture
* **TypeScript** — Type-safe development
* **Vite** — Fast modern frontend tooling
* **Tailwind CSS** — Responsive styling and design system
* **Vercel Serverless Functions** — Lightweight backend API routes
* **Git & GitHub** — Version control and collaboration

---

# 🏗️ Architecture

Habit Hour uses a modern serverless architecture:

```
React + Vite Frontend
        |
        |
        ↓
Vercel Deployment
        |
        ├── /api/quote
        ├── /api/word
        └── /api/truthordare
```

The application originally used an Express server during development and was refactored into serverless API functions for a simpler, scalable deployment approach.

---

# 🔌 API Design

The project uses lightweight API endpoints to keep external data fetching separate from the frontend:

### `/api/quote`

Fetches an inspirational quote with fallback handling for reliability.

### `/api/word`

Returns curated Spanish vocabulary designed around learning and personal growth.

### `/api/truthordare`

Provides interactive prompts while maintaining fallback content if external services are unavailable.

---

# 🚀 Running Locally

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Start the development environment:

```bash
vercel dev
```

The application will run locally with Vercel-style API routes.

---

# 👩‍💻 Built By Iqrah N.

Created as a personal project combining:

* Frontend development
* UI/UX design
* Creative technology
* Habit-building concepts
* Vibe Coding

Thanks for checking out Habit Hour 🌱
