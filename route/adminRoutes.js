const express = require('express');
const router = express.Router();
const AuthController = require('../controller/auth/AuthController');
const DashboardController = require('../controller/auth/DashboardController');
const { is_loggedIn } = require('../middleware/auth');
const { is_admin } = require('../middleware/isAdmin');
const UserController = require('../controller/UserController');
const upload = require('../config/multerConfig');
const roles = require('../config/roles.json');
const CategoryController = require('../controller/CategoryController');
const BrandController = require('../controller/BrandController');
const SizeController = require('../controller/SizeController');
const ColorController = require('../controller/ColorController');
const ProductController = require('../controller/ProductController');
const MaterialController = require('../controller/MaterialController');
const TagController = require('../controller/TagController');

/*Start User Authentication Route */
router.get('/admin/login', AuthController.getLogin);
router.post('/admin/login', AuthController.postLogin);

/*End User Authentication Route */


// router.get('/admin/dashboard', is_loggedIn, DashboardController.getDashboard);
// router.post('/admin/user/create', is_loggedIn, is_admin, upload.single('profileImage'), UserController.postUser);
// router.get('/user/create', is_loggedIn, is_admin, UserController.createUser);
// router.get('/admin/users', is_loggedIn, UserController.getUsers);
// router.get('/user/edit/:id', is_loggedIn, is_admin, UserController.editUser);
// router.post('/user/update/:id', upload.single('profileImage'), is_loggedIn, UserController.updateUser);
// router.get('/user/delete/:id', is_loggedIn, is_admin, UserController.distroyUser);
// router.get('/user/view/:id', is_loggedIn, is_admin, UserController.viewUser);
// router.get('/user/update-status/:id', is_loggedIn, is_admin, UserController.updateStatus);



router.get('/admin/logout', is_loggedIn, AuthController.logout);

// User Management Routes
// router.get('/admin/dashboard', is_loggedIn, DashboardController.getDashboard);
// router.get('/admin/users', is_loggedIn, is_admin, UserController.getUsers);
// router.get('/admin/user/create', is_loggedIn, is_admin, UserController.createUser);
// router.post('/admin/user/store', is_loggedIn, is_admin, upload.single('profileImage'), UserController.postUser);
// router.get('/admin/user/edit/:id', is_loggedIn, is_admin, UserController.editUser);
// router.post('/admin/user/update/:id', is_loggedIn, is_admin, upload.single('profileImage'), UserController.updateUser);
// router.get('/admin/user/delete/:id', is_loggedIn, is_admin, UserController.destroyUser);
// router.get('/admin/user/view/:id', is_loggedIn, is_admin, UserController.viewUser);
// router.get('/admin/user/update-status/:id', is_loggedIn, is_admin, UserController.updateStatus);



// // CATEGORY ROUTES
// router.get('/admin/categories', is_loggedIn, is_admin, CategoryController.getCategories);
// router.get('/admin/category/create', is_loggedIn, is_admin, CategoryController.createCategory);
// router.post('/admin/category/store', is_loggedIn, is_admin, upload.single('categoryImage'), CategoryController.storeCategory);
// router.get('/admin/category/edit/:id', is_loggedIn, is_admin, CategoryController.editCategory);
// router.post('/admin/category/update/:id', is_loggedIn, is_admin, CategoryController.updateCategory);
// router.get('/admin/category/delete/:id', is_loggedIn, is_admin, CategoryController.deleteCategory);
// router.get('/admin/category/view/:id', is_loggedIn, is_admin, CategoryController.viewCategory);
// router.get('/admin/category/update-status/:id/:type', is_loggedIn, is_admin, CategoryController.updateStatus);
// // router.get('/admin/category/toggle-trending/:id', is_loggedIn, is_admin, CategoryController.toggleTrending);

// // BRAND ROUTES
// router.get('/admin/brands', is_loggedIn, is_admin, BrandController.getBrands);
// router.get('/admin/brand/create', is_loggedIn, is_admin, BrandController.createBrand);
// router.post('/admin/brand/store', is_loggedIn, is_admin, upload.single('brandImage'), BrandController.storeBrand);
// router.get('/admin/brand/edit/:id', is_loggedIn, is_admin, BrandController.editBrand);
// router.post('/admin/brand/update/:id', is_loggedIn, is_admin, upload.single('brandImage'), BrandController.updateBrand);
// router.get('/admin/brand/delete/:id', is_loggedIn, is_admin, BrandController.deleteBrand);
// router.get('/admin/brand/view/:id', is_loggedIn, is_admin, BrandController.viewBrand);
// router.get('/admin/brand/update-status/:id/:type', is_loggedIn, is_admin, BrandController.updateStatus);
// // router.get('/admin/brand/toggle-trending/:id', is_loggedIn, is_admin, BrandController.toggleTrending);

