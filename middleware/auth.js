const accessControl = require('../helpers/accessControl');
const { verifyToken, createToken } = require('../services/authentication');
exports.is_loggedIn = (req, res, next) => {
  try {
    if (req.cookies.token) {
      const tokenData = verifyToken(req.cookies.token)
      //req.user = token;
      req.username = tokenData.username;
      req.role = tokenData.role;
      next();
    } else {
      return res.redirect('/admin/login');
    }
  } catch (err) {
    return res.redirect('/admin/login');
  }
};    