# 🚀 Quick Start Guide

## 5-Minute Setup

### 1. MongoDB Setup (2 minutes)
1. Go to https://cloud.mongodb.com
2. Sign up for free account
3. Create new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
6. In MongoDB Atlas:
   - Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Database Access" → Create a database user with password

### 2. Local Development (3 minutes)
```bash
# Clone and enter directory
cd sales-scoreboard

# Install all dependencies
cd server && npm install
cd ../client && npm install

# Setup server environment
cd ../server
cp .env.example .env
nano .env  # Add your MongoDB URI and create a JWT secret

# Setup client environment (optional, defaults work)
cd ../client
cp .env.example .env

# Start both servers (in separate terminals)
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev

# Open browser: http://localhost:5173
```

### 3. First Login
```
Email: admin@company.com
Password: admin123
```

**⚠️ Change this password immediately!**

## Render Deployment (10 minutes)

### Prerequisites:
- GitHub account
- Render account (free)
- MongoDB Atlas setup (from step 1)

### Steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com/dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render detects `render.yaml` automatically
   
3. **Add Environment Variables:**
   In Render dashboard, add:
   - `MONGODB_URI`: Your Atlas connection string
   - `JWT_SECRET`: Any random 32+ character string
   - `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`: (Optional, for AI features)

4. **Wait for Deployment:**
   - Backend: ~3-5 minutes
   - Frontend: ~2-3 minutes
   
5. **Access Your App:**
   - Frontend URL: `https://sales-scoreboard-client.onrender.com`
   - Login with default credentials
   - Change admin password!

## Common Issues

### "Cannot connect to database"
- Check MongoDB Atlas allows all IPs (0.0.0.0/0)
- Verify connection string in .env
- Ensure database user is created

### "Port already in use"
- Backend: Change PORT in server/.env
- Frontend: Change port in client/vite.config.js

### "API calls failing"
- Check VITE_API_URL in client/.env matches backend URL
- Verify backend is running
- Check CORS settings in server/server.js

## Next Steps

1. ✅ Change admin password
2. ✅ Add your team members
3. ✅ Update sales data
4. ✅ Customize branding (colors, logo)
5. ✅ Configure AI assistant (optional)
6. ✅ Share app URL with team

## Need Help?

- Check README.md for detailed documentation
- Review server logs for errors
- Check Render dashboard for deployment logs
- Create GitHub issue for bugs

---

**You're ready to go! 🎉**
