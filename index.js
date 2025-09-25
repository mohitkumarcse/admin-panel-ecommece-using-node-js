const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose'); // <-- CORRECT LIBRARY FOR YOUR APP
const serverless = require('serverless-http');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const adminRoutes = require('./route/adminRoutes');

// --- Configuration & Initialization ---

// Load environment variables for local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Instantiate Express app
const app = express();

// --- Express View Engine & Middleware Setup ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/config', express.static(path.join(__dirname, 'config')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// --- MongoDB Serverless Caching Setup (with Mongoose) ---

// Variable to cache the Mongoose connection promise.
let cachedDb = null;

async function connectToMongoDB() {
  // If a connection is already established (or pending), use the cached promise.
  if (cachedDb) {
    console.log("✅ Using cached MongoDB connection.");
    // We must await the promise here to ensure it resolves successfully before continuing.
    await cachedDb;
    return;
  }

  console.log('Establishing new MongoDB connection (Cold Start).');

  // Start the Mongoose connection and cache the resulting promise.
  cachedDb = mongoose.connect(process.env.MONGO_URL, {
    // Vercel recommended options for serverless
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 1,
  })
    .then(() => {
      console.log('✅ MongoDB successfully connected.');
      // Cache the promise of the Mongoose connection.
      return mongoose.connection;
    })
    .catch((err) => {
      console.error('MongoDB Connection Failed:', err);
      cachedDb = null; // Clear the cache on failure so it can retry.
      throw err;
    });

  // Wait for the initial connection to resolve before the function continues.
  await cachedDb;
}


// --- Routes ---

// A simple health check route to verify the app is running
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Mount your application routes
app.use(adminRoutes);

// 404 handler (must be the last route)
app.use((req, res) => {
  res.status(404).render('admin/errors/404', {
    title: 'Page Not Found',
    layout: false
  });
});


// --- Vercel Serverless Export ---

// Wrap the Express app to create a single Vercel-compatible handler.
const handler = serverless(app);

// Export the asynchronous Vercel handler function.
module.exports = async (req, res) => {
  try {
    // 1. Ensure the MongoDB connection is established (or use the cached one).
    await connectToMongoDB();

    // 2. Execute the wrapped Express app handler.
    return handler(req, res);

  } catch (error) {
    // This catches both MongoDB connection errors and route execution errors.
    console.error("Vercel Handler Error:", error);

    // Send a 500 response immediately to avoid a 504 timeout.
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Server Error: Failed to connect to database or process request.');
  }
};