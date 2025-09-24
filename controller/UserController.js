
const mongoose = require('mongoose');
const UserSchema = require('../model/User');
const User = mongoose.model('User', UserSchema);
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/users/index', { users: users, role: req.role, username: req.username.charAt(0).toUpperCase() + req.username.slice(1) });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/errors/500', { title: 'Error' });
  }
}

exports.postUser = async (req, res) => {
  const { username, email, password, role, status } = req.body;
  const profileImage = req.file ? req.file.filename : null;
  try {
    const existingUser = await User.findOne({ email });
    console.log('existingUser', existingUser)
    if (existingUser) {
      return res.render('admin/errors/404');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User;
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.role = role;
    user.status = status;
    user.profileImage = profileImage;
    await user.save();

    res.redirect('/admin/users');
  } catch (error) {
    console.log(error)
  }
}

exports.createUser = async (req, res) => {
  try {
    res.render('admin/users/create', { title: 'Create User', role: req.role });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/errors/500', { title: 'Error' });
  }
}

exports.destroyUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/errors/500', { title: 'Error' });
  }

}

exports.editUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('admin/users/edit', { title: 'Edit User', user: user, role: req.role });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/errors/500', { title: 'Error' });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User Not Found');
    }

    // Update profile image if new one is uploaded
    if (req.file) {
      const newImage = req.file.filename;

      // Delete old image if exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, '../public/uploads/', user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      user.profileImage = newImage;
    }

    // Update other fields
    user.username = req.body.username;
    user.email = req.body.email;
    user.role = req.body.role;
    user.status = req.body.status;

    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).send('Server Error');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = !user.status;
    await user.save();
    res.status(200).json({ message: 'Status Updated Successfully ', status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong ', status: false });
  }
}

exports.viewUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('admin/users/view', { title: 'View User', user: user, role: req.role });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/errors/500', { title: 'Error' });
  }
}

