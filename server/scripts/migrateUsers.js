const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration script
const migrateUsers = async () => {
  try {
    console.log('\n🚀 Starting user migration...\n');

    // Get all users
    const usersCollection = mongoose.connection.collection('users');
    const users = await usersCollection.find({}).toArray();

    console.log(`📊 Found ${users.length} users to migrate`);

    let updated = 0;
    let skipped = 0;

    // Update each user
    for (const user of users) {
      const needsUpdate = 
        user.ftds === undefined || 
        user.plusOnes === undefined;

      if (needsUpdate) {
        await usersCollection.updateOne(
          { _id: user._id },
          {
            $set: {
              ftds: user.ftds !== undefined ? user.ftds : 0,
              plusOnes: user.plusOnes !== undefined ? user.plusOnes : 0,
              lastUpdated: new Date()
            }
          }
        );
        console.log(`✅ Updated user: ${user.name} (${user.email})`);
        updated++;
      } else {
        console.log(`⏭️  Skipped user: ${user.name} (already has ftds and plusOnes)`);
        skipped++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Updated: ${updated} users`);
    console.log(`   ⏭️  Skipped: ${skipped} users`);
    console.log(`   📊 Total: ${users.length} users`);
    console.log('\n✨ Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run migration
const run = async () => {
  await connectDB();
  await migrateUsers();
};

run();