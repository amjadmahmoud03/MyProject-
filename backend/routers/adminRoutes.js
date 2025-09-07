const express = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

const router = express();
// Category
router.get(
  '/categories',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getAllCategories,
);
router.post(
  '/categories',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.createCategory,
);
router.get(
  '/categories/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getCategory,
);
router.patch(
  '/categories/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.updateCategory,
);
router.delete(
  '/categories/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.deleteCategory,
);

// Report
router.get(
  '/reports',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getAllReports,
);
router.get(
  '/reports/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getReport,
);
router.patch(
  '/reports/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.processReport,
);

// Ad
router.get(
  '/ads',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getAllAds,
);
router.get(
  '/ads/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getAd,
);
router.patch(
  '/ads/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.updateAd,
);
router.delete(
  '/ads/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.deleteAd,
);

// User
router.get(
  '/users',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getAllUsers,
);
router.get(
  '/users/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.getUser,
);
router.patch(
  '/users/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.suspendUser,
);
router.patch(
  '/users/:id',
  authController.protect,
  authController.restrictTo('admin'),
  adminController.deleteUser,
);

module.exports = router;
