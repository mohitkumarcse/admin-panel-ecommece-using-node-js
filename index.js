const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');

// --- Configuration & Initialization ---

// Load environment variables for local development (ignored by Vercel in production)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Instantiate Express app
const app = express();

// Required routes and middleware (ensure these files exist)
const adminRoutes = require('./route/adminRoutes');
// const { is_loggedIn } = require('./middleware/auth'); // Assuming these are used in adminRoutes
// const { is_admin } = require('./middleware/isAdmin');


// --- Express View Engine Setup ---
app.set('view engine', 'ejs');
// Note: path.join(__dirname, "views") relies on Vercel including the 'views' directory in the build.
app.set('views', path.join(__dirname, "views"));


// --- Express Middleware ---
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Serve static assets from various directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/config', express.static(path.join(__dirname, 'config')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// --- MongoDB Serverless Caching Setup ---

// Variable to cache the connection promise. Crucial for serverless performance.
let cachedDb = null;

async function connectToMongoDB() {
  // If a connection is already established (or pending), return immediately.
  if (cachedDb) {
    console.log('Using cached MongoDB connection.');
    // We must await the promise here to ensure it resolves successfully before continuing
    await cachedDb;
    return;
  }

  console.log('Establishing new MongoDB connection (Cold Start).');

  // Start the connection and cache the resulting promise.
  cachedDb = mongoose.connect(process.env.MONGO_URL, {
    // Vercel recommended options for serverless environments
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 1,
  })
    .then(() => {
      console.log('MongoDB successfully connected.');
      // Return the successful connection promise
      return mongoose.connection;
    })
    .catch((err) => {
      console.error('MongoDB Connection Failed:', err);
      cachedDb = null; // Clear cache on failure so it can retry on the next call
      throw err;
    });

  // Wait for the initial connection to resolve before the function continues.
  await cachedDb;
}


// --- Routes ---
// Mount the admin routes here
app.use(adminRoutes);

// 404 handler (must be the last route)
app.use((req, res, next) => {
  res.status(404).render('admin/errors/404', {
    title: 'Page Not Found',
    layout: false
  });
});


// --- Serverless Export ---

// Wrap the Express app to create a single AWS Lambda/Vercel compatible handler function
const handler = serverless(app);

// Export the asynchronous Vercel handler function as the default export
module.exports = async (req, res) => {
  try {
    // 1. Establish/reuse the MongoDB connection on every function invocation
    await connectToMongoDB();

    // 2. Execute the wrapped Express app handler
    return handler(req, res);

  } catch (error) {
    // This catches both MongoDB connection errors and route execution errors
    console.error("Vercel Handler Error:", error);

    // Send a 500 response immediately to avoid a 504 timeout
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Server Error: Failed to connect to database or process request.');
  }
};