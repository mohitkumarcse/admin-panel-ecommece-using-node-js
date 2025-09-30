const express = require('express');
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

const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

// Logging Setup
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/config', express.static(path.join(__dirname, 'config')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Admin Logs Viewer Route
app.get('/admin/logs', is_loggedIn, is_admin, (req, res) => {
  const logFile = path.join(logDir, 'access.log');
  fs.readFile(logFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return res.status(500).send('Error loading logs');
    }
    const logs = data.trim().split('\n').reverse();
    res.render('admin/logs/log', {
      logs,
      role: req.role,
      username: req.username.charAt(0).toUpperCase() + req.username.slice(1)
    });
  });
});

// Admin Routes
app.use(adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('admin/errors/404', {
    title: 'Page Not Found',
    layout: false
  });
});

// MongoDB Connection and Server Start
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce-admin-panel';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Optional: Exit if DB fails to connect
  });
