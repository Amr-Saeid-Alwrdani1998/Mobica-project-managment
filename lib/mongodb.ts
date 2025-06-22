import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// تعريف cached كـ متغير global داخل Node.js لتفادي إعادة الاتصال
declare global {
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// تهيئة المتغير global إذا مش موجود
const globalWithMongoose = global as typeof globalThis & {
  _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  const cached = globalWithMongoose._mongoose;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
