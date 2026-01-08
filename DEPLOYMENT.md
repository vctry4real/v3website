# Deploying vctry4real to Vercel

Since your project is built with **Next.js**, deploying to **Vercel** is the easiest and most optimized path. Vercel is the company behind Next.js, so the integration is seamless.

## Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to a GitHub repository.
    *   If you haven't done this yet, initialize git and push your code:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        # Then follow GitHub's instructions to add remote and push
        ```
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you haven't already.

## Step-by-Step Deployment Guide

### 1. Import Project to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your git provider (e.g., GitHub) and find your `vctry4real` repository.
4.  Click **"Import"**.

### 2. Configure Project

Vercel will automatically detect that you are using Next.js. Most settings can be left as default.

*   **Framework Preset**: Next.js (Automatic)
*   **Root Directory**: `./` (Default)
*   **Build Command**: `next build` (Default)
*   **Output Directory**: `.next` (Default)

### 3. Environment Variables (CRITICAL)

You **MUST** add your environment variables for the Supabase connection to work.

1.  Expand the **"Environment Variables"** section.
2.  Add the following variables (copy values from your local `.env.local` file):

    *   **Name**: `NEXT_PUBLIC_SUPABASE_URL`
    *   **Value**: `your_supabase_url_here` (e.g., `https://xyz.supabase.co`)

    *   **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   **Value**: `your_supabase_anon_key_here`

3.  If you have any other secrets (e.g., for email services or admin auth), add them here as well. Note: `NEXT_PUBLIC_` variables are exposed to the browser, while others are server-only.

### 4. Deploy

1.  Click **"Deploy"**.
2.  Vercel will clone your repo, install dependencies, run the build, and deploy.
3.  Once finished, you will get a live URL (e.g., `vctry4real.vercel.app`).

## Troubleshooting Common Issues

*   **Build Errors**: If the deployment fails, check the "Logs" tab in Vercel. Common causes are strict TypeScript errors.
    *   *Quick Fix*: You can temporarily disable strict type checking during build by editing `next.config.js` (not recommended for long term), or better, fix the specific type errors locally and push.
*   **Supabase Connection Failed**: Ensure you copied the Environment Variables exactly without extra spaces or quotes.

## Updating Your Site

Whenever you push changes to your GitHub "main" branch, Vercel will automatically trigger a new deployment.
