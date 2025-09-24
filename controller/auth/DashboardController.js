
exports.getDashboard = (req, res) => {
  return res.render('admin/dashboard', { title: 'Dashboard' });
};