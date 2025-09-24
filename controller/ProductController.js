
const ProductController = {
  createProduct: (req, res) => {
    res.render('admin/products/create', { role: req.role, username: req.username.charAt(0).toUpperCase() + req.username.slice(1) });
  }
}

module.exports = ProductController;
