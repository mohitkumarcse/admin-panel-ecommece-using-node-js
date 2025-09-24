const Brand = require('../model/Brand');

const BrandController = {
  // GET /admin/brands
  getBrands: async (req, res) => {
    try {
      const brands = await Brand.find().sort({ createdAt: -1 });
      res.render('admin/brands/index', { brands: brands, role: req.role, username: req.username.charAt(0).toUpperCase() + req.username.slice(1) });
    } catch (err) {
      console.error('Error fetching brands:', err);
      res.status(500).send('Server Error');
    }
  },

  // GET /admin/brand/create
  createBrand: (req, res) => {
    res.render('admin/brands/create');
  },

  // POST /admin/brand/store
  storeBrand: async (req, res) => {
    console.log('req.body', req.body)
    try {
      const { brandName, brandDescription, status, isHomeTrending, isMenTrending, isWomenTrending } = req.body;
      const brandImage = req.file ? req.file.filename : null;

      if (!brandName) {
        return res.status(400).send('Brand name is required');
      }

      const newBrand = new Brand({
        name: brandName,
        description: brandDescription,
        image: 'brand/' + brandImage,
        status,
        isHomeTrending,
        isMenTrending,
        isWomenTrending,
      });

      await newBrand.save();
      res.redirect('/admin/brands',);
    } catch (err) {
      console.error('Error storing brand:', err);
      res.status(500).send('Error storing brand');
    }
  },

  // GET /admin/brand/edit/:id
  editBrand: async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) return res.status(404).send('Brand not found');

      res.render('admin/brands/edit', { brand });
    } catch (err) {
      console.error('Error editing brand:', err);
      res.status(500).send('Server Error');
    }
  },

  // POST /admin/brand/update/:id
  updateBrand: async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) {
        return res.status(404).send('Brand Not Found');
      }

      // Handle uploaded image
      if (req.file) {
        const newImage = req.file.filename;
        if (brand.image) {
          const oldImagePath = path.join(__dirname, '../public/uploads/', brand.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        brand.image = newImage;
      }

      // Update brand fields
      brand.name = req.body.name;
      brand.description = req.body.description || '';
      brand.status = req.body.status;
      brand.isHomeTrending = req.body.isHomeTrending === 'true' || req.body.isHomeTrending === 'on';
      brand.isMenTrending = req.body.isMenTrending === 'true' || req.body.isMenTrending === 'on';
      brand.isWomenTrending = req.body.isWomenTrending === 'true' || req.body.isWomenTrending === 'on';

      await brand.save();
      res.redirect('/admin/brands');
    } catch (err) {
      console.error('Update Brand Error:', err);
      res.status(500).send('Server Error');
    }
  },

  // GET /admin/brand/delete/:id
  deleteBrand: async (req, res) => {
    try {
      await Brand.findByIdAndDelete(req.params.id);
      res.redirect('/admin/brands');
    } catch (err) {
      console.error('Error deleting brand:', err);
      res.status(500).send('Error deleting brand');
    }
  },

  // GET /admin/brand/view/:id
  viewBrand: async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) return res.status(404).send('Brand not found');

      res.render('admin/brands/view', { brand });
    } catch (err) {
      console.error('Error viewing brand:', err);
      res.status(500).send('Error viewing brand');
    }
  },

  // GET /admin/brand/update-status/:id
  updateStatus: async (req, res) => {
    const { id, type } = req.params;
    try {
      const brand = await Brand.findById(id);
      if (!brand) return res.status(404).send('Brand not found');

      if (type === 'status') {
        brand.status = brand.status === 'active' ? 'inactive' : 'active';
      }
      if (type === 'is_home_trending') {
        brand.isHomeTrending = brand.isHomeTrending === true ? false : true;
      }
      if (type === 'is_men_trending') {
        brand.isMenTrending = brand.isMenTrending === true ? false : true;
      }
      if (type === 'is_women_trending') {
        brand.isWomenTrending = brand.isWomenTrending === true ? false : true;
      }

      await brand.save();

      res.status(200).json({ message: `${type} updated successfully!!!` });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating status');
    }
  },

  // toggleTrending: async (req, res) => {
  //   try {
  //     const brand = await Brand.findById(req.params.id);
  //     if (!brand) return res.status(404).send('Brand not found');

  //     brand.isTrending = !brand.isTrending;
  //     await brand.save();

  //     res.redirect('/admin/brands');
  //   } catch (err) {
  //     console.error('Error toggling trending:', err);
  //     res.status(500).send('Server Error');
  //   }
  // }
};

module.exports = BrandController;