// router.get('/admin/sizes', is_loggedIn, is_admin, SizeController.getSizes);
// router.get('/admin/size/create', is_loggedIn, is_admin, SizeController.createSize);
// router.post('/admin/size/store', is_loggedIn, is_admin, SizeController.storeSize);
// router.get('/admin/size/edit/:id', is_loggedIn, is_admin, SizeController.editSize);
// router.post('/admin/size/update/:id', is_loggedIn, is_admin, SizeController.updateSize);
// router.get('/admin/size/delete/:id', is_loggedIn, is_admin, SizeController.deleteSize);
// router.get('/admin/size/view/:id', is_loggedIn, is_admin, SizeController.viewSize);
// router.get('/admin/size/update-status/:id/:type', is_loggedIn, is_admin, SizeController.updateStatus);


// // router.get('/admin/colors', is_loggedIn, is_admin, ColorController.getColors);
// // router.get('/admin/color/create', is_loggedIn, is_admin, ColorController.createColor);
// // router.post('/admin/color/store', is_loggedIn, is_admin, ColorController.storeColor);
// // router.get('/admin/color/edit/:id', is_loggedIn, is_admin, ColorController.editColor);
// // router.post('/admin/color/update/:id', is_loggedIn, is_admin, ColorController.updateColor);
// // router.get('/admin/color/delete/:id', is_loggedIn, is_admin, ColorController.deleteColor);
// // router.get('/admin/color/view/:id', is_loggedIn, is_admin, ColorController.viewColor);
// // router.get('/admin/color/update-status/:id', is_loggedIn, is_admin, ColorController.updateStatus);

// // router.get('/admin/tags', is_loggedIn, is_admin, TagController.getTags);
// // router.get('/admin/tag/create', is_loggedIn, is_admin, TagController.createTag);
// // router.post('/admin/tag/store', is_loggedIn, is_admin, TagController.storeTag);
// // router.get('/admin/tag/edit/:id', is_loggedIn, is_admin, TagController.editTag);
// // router.post('/admin/tag/update/:id', is_loggedIn, is_admin, TagController.updateTag);
// // router.get('/admin/tag/delete/:id', is_loggedIn, is_admin, TagController.deleteTag);
// // router.get('/admin/tag/view/:id', is_loggedIn, is_admin, TagController.viewTag);
// // router.get('/admin/tag/update-status/:id', is_loggedIn, is_admin, TagController.updateStatus);

// // router.get('/admin/materials', is_loggedIn, is_admin, MaterialController.getMaterials);
// // router.get('/admin/material/create', is_loggedIn, is_admin, MaterialController.createMaterial);
// // router.post('/admin/material/store', is_loggedIn, is_admin, MaterialController.storeMaterial);
// // router.get('/admin/material/edit/:id', is_loggedIn, is_admin, MaterialController.editMaterial);
// // router.post('/admin/material/update/:id', is_loggedIn, is_admin, MaterialController.updateMaterial);
// // router.get('/admin/material/delete/:id', is_loggedIn, is_admin, MaterialController.deleteMaterial);
// // router.get('/admin/material/view/:id', is_loggedIn, is_admin, MaterialController.viewMaterial);
// // router.get('/admin/material/update-status/:id', is_loggedIn, is_admin, MaterialController.updateStatus);


// // router.get('/admin/products', is_loggedIn, is_admin, ProductController.getProducts);
// router.get('/admin/product/create', is_loggedIn, is_admin, ProductController.createProduct);
// router.post('/admin/product/store', is_loggedIn, is_admin, upload.single('productImage'), ProductController.storeProduct);
// router.get('/admin/product/edit/:id', is_loggedIn, is_admin, ProductController.editProduct);
// router.post('/admin/product/update/:id', is_loggedIn, is_admin, upload.single('productImage'), ProductController.updateProduct);
// router.get('/admin/product/delete/:id', is_loggedIn, is_admin, ProductController.deleteProduct);
// router.get('/admin/product/view/:id', is_loggedIn, is_admin, ProductController.viewProduct);
// router.get('/admin/product/update-status/:id', is_loggedIn, is_admin, ProductController.updateStatus);
// router.get('/admin/product/toggle-featured/:id', is_loggedIn, is_admin, ProductController.toggleFeatured);



module.exports = router;