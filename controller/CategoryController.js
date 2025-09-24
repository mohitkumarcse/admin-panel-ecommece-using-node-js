const Category = require('../model/Category');
const CategoryController = {
  // GET /admin/categories
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 }).populate('parentId', 'name');
      console.log('categories', categories);
      const categoryData = categories.map(category => ({

        _id: category._id,
        name: category.name,
        categoryimage: category.image,
        slug: category.slug,
        isWomenTrending: category.isWomenTrending,
        isMenTrending: category.isMenTrending,
        isHomeTrending: category.isHomeTrending,
        status: category.status,
        parent: category.parentId ? category.parentId.name : '—',
        createdAt: category.createdAt,
        // add more fields as needed
      }));
      res.render('admin/categories/index', { categories: categoryData, role: req.role, username: req.username.charAt(0).toUpperCase() + req.username.slice(1) });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },

  // GET /admin/category/create
  createCategory: async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.render('admin/categories/create', { categories: categories });
  },

  // POST /admin/category/store
  storeCategory: async (req, res) => {
    console.log('req', req.body)
    try {

      const { categoryName, categoryDescription, status, isHomeTrending, isMenTrending, isWomenTrending } = req.body;
      const categoryImage = req.file ? req.file.filename : null;
      const category = new Category({
        name: categoryName,
        description: categoryDescription,
        image: 'category/' + categoryImage,
        status,
        isHomeTrending,
        isMenTrending,
        isWomenTrending,
      });
      await category.save();

      res.redirect('/admin/categories');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to create category');
    }
  },

  // GET /admin/category/edit/:id
  editCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).send('Category not found');

      res.render('admin/categories/edit', { category });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading category');
    }
  },

  // POST /admin/category/update/:id
  updateCategory: async (req, res) => {
    try {
      const { name, description } = req.body;

      await Category.findByIdAndUpdate(req.params.id, {
        name,
        description,
        updatedAt: new Date(),
      });

      res.redirect('/admin/categories');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating category');
    }
  },

  // GET /admin/category/delete/:id
  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.redirect('/admin/categories');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting category');
    }
  },

  // GET /admin/category/view/:id
  viewCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).send('Category not found');

      res.render('admin/categories/view', { category });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error viewing category');
    }
  },

  // GET /admin/category/update-status/:id
  updateStatus: async (req, res) => {
    const { id, type } = req.params;
    try {
      const category = await Category.findById(id);
      if (!category) return res.status(404).send('Category not found');

      if (type === 'status') {
        category.status = category.status === 'active' ? 'inactive' : 'active';
      }
      if (type === 'is_home_trending') {
        category.isHomeTrending = category.isHomeTrending === true ? false : true;
      }
      if (type === 'is_men_trending') {
        category.isMenTrending = category.isMenTrending === true ? false : true;
      }
      if (type === 'is_women_trending') {
        category.isWomenTrending = category.isWomenTrending === true ? false : true;
      }

      await category.save();

      res.status(200).json({ message: `${type} updated successfully!!!` });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating status');
    }
  },

  toggleTrending: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).send('Category not found');

      category.isTrending = !category.isTrending;
      await category.save();

      res.redirect('/admin/categories');
    } catch (err) {
      console.error('Error toggling trending:', err);
      res.status(500).send('Server Error');
    }
  }
};



module.exports = CategoryController;
