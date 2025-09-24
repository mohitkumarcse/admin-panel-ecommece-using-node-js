exports.is_admin = (req, res, next) => {
  if (req.role == 1) {
    next();
  } else {
    return res.redirect('/admin/dashboard');
  }
};