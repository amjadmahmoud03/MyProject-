const express = require('express');
const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');

const router = express();

router.post(
  '/',
  authController.protect,
  authController.restrictTo('user'),
  reportController.createReport,
);

module.exports = router;
