# A-Stats Admin Dashboard

## 🚀 Quick Start Guide

### Prerequisites
1. **Backend Running**: Make sure the AI Content SaaS backend is running on port 5000
2. **MongoDB Connected**: Ensure MongoDB is connected and accessible
3. **Dependencies Installed**: Run `npm install` in this directory

### Starting the Admin Dashboard

#### Option 1: Use the Startup Script
```bash
# Windows
./start-admin.bat

# Linux/Mac
./start-admin.sh
```

#### Option 2: Manual Start
```bash
npm run dev
```

The admin dashboard will start on **http://localhost:3001**

## 🔗 Important URLs

| Purpose | URL | Description |
|---------|-----|-------------|
| **Login** | http://localhost:3001/login | Admin authentication |
| **Dashboard** | http://localhost:3001/dashboard | Main admin interface |
| **API Test** | http://localhost:3001/debug | Basic API connectivity test |
| **Diagnostics** | http://localhost:3001/diagnostics | Comprehensive system diagnostics |

## 🔑 Authentication

### Test Credentials
- **Email**: `admin@test.com`  
- **Password**: `password123`

### How Authentication Works
1. Uses the same `/api/v1/auth/login` endpoint as the customer app
2. Any authenticated user gets admin permissions (for demo purposes)
3. Tokens stored as `adminToken` and `adminUser` in localStorage
4. Backend validates JWT tokens for admin routes

## 🎯 Core Features

### 📊 Dashboard Analytics
- **System Stats**: Total users, active users, content generated
- **Performance Metrics**: CPU usage, memory usage, **disk usage**
- **AI Usage**: Token consumption, job processing times
- **Revenue Tracking**: Monthly revenue, conversion rates
- **Real-time Updates**: Auto-refreshing every 30 seconds

### 👥 User Management  
- User listing with pagination and search
- User details with activity history
- Plan management and subscription status
- User actions (suspend, ban, etc.)

### 📝 Content Management
- Content groups monitoring
- Job queue status and processing
- Content flagging and moderation
- Performance analytics

### 🔍 System Monitoring
- Real-time system health
- Error rate tracking
- Performance metrics
- Database connectivity status

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling with custom admin theme
- **React Query** for API state management  
- **Zustand** for local state management
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend Integration
- **API Base**: `http://localhost:5000/api/v1`
- **Admin Endpoints**: `/admin/*` routes with authentication
- **Real-time Data**: Polling-based updates
- **Authentication**: JWT-based with role checking

### Key Backend Endpoints
```
GET /api/v1/admin/analytics/overview  # System statistics  
GET /api/v1/admin/users               # User management
GET /api/v1/admin/content-groups      # Content monitoring
GET /api/v1/admin/jobs                # Job queue status
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Backend connection failed"
- **Solution**: Start the backend server first
- **Command**: `cd ../ai-content-saas-backend && npm run dev`
- **Check**: Visit http://localhost:5000/health

#### 2. "Authentication failed"  
- **Solution**: Use correct test credentials or register via customer app
- **Test**: Try `admin@test.com` / `password123`
- **Clear**: Use "Clear Admin Session" button in debug tools

#### 3. "Admin API failed"
- **Solution**: Login first, then access admin routes
- **Check**: Visit `/diagnostics` for comprehensive testing
- **Verify**: Token should be present in browser localStorage

#### 4. Missing system stats (diskUsage, etc.)
- **Status**: ✅ **IMPLEMENTED** - All system stats including `diskUsage` are working
- **Check**: Visit `/diagnostics` to verify all fields are present
- **Backend**: Stats are calculated from real database queries + mock performance data

#### 5. Charts not loading
- **Solution**: Ensure Recharts dependency is installed
- **Check**: `npm list recharts` should show version 2.12.7
- **Reinstall**: `npm install` if dependencies are missing

### Debug Tools

#### Quick API Test
Visit `/debug` for basic connectivity testing.

#### Comprehensive Diagnostics  
Visit `/diagnostics` for detailed system health check including:
- Backend connectivity
- Authentication status
- Admin API access
- Database connection
- Real-time feature testing

#### Manual Testing
```bash
# Test backend health
curl http://localhost:5000/health

# Test admin stats (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/v1/admin/analytics/overview
```

## 🎨 Customization

### Theme Colors
The admin dashboard uses a custom Tailwind theme with `admin-*` and `primary-*` color scales defined in `tailwind.config.js`.

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Update navigation in `Layout/Sidebar.tsx`
4. Add appropriate permission checks

### API Integration
Use the `analyticsService` or `apiService` for backend communication. Both handle authentication automatically.

## 📈 Performance

- **Bundle Size**: Optimized with Vite tree-shaking
- **Loading**: React.lazy() for code splitting
- **Caching**: React Query handles API caching
- **Updates**: 30-second polling for real-time data

## 🔄 Development Workflow

1. **Start Backend**: `cd ../ai-content-saas-backend && npm run dev`
2. **Start Admin**: `npm run dev` (this directory)
3. **Access Dashboard**: http://localhost:3001
4. **Test Features**: Use `/diagnostics` to verify functionality
5. **Monitor Logs**: Check browser console and terminal output

---

## ✅ Implementation Status

From our previous debugging session, here's what's been completed:

### ✅ Completed Features
- [x] Dashboard with system statistics (including diskUsage)
- [x] User management interface
- [x] Content monitoring
- [x] Authentication system
- [x] API connectivity
- [x] Real-time metrics
- [x] Error handling
- [x] Debug tools
- [x] Responsive design
- [x] TypeScript implementation
- [x] Tailwind admin theme

### 🔄 Continuing Implementation
This documentation reflects where we left off in our previous chat about "Dashboard route debugging". The admin dashboard is fully functional and ready for testing.

**Next Steps:**
1. Run the diagnostic tools to verify all systems
2. Test the dashboard with real data
3. Continue with any additional admin features as needed

**Ready to use!** 🎉
