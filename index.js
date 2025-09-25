const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const adminRoutes = require('./route/adminRoutes');
const { is_loggedIn } = require('./middleware/auth');
const { is_admin } = require('./middleware/isAdmin');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout'); // Your default layout

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/config', express.static(path.join(__dirname, 'config')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logging setup
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// MongoDB connection flag
let isConnected = false;

// Connect to MongoDB - returns a Promise
async function connectToMongoDB() {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('MongoDB Connected');
    } catch (err) {
      console.error('MongoDB connection failed:', err);
    }
  }
}

// Middleware to ensure MongoDB connection is established before continuing
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToMongoDB();
  }
  next();
});

// Admin logs route
app.get('/admin/logs', is_loggedIn, is_admin, (req, res) => {
  const logFile = path.join(logDir, 'access.log');

  fs.readFile(logFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return res.status(500).send('Error loading logs');
    }

    const logs = data.trim().split('\n').reverse();

    // Defensive checks in case req.username or req.role are missing
    const username = req.username
      ? req.username.charAt(0).toUpperCase() + req.username.slice(1)
      : 'User';
    const role = req.role || 'guest';

    res.render('admin/logs/log', { logs, role, username });
  });
});

// Use your admin routes (make sure this doesn't conflict with /admin/logs)
app.use(adminRoutes);

// 404 error page
app.use((req, res) => {
  res.status(404).render('admin/errors/404', {
    title: 'Page Not Found',
    layout: false,
  });
});

module.exports = app;
