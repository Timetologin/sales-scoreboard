# 🏆 Sales Scoreboard

A complete, production-ready web application for tracking and displaying sales rankings in real-time. Built with Node.js, Express, MongoDB, React, and TailwindCSS.

![Sales Scoreboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## ✨ Features

- **📊 Real-Time Leaderboard** - Live sales rankings with auto-refresh
- **👤 User Profiles** - Customizable profiles with avatars
- **🔐 Secure Authentication** - JWT-based auth system
- **👑 Admin Panel** - Manage users and sales data
- **🤖 AI Assistant** - Built-in chatbot for sales tips (supports Claude & OpenAI)
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **🎨 Modern UI/UX** - Beautiful animations with Framer Motion
- **⚡ Fast & Efficient** - Optimized for performance

## 🚀 Tech Stack

### Backend
- Node.js + Express
- MongoDB (Atlas)
- JWT Authentication
- Bcrypt for password hashing
- Axios for API calls

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Framer Motion for animations
- Lucide React for icons
- Axios for API requests

## 📁 Project Structure

```
sales-scoreboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── server.js         # Server entry point
│   └── package.json
│
├── render.yaml           # Render deployment config
├── .gitignore
└── README.md
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Git installed

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd sales-scoreboard
```

### 2. Setup Backend
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
nano .env  # or use your preferred editor
```

**Required Environment Variables (server/.env):**
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
CLIENT_URL=http://localhost:5173

# Optional AI Assistant (add at least one)
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
```

### 3. Setup Frontend
```bash
cd ../client
npm install

# Create .env file
cp .env.example .env

# Edit if needed (default works for local dev)
nano .env
```

**Client Environment Variables (client/.env):**
```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000
- **Health Check:** http://localhost:4000/health

### 6. Default Credentials
```
Admin Account:
Email: admin@company.com
Password: admin123

Sample User:
Email: sarah@company.com
Password: password123
```

**⚠️ IMPORTANT: Change admin password immediately in production!**

## 🌐 Deploy to Render

Render provides free hosting for web apps. Here's how to deploy:

### Method 1: Using render.yaml (Recommended)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create MongoDB Atlas Database**
   - Go to https://cloud.mongodb.com
   - Create free cluster
   - Get connection string
   - Whitelist all IPs (0.0.0.0/0) for Render

3. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

4. **Deploy on Render**
   - Go to Render Dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` automatically
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Auto-generated (or set your own 32+ char string)
     - `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`: (Optional) For AI assistant
   - Click "Apply"
   - Wait 5-10 minutes for deployment

5. **Access Your App**
   - Backend: `https://sales-scoreboard-api.onrender.com`
   - Frontend: `https://sales-scoreboard-client.onrender.com`

### Method 2: Manual Deployment

#### Deploy Backend:
1. Render Dashboard → New → Web Service
2. Connect GitHub repo
3. Settings:
   - Name: `sales-scoreboard-api`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (see above)

#### Deploy Frontend:
1. Render Dashboard → New → Static Site
2. Connect GitHub repo
3. Settings:
   - Name: `sales-scoreboard-client`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add environment variable:
     - `VITE_API_URL`: `https://sales-scoreboard-api.onrender.com/api`

## 📱 Features Guide

### For Users:
- **View Leaderboard**: See real-time rankings
- **Update Profile**: Change name and avatar
- **Track Progress**: Monitor your sales and rank
- **AI Assistant**: Get sales tips and motivation

### For Admins:
- **Add Users**: Create new team members
- **Update Sales**: Modify sales numbers
- **Delete Users**: Remove team members
- **Reset Leaderboard**: Start fresh season

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected routes
- CORS configuration
- Input validation
- Admin-only routes

## 🎨 Customization

### Change Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Add New Features
1. Backend: Add route in `server/routes/`
2. Frontend: Create component in `client/src/components/`
3. Update API service in `client/src/services/api.js`

## 🐛 Troubleshooting

### Backend won't start:
- Check MongoDB connection string
- Verify all environment variables
- Check port 4000 isn't in use

### Frontend won't connect:
- Verify `VITE_API_URL` in client/.env
- Check backend is running
- Clear browser cache

### Render deployment issues:
- Check build logs in Render dashboard
- Verify environment variables are set
- Ensure MongoDB Atlas allows all IPs

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update own profile
- `PUT /api/users/:id/sales` - Update sales (admin)
- `POST /api/users/:id/add-sales` - Add to sales (admin)
- `GET /api/users/all` - Get all users (admin)
- `POST /api/users/create` - Create user (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `POST /api/users/reset-leaderboard` - Reset all sales (admin)

### AI
- `POST /api/ai/chat` - Send message to AI assistant

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ for sales teams
- Icons by [Lucide](https://lucide.dev)
- UI inspired by modern SaaS applications

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@salesscoreboard.com

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Sales goal tracking
- [ ] Team challenges
- [ ] Export reports
- [ ] Mobile app
- [ ] Slack integration

---

**Made with 💪 for high-performing sales teams**
