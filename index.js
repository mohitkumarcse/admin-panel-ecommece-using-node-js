const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const serverless = require('serverless-http');
const { MongoClient, ServerApiVersion } = require('mongodb');
const donenv = require('dotenv');
const cookieParser = require('cookie-parser');
const adminRoutes = require('./route/adminRoutes');

// Load .env
if (process.env.NODE_ENV !== 'production') {
  donenv.config();
}

// Set EJS and middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/config', express.static(__dirname + '/config'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Add health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Mount routes
app.use(adminRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('admin/errors/404', {
    title: 'Page Not Found',
    layout: false
  });
});

// MongoDB Connection (cached)
let cachedClient = null;

async function connectToMongoDB() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(process.env.MONGO_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await client.connect();
  cachedClient = client;
  console.log("✅ MongoDB connected");
  return client;
}

// Wrap Express app with serverless
const handler = serverless(app);

// Export handler
module.exports = async (req, res) => {
  try {
    await connectToMongoDB();
    return handler(req, res);
  } catch (error) {
    console.error("Vercel Handler Error:", error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Server Error: Failed to connect to database or process request.');
  }
};
