const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { title } = require('process');
const adminRoutes = require('./route/adminRoutes');
const morgan = require('morgan');
const { is_loggedIn } = require('./middleware/auth');
const { is_admin } = require('./middleware/isAdmin');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/config', express.static(__dirname + '/config'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.get('/admin/logs', is_loggedIn, is_admin, (req, res) => {
  const logFile = path.join(logDir, 'access.log');
  console.log('*++++++++++');

  fs.readFile(logFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return res.status(500).send('Error loading logs');
    }

    const logs = data.trim().split('\n').reverse();
    res.render('admin/logs/log', { logs, role: req.role, username: req.username.charAt(0).toUpperCase() + req.username.slice(1) });
  });
});

app.use(adminRoutes);
app.use((req, res, next) => {
  res.status(404).render('admin/errors/404', {
    title: 'Page Not Found',
    layout: false
  });
});


mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


// let isConnected = false;
// async function connectToMongoDB() {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     isConnected = true;
//     console.log('MongoDB Connected');
//   } catch (err) {
//     console.log('Not Connected', err);
//   }
// }


// app.use((req, res, next) => {
//   if (!isConnected) {
//     connectToMongoDB();
//   }
//   next();
// })

console.log(process.env.PORT)

app.listen(process.env.PORT, () => {
  console.log('Server suru ho gaya hai')
})


console.log('***********************')

// module.exports = app

