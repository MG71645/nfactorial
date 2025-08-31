# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn

## Quick Start

### Option 1: Using the start script (Recommended)
```bash
./start.sh
```

### Option 2: Manual setup
```bash
# Install all dependencies
npm run install:all

# Initialize database
cd backend && npm run db:init && cd ..

# Start development servers
npm run dev
```

## Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Features Available
- ✅ User registration and login
- ✅ Create and view posts
- ✅ Like and comment on posts
- ✅ User profiles with bio editing
- ✅ Dark/light theme toggle
- ✅ Responsive design
- ✅ Modern UI with animations

## Default Users
You can register new users or use these test credentials:
- Email: test@example.com
- Password: password123

## Troubleshooting
- If you get database errors, run `cd backend && npm run db:init`
- If ports are busy, check if other services are running on 3001 or 5173
- Make sure all dependencies are installed with `npm run install:all`

## Development
- Frontend code: `frontend/src/`
- Backend code: `backend/src/`
- Database: `backend/database/`
- Shared types: `shared/types.ts`
