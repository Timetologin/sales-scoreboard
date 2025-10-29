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
    
    // Import User model
    const User = require('./models/User');
    
    // ============================================
    // AUTO-MIGRATION: Add ftds and plusOnes to existing users
    // ============================================
    console.log('\n🔄 Checking for users that need migration...');
    
    try {
      const usersNeedingMigration = await User.find({
        $or: [
          { ftds: { $exists: false } },
          { plusOnes: { $exists: false } }
        ]
      });

      if (usersNeedingMigration.length > 0) {
        console.log(`📊 Found ${usersNeedingMigration.length} users needing migration`);
        
        let migratedCount = 0;
        for (const user of usersNeedingMigration) {
          let needsSave = false;
          
          if (user.ftds === undefined) {
            user.ftds = 0;
            needsSave = true;
          }
          
          if (user.plusOnes === undefined) {
            user.plusOnes = 0;
            needsSave = true;
          }
          
          if (needsSave) {
            user.lastUpdated = Date.now();
            await user.save();
            console.log(`   ✅ Migrated user: ${user.name} (${user.email})`);
            migratedCount++;
          }
        }
        
        console.log(`✅ Migration completed: ${migratedCount} users updated\n`);
      } else {
        console.log('✅ All users already have ftds and plusOnes\n');
      }
    } catch (migrationError) {
      console.error('⚠️  Migration warning:', migrationError.message);
      console.log('Continuing with server startup...\n');
    }
    
    // ============================================
    // Create default admin user if none exists
    // ============================================
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (!adminExists) {
      console.log('👑 Creating default admin user...');
      
      const defaultAdmin = new User({
        name: 'Admin',
        email: 'admin@company.com',
        password: 'admin123',
        isAdmin: true,
        ftds: 0,
        plusOnes: 0,
        profilePicture: 'https://ui-avatars.com/api/?background=4F46E5&color=fff&name=Admin'
      });
      
      await defaultAdmin.save();
      
      console.log('✅ Default admin user created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: admin@company.com');
      console.log('🔑 Password: admin123');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️  IMPORTANT: Change this password in production!\n');
    } else {
      console.log('✅ Admin user already exists\n');
    }

    // ============================================
    // Create sample users if database is empty
    // ============================================
    const userCount = await User.countDocuments();
    
    if (userCount <= 1) {
      console.log('📝 Creating sample users...');
      
      const sampleUsers = [
        { 
          name: 'Sarah Johnson', 
          email: 'sarah@company.com', 
          password: 'password123', 
          ftds: 0, 
          plusOnes: 0 
        },
        { 
          name: 'Mike Chen', 
          email: 'mike@company.com', 
          password: 'password123', 
          ftds: 0, 
          plusOnes: 0 
        },
        { 
          name: 'Emily Rodriguez', 
          email: 'emily@company.com', 
          password: 'password123', 
          ftds: 0, 
          plusOnes: 0 
        },
        { 
          name: 'Lisa Anderson', 
          email: 'lisa@company.com', 
          password: 'password123', 
          ftds: 1, 
          plusOnes: 0 
        },
      ];

      let createdCount = 0;
      for (const userData of sampleUsers) {
        try {
          // Check if user already exists
          const existingUser = await User.findOne({ email: userData.email });
          
          if (!existingUser) {
            const user = new User({
              ...userData,
              profilePicture: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(userData.name)}`
            });
            await user.save();
            console.log(`   ✅ Created: ${userData.name}`);
            createdCount++;
          } else {
            console.log(`   ⏭️  Skipped: ${userData.name} (already exists)`);
          }
        } catch (error) {
          console.error(`   ❌ Failed to create ${userData.name}:`, error.message);
        }
      }
      
      console.log(`✅ Sample users creation completed: ${createdCount} new users\n`);
    } else {
      console.log(`✅ Database already has ${userCount} users\n`);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database setup completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n📝 Troubleshooting steps:');
    console.log('1. Check if .env file exists in server directory');
    console.log('2. Verify MONGODB_URI is set correctly');
    console.log('3. Make sure MongoDB Atlas allows connections from your IP');
    console.log('4. Check if your MongoDB credentials are correct\n');
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🐯 FTD Scoreboard API Server - Tiger\'s Pride 🐯');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 Port:        ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health:      http://localhost:${PORT}/health`);
    console.log(`🚀 Status:      RUNNING`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 API Endpoints:');
    console.log(`   POST   /api/auth/login`);
    console.log(`   POST   /api/auth/register`);
    console.log(`   GET    /api/users/leaderboard`);
    console.log(`   GET    /api/users/all`);
    console.log(`   POST   /api/users/:id/increment-ftd`);
    console.log(`   POST   /api/users/:id/increment-plusone`);
    console.log(`   POST   /api/ai/chat`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔥 Server is ready to accept requests! 🔥\n');
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;