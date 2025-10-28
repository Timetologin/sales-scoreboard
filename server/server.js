const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FTD Scoreboard API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection
const connectDB = async () => {
  try {
    console.log("⏳ Trying to connect to MongoDB...");
    
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
      console.log('Please create a .env file in the server directory with:');
      console.log('MONGODB_URI=your_mongodb_connection_string');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
    
    // Create default admin user if none exists
    const User = require('./models/User');
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (!adminExists) {
      const defaultAdmin = new User({
        name: 'Admin',
        email: 'admin@company.com',
        password: 'admin123',
        isAdmin: true,
        ftds: 0,
        profilePicture: 'https://ui-avatars.com/api/?background=4F46E5&color=fff&name=Admin'
      });
      
      await defaultAdmin.save();
      console.log('✅ Default admin user created:');
      console.log('   Email: admin@company.com');
      console.log('   Password: admin123');
      console.log('   ⚠️  IMPORTANT: Change this password in production!');
    }

    // Create sample users if database is empty
    const userCount = await User.countDocuments();
    if (userCount <= 1) {
      const sampleUsers = [
        { name: 'Sarah Johnson', email: 'sarah@company.com', password: 'password123', ftds: 5 },
        { name: 'Mike Chen', email: 'mike@company.com', password: 'password123', ftds: 8 },
        { name: 'Emily Rodriguez', email: 'emily@company.com', password: 'password123', ftds: 12 },
        { name: 'David Kim', email: 'david@company.com', password: 'password123', ftds: 15 },
        { name: 'Lisa Anderson', email: 'lisa@company.com', password: 'password123', ftds: 20 },
      ];

      for (const userData of sampleUsers) {
        const user = new User({
          ...userData,
          profilePicture: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(userData.name)}`
        });
        await user.save();
      }
      
      console.log('✅ Sample users created successfully');
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n📝 Troubleshooting steps:');
    console.log('1. Check if .env file exists in server directory');
    console.log('2. Verify MONGODB_URI is set correctly');
    console.log('3. Make sure MongoDB Atlas allows connections from your IP');
    console.log('4. Check if your MongoDB credentials are correct');
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`
✅ FTD Scoreboard API Server is Running
🌐 Port: ${PORT}
📦 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health Check: http://localhost:${PORT}/health
    `);
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

module.exports = app;