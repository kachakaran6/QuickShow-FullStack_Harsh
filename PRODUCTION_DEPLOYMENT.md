# QuickShow Production Deployment Guide

## Production URL
```
https://quickshow-fullstack-harsh.onrender.com
```

## Environment Configuration

### Frontend Setup (.env files)

**Development (.env):**
```env
VITE_BASE_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZmluZS1sbGFtYS03LmNsZXJrLmFjY291bnRzLmRldiQ
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
```

**Production (.env.production):**
```env
VITE_BASE_URL=https://quickshow-fullstack-harsh.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZmluZS1sbGFtYS03LmNsZXJrLmFjY291bnRzLmRldiQ
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

### Backend Configuration (server/.env)

Key variables for production:
```env
# Client URL for CORS and redirects
CLIENT_URL=https://quickshow-fullstack-harsh.onrender.com

# All other critical keys already configured...
```

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- `http://127.0.0.1:3000` (development)
- `http://localhost:5173` (Vite dev server)
- `https://quickshow-fullstack-harsh.onrender.com` (production)

Credentials are enabled for authenticated requests.

## Building for Production

### Frontend
```bash
cd client
npm run build
```

This will use `.env.production` values automatically in production builds.

### Backend
No build step required. Ensure all environment variables are set on your hosting platform.

## Deployment Checklist

- [x] Frontend environment files created (.env, .env.production)
- [x] Backend CORS configured for production URL
- [x] CLIENT_URL added to server .env
- [x] Centralized API config created (client/src/config/api.js)
- [x] .gitignore updated to exclude sensitive files
- [x] No hardcoded localhost references in code
- [x] All API calls use configurable base URL from environment

## API Endpoints

All API endpoints are relative to the `VITE_BASE_URL` configured in the frontend:
- POST `/api/booking/create` - Create booking
- GET `/api/show/:id` - Get show details
- GET `/api/booking/seats/:showId` - Get occupied seats
- POST `/api/admin/is-admin` - Check admin status
- GET `/api/user/favorites` - Get favorite movies
- GET `/api/show/all` - Get all shows

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console, ensure:
1. The `CLIENT_URL` in server .env matches the frontend URL
2. The `VITE_BASE_URL` in client env points to the correct backend
3. Browser is making requests to the production URL

### API Connection Issues
1. Verify `VITE_BASE_URL` is set correctly
2. Check that the backend is running and accessible
3. Clear browser cache and hard refresh

### Mixed Content Errors
Ensure all references use HTTPS in production:
- Frontend: HTTPS ✓
- Backend API: HTTPS ✓
- TMDB Images: HTTPS ✓
