const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: 0 },    // 1 = Admin, 0 = User
  status: { type: Number, default: 1 },  // 1 = Active, 0 = Inactive
  profileImage: { type: String, default: null } // for uploaded image filename
}, {
  timestamps: true
});

// Export the model, not just the schema
module.exports = userSchema;