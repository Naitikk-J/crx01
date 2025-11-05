import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully.');
      return mongoose;
    }).catch(err => {
      console.error('MongoDB connection error:', err.message);
      // Throw the error to be caught by the calling function
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the promise was rejected, reset it so we can try again on the next request.
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;
