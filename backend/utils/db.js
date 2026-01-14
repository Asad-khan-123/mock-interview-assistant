import mongoose from 'mongoose';

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log('Database connection error:', error);
    return response.status(500).json({
      message: "Database connection failed",
      success: false,
      error
    });
  }
}

export default connectdb;