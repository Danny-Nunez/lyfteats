# Local Development Setup Guide

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File

Create a `.env.local` file in the root directory (`lyfteats/`) with the following:

```bash
# MongoDB Connection String
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Secrets (generate secure random strings)
ACCESS_TOKEN_SECRET=generate-a-random-string-here
REFRESH_TOKEN_SECRET=generate-a-different-random-string-here

# Stripe Test Keys
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Vercel Blob Storage Token
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here

# Google Maps API Key
REACT_APP_GOOGLE=your_google_maps_api_key_here
```

### 3. Generate JWT Secrets

Run these commands to generate secure random secrets:

```bash
# Generate ACCESS_TOKEN_SECRET
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Generate REFRESH_TOKEN_SECRET  
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output into your `.env.local` file.

### 4. Get Your Credentials

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create a database user
4. Get connection string: Database → Connect → Connect your application
5. Replace `<password>` and `<dbname>` in the connection string

#### Stripe Test Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)

#### Vercel Blob Token
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Storage → Blob → Create Store
3. Copy the `BLOB_READ_WRITE_TOKEN`

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Places API
3. Create credentials (API Key)
4. Copy the API key

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Troubleshooting

### Error: `DB_URI` is undefined
- Make sure `.env.local` exists in the root directory
- Check that `DB_URI` is set (no typos)
- Restart the dev server after creating/modifying `.env.local`

### MongoDB Connection Error
- Verify your connection string is correct
- Check MongoDB Atlas IP whitelist (add your IP or `0.0.0.0/0` for testing)
- Ensure database user credentials are correct

### Images Not Uploading
- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check the token hasn't expired
- Review browser console for errors

### Build Errors
- Ensure Node.js version is 18.x or 20.x: `node --version`
- Delete `node_modules` and `package-lock.json`, then `npm install` again
- Check for TypeScript errors if using TypeScript

## Important Notes

- **Never commit `.env.local`** - it's already in `.gitignore`
- **Use test keys** for local development (Stripe test mode, etc.)
- **Restart server** after changing environment variables
- For production, set these in Vercel Dashboard → Settings → Environment Variables

