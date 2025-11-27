import mongoose from 'mongoose';
import User from '../models/User';

// MongoDB URI - Get from environment variable or use default
// IMPORTANT: Create a .env file in chat-backend folder with your MongoDB connection string
// Format: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

// MongoDB URI - Check multiple environment variable names
// Supports: MONGO_URI, CONNECTION_URL, or MONGODB_URI
const MONGO_URI = process.env.MONGO_URI || 
                  process.env.CONNECTION_URL || 
                  process.env.MONGODB_URI ||
                  'mongodb+srv://muhammadlayan00_db_user:3j1ZUD1P558rtc6G@cluster0.19opagn.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Check which env variable is being used
    const envSource = process.env.MONGO_URI ? 'MONGO_URI' : 
                     process.env.CONNECTION_URL ? 'CONNECTION_URL' :
                     process.env.MONGODB_URI ? 'MONGODB_URI' : 'Default';
    console.log('📍 Using:', envSource, 'from .env file');
    
    // Don't show full connection string in logs (security)
    const uriToLog = MONGO_URI.replace(/:([^:@]+)@/, ':****@');
    console.log('🔗 Connection:', uriToLog);
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    // Create default admin user if it doesn't exist
    await createDefaultAdmin();
  } catch (err: any) {
    console.error('❌ MongoDB connection error:', err.message);
    
    // More specific error messages
    if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.error('\n🔐 Authentication Error - Check your credentials:');
      console.error('1. Verify username and password in .env file');
      console.error('2. Password with special characters (< >) must be URL-encoded');
      console.error('3. Example: <password> becomes %3Cpassword%3E');
      console.error('4. Or remove brackets and use plain password');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('\n🌐 Network Error - Check your connection:');
      console.error('1. Verify cluster URL is correct');
      console.error('2. Check internet connection');
      console.error('3. Verify MongoDB Atlas cluster is running');
    } else if (err.message.includes('timeout')) {
      console.error('\n⏱️ Timeout Error:');
      console.error('1. Check if your IP is whitelisted in MongoDB Atlas');
      console.error('2. Go to MongoDB Atlas → Network Access → Add IP Address');
      console.error('3. Add 0.0.0.0/0 to allow all IPs (for development)');
    }
    
    console.error('\n💡 Quick Fix:');
    console.error('1. Open chat-backend/.env file');
    console.error('2. Update MONGO_URI with correct credentials');
    console.error('3. Format: mongodb+srv://username:password@cluster.mongodb.net/chat-app?retryWrites=true&w=majority');
    console.error('4. Restart server: npm run dev');
    console.error('\n📖 See FIX_MONGODB.md for detailed instructions.\n');
    process.exit(1);
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin12@gmail.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin';

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        isAdmin: true
      });
      await admin.save();
      console.log('👑 Default admin user created:', adminEmail);
    } else {
      // Ensure admin is set to admin
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log('👑 Existing user promoted to admin:', adminEmail);
      }
    }
  } catch (err: any) {
    console.error('⚠️ Failed to create default admin:', err.message);
  }
};
