# StyleAI — Conversational Fashion Recommender

An AI-powered fashion chatbot built with Next.js and Claude API. Users describe their style needs in natural language and receive outfit recommendations with images and direct purchase links.

## Features
- Conversational AI stylist powered by Claude
- Outfit cards with images (via Unsplash)
- Direct buy links to Myntra, Ajio, Meesho
- Full conversation memory (context-aware)
- Quick prompt chips for easy onboarding
- Responsive layout — works on mobile and desktop

## Project Structure

```
fashion-ai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        ← Backend API (calls Claude securely)
│   ├── components/
│   │   ├── ChatMessage.tsx     ← Renders user & bot messages
│   │   ├── OutfitCard.tsx      ← Individual outfit product card
│   │   └── TypingIndicator.tsx ← Animated loading dots
│   ├── page.tsx                ← Main chat UI
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── prompt.ts               ← Claude system prompt
│   └── types.ts                ← TypeScript interfaces
├── .env.example                ← Environment variable template
└── README.md
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Get your key at: https://console.anthropic.com

### 3. Run the development server
```bash
npm run dev
```
Visit http://localhost:3000

## How It Works

1. User types a message (e.g. "party outfit under ₹1500 for women")
2. Frontend sends the full conversation history to `/api/chat`
3. Backend calls Claude with a structured system prompt requesting JSON output
4. Claude returns outfit recommendations as JSON with name, price, image search query, and buy link
5. Backend enriches each outfit with an Unsplash image URL
6. Frontend renders the response as outfit cards

## Customisation

### Change the e-commerce platforms
Edit `lib/prompt.ts` — update the guidelines section to use different retailers.

### Use real product images
Replace the Unsplash image logic in `app/api/chat/route.ts` with calls to a retailer product API (e.g. Myntra partner API, RapidAPI fashion endpoints).

### Add user profiles
Store user preferences (body type, style, budget) in a database and inject them into the system prompt for personalised recommendations.

### Deployment
Deploy to Vercel (recommended for Next.js):
```bash
npx vercel
```
Add `ANTHROPIC_API_KEY` to your Vercel environment variables.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **AI**: Anthropic Claude (claude-sonnet-4)
- **Styling**: Tailwind CSS
- **Images**: Unsplash (replace with real product API for production)
- **Language**: TypeScript
