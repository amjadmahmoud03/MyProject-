const express = require('express');
const authController = require('../controllers/authController');
const adController = require('../controllers/adController');

const router = express();

router.get('/', adController.getAllAds);
router.post(
  '/',
  authController.protect,
  authController.restrictTo('user'),
  adController.createAd,
);
router.get('/:id', authController.protect, adController.getAd);
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('user'),
  adController.updateAd,
);
router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('user'),
  adController.deleteAd,
);

module.exports = router;
