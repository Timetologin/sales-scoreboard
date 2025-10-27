# 📋 Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### MongoDB Atlas Setup
- [ ] Created MongoDB Atlas account
- [ ] Created free cluster
- [ ] Created database user with password
- [ ] Added IP whitelist (0.0.0.0/0 for Render)
- [ ] Copied connection string
- [ ] Tested connection locally

### Environment Variables
- [ ] Server `.env` file created with:
  - [ ] `MONGODB_URI` (from Atlas)
  - [ ] `JWT_SECRET` (32+ random characters)
  - [ ] `PORT=4000`
  - [ ] `NODE_ENV=production`
  - [ ] `CLIENT_URL` (frontend URL)
  - [ ] `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` (optional)
- [ ] Client `.env` file created with:
  - [ ] `VITE_API_URL` (backend API URL)

### Code Preparation
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Backend API responds correctly
- [ ] Authentication working
- [ ] Admin panel accessible
- [ ] AI assistant functional (if configured)

### Git Repository
- [ ] Repository created on GitHub
- [ ] `.gitignore` properly configured
- [ ] No sensitive data in commits
- [ ] All files committed
- [ ] Pushed to main branch

## Render Deployment

### Account Setup
- [ ] Created Render account
- [ ] Connected GitHub account to Render

### Backend Deployment
- [ ] Created Web Service on Render
- [ ] Connected to GitHub repository
- [ ] Set root directory to `server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables added:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=4000`
  - [ ] `CLIENT_URL` (will add after frontend deploy)
  - [ ] API keys (optional)
- [ ] Deployment successful
- [ ] Health check endpoint working: `/health`
- [ ] Noted backend URL: `_________________________`

### Frontend Deployment
- [ ] Created Static Site on Render
- [ ] Connected to GitHub repository
- [ ] Set root directory to `client`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variable added:
  - [ ] `VITE_API_URL` (backend URL from above)
- [ ] Added rewrite rule for SPA routing
- [ ] Deployment successful
- [ ] Site loads correctly
- [ ] Noted frontend URL: `_________________________`

### Post-Deployment Configuration
- [ ] Updated `CLIENT_URL` in backend environment variables
- [ ] Redeployed backend with updated CORS settings
- [ ] Both services communicating correctly

## Testing

### Functional Testing
- [ ] Can access frontend URL
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Leaderboard displays correctly
- [ ] Profile page loads
- [ ] Profile updates work
- [ ] Admin panel accessible (admin users)
- [ ] Can add/edit sales data (admin)
- [ ] Can create new users (admin)
- [ ] AI assistant responds (if configured)
- [ ] Logout works correctly

### Mobile Testing
- [ ] Site responsive on mobile
- [ ] Navigation menu works
- [ ] All features accessible
- [ ] UI looks good on small screens

### Performance
- [ ] Pages load quickly
- [ ] No console errors
- [ ] Images load correctly
- [ ] API responses fast
- [ ] Auto-refresh working

## Security

### Production Security
- [ ] Changed default admin password
- [ ] JWT secret is strong and unique
- [ ] MongoDB Atlas restricted to known IPs (or 0.0.0.0/0 for Render)
- [ ] No API keys exposed in frontend code
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Render)

### User Management
- [ ] Admin account secured
- [ ] Test accounts removed or password changed
- [ ] User roles working correctly

## Documentation

- [ ] README.md updated with:
  - [ ] Production URLs
  - [ ] Admin credentials location
  - [ ] Known issues (if any)
- [ ] Team notified of new platform
- [ ] Login instructions shared
- [ ] Support email/contact set up

## Monitoring

- [ ] Render dashboard bookmarked
- [ ] MongoDB Atlas dashboard bookmarked
- [ ] Set up Render email notifications
- [ ] Tested error logging
- [ ] Know how to access logs

## Post-Launch

### Immediate (First Day)
- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Verify all features working
- [ ] Response to any issues quickly

### First Week
- [ ] Collect user feedback
- [ ] Fix any bugs found
- [ ] Optimize slow features
- [ ] Add requested features to backlog

### Ongoing
- [ ] Regular backups (MongoDB Atlas automatic)
- [ ] Monitor performance metrics
- [ ] Update dependencies monthly
- [ ] Security patches applied
- [ ] Feature requests tracked

## Troubleshooting Resources

### If Backend Fails:
1. Check Render logs
2. Verify MongoDB connection
3. Check environment variables
4. Test health endpoint

### If Frontend Fails:
1. Check build logs on Render
2. Verify VITE_API_URL is correct
3. Clear browser cache
4. Check console for errors

### If API Calls Fail:
1. Verify backend is running
2. Check CORS settings
3. Verify API URL in frontend
4. Check network tab in browser

## Emergency Contacts

- Render Support: https://render.com/support
- MongoDB Atlas Support: https://www.mongodb.com/support
- GitHub: [Your Repository Issues]

---

**🎉 Congratulations on your deployment!**

Keep this checklist for future deployments and updates.
