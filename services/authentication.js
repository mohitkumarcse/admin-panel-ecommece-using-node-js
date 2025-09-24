const jwt = require('jsonwebtoken');

exports.createToken = (user) => {
  const plainUser = user.toObject();
  const payload = {
    _id: plainUser._id,
    username: plainUser.username,
    email: plainUser.email,
    role: plainUser.role,
    profileImage: plainUser.profileImage,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}