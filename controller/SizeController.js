const Size = require('../model/Size');
const SizeController = {
  // GET /admin/Sizes
  getSizes: async (req, res) => {
    try {
      const sizes = await Size.find().sort({ createdAt: -1 });
      console.log('Sizes', sizes);
      res.render('admin/sizes/index', { sizes: sizes, role: req.role, username: req.username.charAt(0).toUpperCase() + req.username.slice(1) });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },

  // GET /admin/category/create
  createSize: async (req, res) => {
    const size = await Size.find().sort({ createdAt: -1 });
    res.render('admin/sizes/create', { size: size });
  },

  // POST /admin/category/store
  storeSize: async (req, res) => {
    console.log('req', req.body)
    try {

      const { colorName, status } = req.body;
      const size = new Size({
        name: colorName,
        status,

      });
      await size.save();

      res.redirect('/admin/sizes');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to create size');
    }
  },

  // GET /admin/category/edit/:id
  editSize: async (req, res) => {
    try {
      const size = await Size.findById(req.params.id);
      if (!size) return res.status(404).send('Size not found');

      res.render('admin/sizes/edit', { size });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading size');
    }
  },

  // POST /admin/category/update/:id
  updateSize: async (req, res) => {
    try {
      const { name, description } = req.body;

      await Size.findByIdAndUpdate(req.params.id, {
        name,
        description,
        updatedAt: new Date(),
      });

      res.redirect('/admin/sizes');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating size');
    }
  },

  // GET /admin/category/delete/:id
  deleteSize: async (req, res) => {
    try {
      await Size.findByIdAndDelete(req.params.id);
      res.redirect('/admin/sizes');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting size');
    }
  },

  // GET /admin/category/view/:id
  viewSize: async (req, res) => {
    try {
      const size = await Size.findById(req.params.id);
      if (!size) return res.status(404).send('Category not found');

      res.render('admin/sizes/view', { size });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error viewing size');
    }
  },

  // GET /admin/category/update-status/:id
  updateStatus: async (req, res) => {
    const { id, type } = req.params;
    try {
      const size = await Size.findById(id);
      if (type === 'status') {
        size.status = size.status === 'active' ? 'inactive' : 'active';
      }

      await size.save();

      res.status(200).json({ message: `${type} updated successfully!!!` });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating status');
    }
  },
};



module.exports = SizeController;
