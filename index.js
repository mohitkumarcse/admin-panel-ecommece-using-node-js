const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const donenv = require('dotenv');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { title } = require('process');
const adminRoutes = require('./route/adminRoutes');
const morgan = require('morgan');
const { is_loggedIn } = require('./middleware/auth');
const { is_admin } = require('./middleware/isAdmin');
const serverless = require('serverless-http');
const { MongoClient, ServerApiVersion } = require('mongodb');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

if (process.env.NODE_ENV !== 'production') {
  donenv.config();
}

// const logDir = path.join(__dirname, 'logs');
// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir);
// }

// const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/config', express.static(__dirname + '/config'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// app.get('/admin/logs', is_loggedIn, is_admin, (req, res) => {
//   const logFile = path.join(logDir, 'access.log');
//   console.log('*++++++++++');

//   fs.readFile(logFile, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading log file:', err);
//       return res.status(500).send('Error loading logs');
//     }

//     const logs = data.trim().split('\n').reverse();
//     res.render('admin/logs/log', { logs, role: req.role, username: req.username.charAt(0).toUpperCase() + req.username.slice(1) });
//   });
// });

// const logFile = '/tmp/access.log'; // use temp directory in Vercel

// fs.readFile(logFile, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading log file:', err);
//     return res.status(500).send('Error loading logs');
//   }

//   const logs = data.trim().split('\n').reverse();
//   res.render('admin/logs/log', { logs, role: req.role, username: req.username.charAt(0).toUpperCase() + req.username.slice(1) });
// });

// app.use(adminRoutes);

app.use((req, res, next) => {
  res.status(404).render('admin/errors/404', {
    title: 'Page Not Found',
    layout: false
  });
});


// async function startServer() {
//   try {
//     await connectToMongoDB();
//     const PORT = process.env.PORT || 3000;

//   } catch (err) {
//     console.error('Failed to start server:', err);
//   }
// }

// startServer();
// --- MONGOOSE CONNECTION SETUP ---
app.use(adminRoutes);

cachedClient = null;

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
  console.log("Connected to MongoDB");
  return client;
}

// Serverless handler
const handler = serverless(app);

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