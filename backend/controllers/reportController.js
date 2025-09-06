const Report = require('../models/reportModel');
const Ad = require('../models/adModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReport = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const { adId, description } = req.body;
  if (!adId) {
    return next(new AppError('Ad ID is required', 400));
  }

  const ad = await Ad.findById(adId);
  if (!ad) {
    return next(new AppError('No Ad found with that id', 404));
  }

  const existingReport = await Report.findOne({
    ad: adId,
    user: userId,
  });
  if (existingReport) {
    return next(new AppError('You have already reported this ad', 400));
  }

  const report = await Report.create({ ad: adId, user: userId, description });

  res.status(201).json({
    status: 'success',
    data: {
      data: report,
    },
  });
});
