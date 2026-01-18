# How to Get Your Vercel Blob Storage Token

Follow these steps to get your `BLOB_READ_WRITE_TOKEN` for file uploads:

## Step-by-Step Guide

### 1. Log into Vercel
- Go to [https://vercel.com](https://vercel.com)
- Sign in with your account (GitHub, GitLab, or email)

### 2. Navigate to Storage
- In the top navigation, click **"Storage"**
- Or go directly to: [https://vercel.com/storage](https://vercel.com/storage)

### 3. Create a Blob Store (if you don't have one)
- Click **"Create Store"** or **"Add Storage"**
- Select **"Blob"** from the options
- Give it a name (e.g., "lyfeats-blob" or "lyfeats-storage")
- Choose a region closest to your users (or default)
- Click **"Create"**

### 4. Get Your Token
After creating the store, you'll see the store details page:

**Option A: From Store Settings**
1. Click on your Blob store name to open it
2. Go to **"Settings"** tab
3. Look for **"Access Tokens"** or **"Token"** section
4. You should see a token that starts with `vercel_blob_rw_...`
5. Click **"Copy"** or **"Show"** to reveal and copy the token

**Option B: From Store Overview**
1. On the store overview page
2. Look for a section showing connection details
3. Find the **"Token"** or **"Read/Write Token"**
4. Copy the token (starts with `vercel_blob_rw_...`)

**Option C: Create New Token (if needed)**
1. Go to Store → Settings → Access Tokens
2. Click **"Create Token"** or **"Generate Token"**
3. Name it (e.g., "lyfeats-dev-token")
4. Select permissions: **"Read and Write"**
5. Click **"Generate"** or **"Create"**
6. **IMPORTANT**: Copy the token immediately - you won't see it again!
7. If you lose it, you'll need to create a new one

### 5. Add to Your `.env.local`

Add the token to your environment file:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx
```

**Example:**
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_abc123def456ghi789jkl012mno345pqr678stu901vwx234
```

## Visual Guide

```
Vercel Dashboard
  └── Storage (in top nav)
       └── Blob Stores
            └── Your Store Name (click it)
                 └── Settings Tab
                      └── Access Tokens
                           └── Copy the token (starts with vercel_blob_rw_)
```

## Free Tier Details

- **Storage**: 1 GB free
- **Bandwidth**: 10 GB/month free
- **Operations**: 10,000 reads + 2,000 writes/month free
- Perfect for demo projects!

## Troubleshooting

### "I don't see Storage option"
- Make sure you're logged into Vercel
- Some accounts might need to verify email first
- Try refreshing the page

### "I can't create a Blob store"
- Check if you're on a free account (Hobby plan)
- Free tier includes Blob storage
- Contact Vercel support if you still can't create one

### "Token doesn't work"
- Make sure you copied the entire token (they're long!)
- Check for any spaces before/after when pasting
- Verify the token starts with `vercel_blob_rw_`
- Try generating a new token if the old one doesn't work

### "I lost my token"
- Go to Store Settings → Access Tokens
- Delete the old token (if you remember which one)
- Create a new token
- Update your `.env.local` with the new token

## Important Notes

1. **Keep tokens secret**: Never commit tokens to Git (they're in `.gitignore`)
2. **One token per environment**: You can use the same token for dev/prod or create separate ones
3. **Token format**: Should start with `vercel_blob_rw_` followed by a long string
4. **Restart server**: After adding token to `.env.local`, restart your dev server

## For Production (Vercel Deployment)

When deploying to Vercel:
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add `BLOB_READ_WRITE_TOKEN` with your token value
4. Select environments (Production, Preview, Development)
5. Redeploy your project

## Quick Checklist

- [ ] Logged into Vercel
- [ ] Created a Blob store
- [ ] Copied the token (starts with `vercel_blob_rw_`)
- [ ] Added to `.env.local` as `BLOB_READ_WRITE_TOKEN`
- [ ] Restarted dev server

