const mongoose = require('mongoose');
const UserSchema = require('../../model/User');
const User = mongoose.model('User', UserSchema);
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { createToken, verifyToken } = require('../../services/authentication');


exports.getLogin = (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/auth/sign-in', { title: 'Sign-in', layout: false });
};

exports.postLogin =
  async (req, res) => {
    const { email, password } = req.body;
    if (email === '' || password === '') {
      return res.redirect('/admin/login');
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.redirect('/admin/login');
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      return res.redirect('/admin/login');
    }

    // console.log(existingUser._id)
    // res.cookie('user', existingUser._id, {
    //   maxAge: 1000 * 60 * 60
    // });

    const token = createToken(existingUser);

    res.cookie('token', token, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60
    });

    return res.redirect('/admin/dashboard');
  };

exports.signup = (req, res) => {
  res.send('POST /signup');
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
};