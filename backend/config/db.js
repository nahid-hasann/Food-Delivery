import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    // Bypass local Node.js v22+ macOS DNS bug by forcing Cloudflare & Google resolvers
    dns.setServers(['1.1.1.1', '8.8.8.8']);
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\x1b[32m[Database]\x1b[0m MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\x1b[31m[Database] Connection Error:\x1b[0m ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
