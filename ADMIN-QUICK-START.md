# Admin Dashboard - Quick Start Guide

## 🚀 Getting Started

### 1. Create Test Admin User

Before you can login to the admin dashboard, you need to create a test admin user in your database.

**Option A: Run the batch file (Windows)**
```bash
cd ai-content-saas-backend
create-test-admin.bat
```

**Option B: Run the npm script**
```bash
cd ai-content-saas-backend
npm run create-admin
```

**Option C: Run the script directly**
```bash
cd ai-content-saas-backend
node scripts/create-test-admin.js
```

### 2. Login to Admin Dashboard

Once the test user is created, you can login with:

- **URL:** http://localhost:3001/login
- **Email:** admin@test.com
- **Password:** password123

## 📝 What the Script Does

The `create-test-admin.js` script will:
1. Connect to your MongoDB database
2. Check if the admin user already exists
3. Create a new user or update the existing one's password
4. Display success message with login credentials

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
- Make sure your MongoDB is running
- Check your `.env` file has the correct `MONGODB_URI`
- For local MongoDB: `mongodb://localhost:27017/ai-content-saas-dev`
- For MongoDB Atlas: Use your connection string

### "Invalid credentials" when logging in
- Run the `create-admin` script again to reset the password
- Make sure the backend is running on port 5000
- Check browser console for any API errors

### Backend not connecting to admin dashboard
- Verify backend is running: `npm run dev` in backend folder
- Check CORS settings in backend include `http://localhost:3001`
- Make sure API URL in admin dashboard is correct (check `.env` file)

## 🎯 Available Admin Features

Once logged in, you can access:

- **Dashboard** - Overview of system metrics and activity
- **Users Management** - View, edit, suspend, and manage users
- **Content Management** - View and manage all content created by users
- **Jobs Management** - Monitor AI job queue and processing status
- **Settings** - Configure email service, AI settings, and system features

## 🔐 Security Notes

- The test credentials are for **development only**
- In production, use strong passwords and proper authentication
- Change default credentials before deploying to production
- Consider implementing 2FA for admin accounts in production

## 📚 Next Steps

1. Create your test admin user (see above)
2. Start the backend: `cd ai-content-saas-backend && npm run dev`
3. Start the admin dashboard: `cd ai-content-saas-admin && npm run dev`
4. Login at http://localhost:3001/login
5. Explore the admin features!

---

**Need help?** Check the main project README or create an issue on GitHub.
