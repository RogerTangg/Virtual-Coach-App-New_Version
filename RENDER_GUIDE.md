# Render Deployment Guide

## Option 1: Automatic Deployment (Recommended)

This project includes a `render.yaml` file for automatic configuration (Infrastructure as Code).

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` configuration.
5. Click **Apply**.

This will automatically set up:
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- SPA Rewrite Rules (for React Router)

## Option 2: Manual Setup

If you prefer to set it up manually as a **Static Site**:

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Static Site**.
3. Connect your GitHub repository.
4. Configure the following settings **exactly**:

| Setting | Value |
|---------|-------|
| **Name** | `virtual-coach-app` (or your choice) |
| **Root Directory** | `frontend` (IMPORTANT!) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

5. **Advanced Settings (Crucial for React Router):**
   - Go to the **Redirects/Rewrites** tab.
   - Add a new rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`

   *This ensures that refreshing the page on a sub-route (e.g., `/profile`) doesn't cause a 404 error.*
