# 🧪 API Demo & Testing

## Backend API Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### User Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### User Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Posts (Public)
```bash
curl http://localhost:3001/api/posts
```

### Create Post (Requires Auth)
```bash
# First get token from login, then:
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Hello, Bailanysta! This is my first post."
  }'
```

### Get User Profile
```bash
curl http://localhost:3001/api/users/USER_ID_HERE
```

### Like/Unlike Post
```bash
curl -X POST http://localhost:3001/api/likes/POST_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Comment
```bash
curl -X POST http://localhost:3001/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Great post!",
    "postId": "POST_ID_HERE"
  }'
```

## Frontend Features

### Available Pages
- **Home** (`/`) - Main feed with posts
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration
- **Profile** (`/profile`) - User profile (protected)

### Features
- ✅ User registration and login
- ✅ Create and view posts
- ✅ Like and comment on posts
- ✅ User profiles with bio editing
- ✅ Dark/light theme toggle
- ✅ Responsive design
- ✅ Modern UI with animations

## Testing the Application

1. **Open Frontend**: http://localhost:5173
2. **Register a new user** or use existing credentials
3. **Create posts** and interact with them
4. **Test theme switching** (sun/moon icon in header)
5. **Edit your profile** bio
6. **Like and comment** on posts

## Troubleshooting

### Common Issues
- **Database errors**: Run `cd backend && npm run db:init`
- **Port conflicts**: Check if ports 3001 or 5173 are free
- **Dependencies**: Ensure `npm run install:all` completed successfully

### Development Commands
```bash
# Start both servers
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build frontend
npm run build

# Initialize database
cd backend && npm run db:init
```
