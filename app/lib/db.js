// app/lib/db.js
// Reusable MongoDB connection helper using Mongoose.
//
// Next.js (in development) reloads our code often, and serverless functions
// can run many times. Without caching, each reload/call would open a brand new
// database connection and quickly exhaust the limit. So we cache one connection
// on a global variable and reuse it.

import mongoose from "mongoose";

// Reuse a cache stored on the global object so it survives hot-reloads.
// (globalThis is the same object across reloads; a normal variable would reset.)
let cached = globalThis.mongooseCache;
if (!cached) {
  cached = globalThis.mongooseCache = { conn: null, promise: null };
}

// connectDB(): returns a live Mongoose connection, reusing it if possible.
export async function connectDB() {
  // Read the connection string at call time (NOT at module load), so merely
  // importing this file never crashes the build. Only fail if we actually try
  // to connect without the variable set.
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  // 1) If we already connected, return that same connection.
  if (cached.conn) {
    return cached.conn;
  }

  // 2) If a connection is still being established, reuse that promise so we
  //    don't start a second one.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  // 3) Wait for the connection, store it in the cache, and return it.
  cached.conn = await cached.promise;
  return cached.conn;
}
