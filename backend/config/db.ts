import mongoose from 'mongoose';

export const connectDB = async () => {
  const primaryURI = process.env.MONGODB_URI;

  const localFallback = 'mongodb://127.0.0.1:27017/internship-platform';

  // 🔴 Check if env is missing
  if (!primaryURI) {
    console.warn('⚠️ MONGODB_URI not found in .env, using local fallback...');
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas / Primary DB...');

    await mongoose.connect(primaryURI || localFallback, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log('✅ MongoDB Connected Successfully');

  } catch (error) {
    console.error('❌ Primary DB connection failed:', error);

    try {
      console.log('🔄 Trying local MongoDB fallback...');

      await mongoose.connect(localFallback, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log('✅ Connected to local MongoDB fallback');

    } catch (localError) {
      console.error('💥 Critical: All MongoDB connections failed:', localError);

      console.log('⚠️ Server will still start, but APIs will not work properly');
    }
  }
};