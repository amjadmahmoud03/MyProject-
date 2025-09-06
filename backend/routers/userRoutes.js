const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch('/suspendMe', authController.protect, userController.suspendMe);
router.patch('/deleteMe', authController.protect, userController.deleteMe);

router.get('/favorites', authController.protect, userController.getMyFav);
router.post('/favorites', authController.protect, userController.addToFav);
router.delete(
  '/favorites/:id',
  authController.protect,
  userController.removeFromFav,
);

module.exports = router;
