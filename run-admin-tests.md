# Admin Dashboard Testing Guide

## Current Status
Based on our analysis, the admin dashboard has the following components ready:
- ✅ React Query setup
- ✅ Authentication store with Zustand
- ✅ Backend admin routes (`/api/v1/admin/*`)
- ✅ Admin-specific UI components
- ✅ Proper TypeScript types
- ✅ Tailwind configuration with admin theme

## Issues to Address

### 1. Authentication Flow
The admin app currently:
- Uses regular `/auth/login` endpoint (✅ GOOD)
- Transforms regular users to admin format (✅ GOOD for demo)
- Stores tokens in localStorage as `adminToken` (✅ GOOD)

### 2. API Connectivity
Backend has these admin endpoints ready:
- `GET /api/v1/admin/analytics/overview` - System stats (✅ IMPLEMENTED)
- `GET /api/v1/admin/users` - User management (✅ IMPLEMENTED)  
- `GET /api/v1/admin/content-groups` - Content management (✅ IMPLEMENTED)
- `GET /api/v1/admin/jobs` - Job monitoring (✅ IMPLEMENTED)

### 3. System Stats Implementation
The `diskUsage`, `cpuUsage`, `memoryUsage` are properly implemented in backend with mock data that updates dynamically.

## Next Steps

1. **Test the Current Setup**
   ```bash
   # Terminal 1 - Start Backend
   cd ai-content-saas-backend
   npm run dev

   # Terminal 2 - Start Admin Dashboard  
   cd ai-content-saas-admin
   npm run dev
   ```

2. **Access Debug Page**
   - Go to: `http://localhost:3001/debug`
   - This will test all API connectivity

3. **Login Test**
   - Go to: `http://localhost:3001/login` 
   - Use any credentials from the customer app
   - Should automatically get admin permissions

4. **Dashboard Test**
   - After login, go to dashboard
   - Should see system stats including `diskUsage`
   - Charts should render with Recharts

## Expected Behavior
- Admin dashboard should connect to backend on port 5000
- Authentication should work using existing user credentials
- System stats should display properly with real data from MongoDB
- All admin-specific styling should work with the admin Tailwind theme
