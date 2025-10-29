# Deployment Configuration Checklist

## ✅ Backend (Render) Configuration

### Environment Variables (Settings → Environment)
1. **DATABASE_URL** 
   - Value: Your PostgreSQL connection string (NeonDB)
   - Example: `postgresql://user:pass@host/db?sslmode=require`

2. **FRONTEND_URL**
   - Value: Your Vercel frontend URL (NO trailing slash)
   - Example: `https://e-com-platform.vercel.app`
   - ❌ Wrong: `https://e-com-platform.vercel.app/`
   - ✅ Correct: `https://e-com-platform.vercel.app`

3. **PORT** (Optional)
   - Render sets this automatically, but you can set it if needed
   - Default: `5000` (but Render will override with their port)

### Build & Start Commands (Settings → Build & Deploy)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run seed`
- **Start Command:** `npm start` ⚠️ (NOT `npm run dev`)

### Notes
- Use `npm start` for production (uses `node` directly)
- `npm run dev` is for development only (uses `nodemon`)

---

## ✅ Frontend (Vercel) Configuration

### Environment Variables (Settings → Environment Variables)
1. **VITE_API_URL**
   - Value: Your Render backend URL + `/api`
   - Example: `https://e-com-platform.onrender.com/api`
   - ❌ Wrong: `https://e-com-platform.onrender.com` (missing `/api`)
   - ❌ Wrong: `https://e-com-platform.onrender.com/api/` (trailing slash might cause issues)
   - ✅ Correct: `https://e-com-platform.onrender.com/api`

### Build Settings (Settings → General → Build & Development Settings)
- **Framework Preset:** Vite
- **Root Directory:** `frontend` (if deploying from monorepo)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

---

## 🔍 Verification Steps

### 1. Check Backend Health
Visit: `https://e-com-platform.onrender.com/health`
Expected: `{"status":"OK","message":"Server is running"}`

### 2. Check Products API
Visit: `https://e-com-platform.onrender.com/api/products`
Expected: JSON with `success: true` and `data` array with products

### 3. Check Frontend Console
- Open browser DevTools → Console
- Look for any errors or API response logs
- Check Network tab for failed requests

### 4. Check CORS Headers
In Network tab, check Response Headers for:
- `Access-Control-Allow-Origin: https://e-com-platform.vercel.app`

---

## 🐛 Common Issues & Solutions

### Issue: CORS errors
**Solution:**
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash)
- Check Render logs for CORS debug messages
- Ensure both URLs use `https://`

### Issue: Products not loading (200 OK but no data)
**Solution:**
- Check browser console for response structure logs
- Verify `VITE_API_URL` includes `/api` at the end
- Check Render logs to ensure database was seeded

### Issue: 404 errors
**Solution:**
- Verify `VITE_API_URL` includes `/api` at the end
- Check that backend routes are mounted at `/api/products`, `/api/cart`, etc.

### Issue: Database connection errors
**Solution:**
- Verify `DATABASE_URL` is set correctly in Render
- Check that database is accessible from Render's IP
- Ensure SSL mode is correct (`sslmode=require` for NeonDB)

---

## 📝 Quick Reference

### Your URLs (Update these with your actual URLs)

**Backend (Render):**
- URL: `https://e-com-platform.onrender.com`
- Health: `https://e-com-platform.onrender.com/health`
- API: `https://e-com-platform.onrender.com/api/products`

**Frontend (Vercel):**
- URL: `https://e-com-platform.vercel.app`

**Environment Variables Needed:**

**Render (Backend):**
```
DATABASE_URL=postgresql://...
FRONTEND_URL=https://e-com-platform.vercel.app
```

**Vercel (Frontend):**
```
VITE_API_URL=https://e-com-platform.onrender.com/api
```

