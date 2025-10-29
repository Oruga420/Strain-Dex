<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zCpbypBKe7BsUNYHJTnY_BhR1XVVenn7

## Run Locally

**Prerequisites:** Node.js 20.19+ (or 22.x) and the [Vercel CLI](https://vercel.com/docs/cli)

1. Install dependencies: `npm install`
2. Set the Gemini key in `.env.local` (create it if missing):
   ```bash
   GEMINI_API_KEY=your-google-genai-key
   VITE_API_BASE_URL=http://localhost:3000
   ```
3. Start the full stack locally (Vite + serverless functions): `vercel dev`
4. Open the printed URL (default http://localhost:3000) to use the app.

## Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. In Project Settings → Environment Variables add `GEMINI_API_KEY` with your Gemini API key.
3. Deploy. Vercel runs `npm run build`, serves `dist/`, and exposes the serverless endpoint at `/api/analyze`.
