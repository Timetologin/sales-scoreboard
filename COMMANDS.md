# 🛠️ Helpful Commands Reference

Quick reference for common commands you'll need.

## 📦 Installation Commands

### Install All Dependencies
```bash
# From root directory
npm run install:all

# Or manually:
cd server && npm install
cd ../client && npm install
```

### Install Individual Packages
```bash
# Server only
cd server && npm install

# Client only
cd client && npm install
```

## 🚀 Development Commands

### Start Both Servers (Separate Terminals)
```bash
# Terminal 1 - Backend
cd server
npm run dev
# Runs on http://localhost:4000

# Terminal 2 - Frontend
cd client
npm run dev
# Runs on http://localhost:5173
```

### Using Root Scripts
```bash
# Start backend
npm run dev:server

# Start frontend
npm run dev:client
```

## 🏗️ Build Commands

### Production Build
```bash
# Build frontend for production
cd client
npm run build
# Creates dist/ folder

# Preview production build
npm run preview
```

### Start Production Server
```bash
cd server
npm start
```

## 📝 Git Commands

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Regular Updates
```bash
git add .
git commit -m "Your commit message"
git push
```

### Create New Branch
```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "Add your feature"
git push -u origin feature/your-feature-name
```

## 🗄️ MongoDB Commands

### MongoDB Atlas Setup
```bash
# Connection string format:
mongodb+srv://username:password@cluster.mongodb.net/sales-scoreboard?retryWrites=true&w=majority

# Test connection (using mongosh)
mongosh "YOUR_CONNECTION_STRING"

# Show databases
show dbs

# Use database
use sales-scoreboard

# Show collections
show collections

# View users
db.users.find()

# Reset sales
db.users.updateMany({}, { $set: { sales: 0 } })
```

## 🐛 Debugging Commands

### Check Running Processes
```bash
# Find process on port 4000
lsof -i :4000

# Find process on port 5173
lsof -i :5173

# Kill process
kill -9 PID
```

### View Logs
```bash
# Server logs (if using PM2)
pm2 logs

# Render logs
# View in Render dashboard
```

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🔍 Testing Commands

### Manual API Testing (using curl)
```bash
# Health check
curl http://localhost:4000/health

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'

# Get leaderboard (replace TOKEN)
curl http://localhost:4000/api/users/leaderboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman/Insomnia
```bash
# Import this collection:
# POST /api/auth/login
# GET /api/users/leaderboard
# PUT /api/users/profile
# etc.
```

## 📊 Monitoring Commands

### Check Server Status
```bash
# Backend health
curl http://localhost:4000/health

# Frontend (check if running)
curl http://localhost:5173
```

### Database Stats
```bash
# In mongosh
db.stats()
db.users.countDocuments()
db.users.aggregate([
  { $group: { _id: null, totalSales: { $sum: "$sales" } } }
])
```

## 🔧 Maintenance Commands

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update all (careful in production)
npm update

# Update specific package
npm update package-name

# Update to latest (breaking changes possible)
npm install package-name@latest
```

### Security Audit
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes
npm audit fix --force
```

## 🌐 Deployment Commands

### Render Deployment
```bash
# Push to trigger auto-deploy
git push origin main

# Manual deploy trigger (from Render dashboard)
# Click "Manual Deploy" → "Deploy latest commit"
```

### Environment Variables Update
```bash
# In Render dashboard:
# 1. Go to service
# 2. Environment tab
# 3. Add/edit variables
# 4. Save changes (auto-redeploys)
```

## 🔐 Security Commands

### Generate JWT Secret
```bash
# Generate random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

### Hash Password (for manual user creation)
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password123', 10).then(console.log)"
```

## 📱 Useful npm Scripts

### Server Scripts
```bash
cd server
npm start          # Production mode
npm run dev        # Development mode with nodemon
```

### Client Scripts
```bash
cd client
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Root Scripts
```bash
npm run install:all    # Install all dependencies
npm run dev:server     # Start backend dev
npm run dev:client     # Start frontend dev
npm run start:server   # Start backend prod
npm run build:client   # Build frontend
```

## 🎨 Customization Commands

### Update TailwindCSS
```bash
cd client
npm run dev  # TailwindCSS watches for changes automatically
```

### Add New Icons
```bash
cd client
# Already installed: lucide-react
# Use any icon: import { IconName } from 'lucide-react'
```

## 📦 Adding New Features

### Backend - Add New Route
```bash
# 1. Create route file
touch server/routes/newroute.js

# 2. Add to server.js
# app.use('/api/newroute', require('./routes/newroute'));

# 3. Restart server
```

### Frontend - Add New Page
```bash
# 1. Create page component
touch client/src/pages/NewPage.jsx

# 2. Add route in App.jsx
# <Route path="/newpage" element={<NewPage />} />

# 3. Add to navigation
```

## 🔄 Common Workflows

### Feature Development Workflow
```bash
# 1. Create branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2

# 4. Commit
git add .
git commit -m "Add new feature"

# 5. Push
git push -u origin feature/new-feature

# 6. Create PR on GitHub
```

### Bug Fix Workflow
```bash
# 1. Identify issue
# Check logs, reproduce bug

# 2. Fix code
# ... edit files ...

# 3. Test fix
npm run dev

# 4. Deploy
git add .
git commit -m "Fix: description of bug fix"
git push
# Auto-deploys on Render
```

## 🆘 Emergency Commands

### Reset Everything Locally
```bash
# Stop all servers
# Ctrl+C in both terminals

# Remove all dependencies
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json

# Fresh install
cd server && npm install
cd ../client && npm install

# Restart
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2
```

### Reset Database
```bash
# In MongoDB Atlas dashboard:
# 1. Collections → users → Delete all documents
# 2. Restart backend to recreate sample data

# Or using mongosh:
# db.users.deleteMany({})
```

### Rollback Deployment
```bash
# In Render dashboard:
# 1. Go to service
# 2. Events tab
# 3. Find previous successful deploy
# 4. Click "Rollback to this version"
```

## 💡 Pro Tips

### Quick Restart
```bash
# Instead of Ctrl+C and restart, use nodemon
cd server
npm run dev  # Auto-restarts on file changes
```

### Multiple Terminals
```bash
# Use tmux or screen for persistent sessions
tmux new -s sales-app
# Split panes: Ctrl+B then %
```

### Quick MongoDB Queries
```javascript
// In mongosh
// Find top seller
db.users.find().sort({sales:-1}).limit(1)

// Total sales
db.users.aggregate([{$group:{_id:null,total:{$sum:"$sales"}}}])

// Average sales
db.users.aggregate([{$group:{_id:null,avg:{$avg:"$sales"}}}])
```

---

**💡 Tip:** Bookmark this file for quick reference!

Save these commands in your notes or keep this file open while developing.
