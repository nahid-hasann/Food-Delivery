import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\x1b[32m[Database]\x1b[0m MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\x1b[31m[Database] Connection Error:\x1b[0m ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
