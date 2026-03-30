# Vercel Deployment Guide 🚀

Follow these steps to deploy TripVision to Vercel and ensure all collaborative features work in production.

## 1. Environment Variables 🔐

Add these variables in your **Vercel Project Settings > Environment Variables**. You can copy them directly from your `.env.local`.

### Public Client-Side Keys
These enable the Firebase Web SDK in the browser.

| KEY | VALUE (from .env.local) |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyAjiZo0SHAxhTK8Dc6lFqHISa-yCTtNDDA` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `studio-3321348931-beb41.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `studio-3321348931-beb41` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `studio-3321348931-beb41.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `622758752034` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:622758752034:web:23934b408192779bd63f7b` |

### Private Server-Side Secrets
These empower the AI and Administrative features.

| KEY | VALUE |
|-----|-------|
| `FIREBASE_PROJECT_ID` | `studio-3321348931-beb41` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@studio-3321348931-beb41.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | *(See note below)* |
| `GEMINI_API_KEY` | `AIzaSyCwY1b3g_EPDSfNKva6v5bA3xnaJM3lXnE` |

> [!IMPORTANT]
> **Handling the FIREBASE_PRIVATE_KEY on Vercel:**
> When pasting the private key into Vercel, wrap it in double quotes if it contains `\n` characters, or paste the raw multi-line block. Our code handles both formats.
> Example: `"-----BEGIN PRIVATE KEY-----\n...your_key...\n-----END PRIVATE KEY-----\n"`

---

## 2. Firebase Console Configuration ⚙️

To allow users to sign in from your new production URL, you must authorize it:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Authentication** > **Settings** > **Authorized Domains**.
3.  Click **Add Domain** and enter your Vercel deployment URL (e.g., `trip-vision-alpha.vercel.app`).
4.  Also add your custom domain if you have one.

---

## 3. Build Configuration 🏗️

The project is already configured with a `next.config.ts` that:
- Ignores TypeScript/ESLint errors during the Vercel build to ensure the site goes live.
- Correctly handles `firebase-admin` isolation for the Next.js edge runtime.

---

## 4. Deployment Command 🚀

If you have the Vercel CLI installed:
```bash
vercel --prod
```
Or simply **Connect your GitHub Repository** to Vercel and it will deploy automatically on every push!
