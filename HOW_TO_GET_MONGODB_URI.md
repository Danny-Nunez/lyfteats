# How to Get Your MongoDB Atlas Connection URI

Follow these steps to get your MongoDB connection string from your existing cluster:

## Step-by-Step Guide

### 1. Log into MongoDB Atlas
- Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
- Sign in to your account

### 2. Select Your Project
- If you have multiple projects, click on the project that contains your cluster

### 3. Navigate to Database Access
- In the left sidebar, click **"Database Access"** (or **"Security"** → **"Database Access"**)
- Make sure you have a database user created. If not:
  - Click **"Add New Database User"**
  - Choose **"Password"** authentication
  - Enter a username and password (save these!)
  - Set privileges to **"Read and write to any database"** (or more restrictive if needed)
  - Click **"Add User"**

### 4. Whitelist Your IP Address
- In the left sidebar, click **"Network Access"** (or **"Security"** → **"Network Access"**)
- Click **"Add IP Address"**
- For local development, click **"Add Current IP Address"** 
- Or click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`) - use this for Vercel deployment
- Click **"Confirm"**

### 5. Get Your Connection String
- Go back to the **"Database"** section (left sidebar)
- Click **"Connect"** button on your cluster
- Choose **"Connect your application"** (drivers icon)
- Select **"Node.js"** as your driver (version doesn't matter much)
- Copy the connection string - it looks like:
  ```
  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

### 6. Customize Your Connection String

Replace the placeholders:
- Replace `<username>` with your database username
- Replace `<password>` with your database password (URL-encode special characters if any)
- Optionally add your database name at the end:
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/your-database-name?retryWrites=true&w=majority
  ```

### 7. Add to Your `.env.local`

```env
DB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/your-database-name?retryWrites=true&w=majority
```

## Example

If your:
- Username: `myuser`
- Password: `mypass123`
- Cluster: `cluster0.abc123.mongodb.net`
- Database name: `lyfeats`

Your connection string would be:
```
DB_URI=mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/lyfeats?retryWrites=true&w=majority
```

## Important Notes

1. **Password Encoding**: If your password contains special characters, you may need to URL-encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - `%` becomes `%25`
   - `&` becomes `%26`

2. **Database Name**: You can either:
   - Specify it in the connection string: `...mongodb.net/lyfeats?...`
   - Or omit it and MongoDB will use the default or create one when you first write

3. **Test the Connection**: After adding to `.env.local`, restart your dev server and check if the connection works.

## Troubleshooting

### "Authentication failed" or "bad auth"
**Common causes:**

1. **Remove angle brackets**: If you copied from Atlas, make sure to remove `<` and `>`:
   - ❌ Wrong: `mongodb+srv://<username>:<password>@...`
   - ✅ Correct: `mongodb+srv://username:password@...`

2. **Password with special characters**: If your password contains special characters, URL-encode them:
   - Common characters that need encoding:
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`
     - `&` → `%26`
     - `+` → `%2B`
     - `/` → `%2F`
     - `=` → `%3D`
   
3. **Verify user exists**: 
   - Go to "Database Access" in MongoDB Atlas
   - Make sure the user `lyfteats` exists
   - Check the username is spelled exactly (case-sensitive)

4. **Reset password if needed**:
   - Go to "Database Access" → Click on your user → "Edit" → "Edit Password"
   - Use a simple password without special characters for easier setup
   - Update your connection string with the new password

5. **User permissions**:
   - Make sure user has "Read and write to any database" or appropriate permissions
   - User type should be "Password" (not "Certificate" or "AWS IAM")

### "IP not whitelisted"
- Go to "Network Access" and add your IP address
- For Vercel deployment, add `0.0.0.0/0`

### "Timeout" or "Connection refused"
- Check your cluster is running (status should be green)
- Verify network access settings
- Make sure you're using the correct cluster endpoint

