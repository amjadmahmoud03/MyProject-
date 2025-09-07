const Ad = require('../models/adModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const { uploadImages, deleteImages } = require('../utils/cloudinaryHelpers');

exports.getAllAds = catchAsync(async (req, res, next) => {
  const query = Ad.find({ status: { $ne: 'Pending' } });
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const ads = await features.query;

  const totalAds = await Ad.countDocuments({ status: { $ne: 'Pending' } });
  const limit = req.query.limit * 1 || 20;
  const totalPages = Math.ceil(totalAds / limit);
  const currentPage = req.query.page * 1 || 1;

  res.status(200).json({
    status: 'success',
    results: ads.length,
    totalAds,
    totalPages,
    currentPage,
    data: ads,
  });
});

exports.getAd = catchAsync(async (req, res, next) => {
  let ad = await Ad.findById(req.params.id);

  if (!ad) {
    return next(new AppError('No Ad found with that id', 404));
  }

  const hasViewed = ad.viewedBy.includes(req.user.id);

  if (!hasViewed) {
    await Ad.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
      $addToSet: { viewedBy: req.user.id },
    });

    ad = await Ad.findById(req.params.id);
  }

  res.status(200).json({
    status: 'success',
    data: ad,
  });
});

exports.createAd = catchAsync(async (req, res, next) => {
  if (req.body.images && Array.isArray(req.body.images)) {
    req.body.images = await uploadImages(req.body.images, 'ads');
  }

  req.body.status = 'Pending';
  req.body.user = req.user.id;

  const ad = await Ad.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Ad has been successfully created.',
    data: ad,
  });
});

const checkAdOwnership = (currentUser, AdUser) =>
  AdUser.toString() === currentUser;

exports.updateAd = catchAsync(async (req, res, next) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    return next(new AppError('No Ad found with that id', 404));
  }

  if (!checkAdOwnership(req.user.id, ad.user)) {
    return next(new AppError('You are not the owner of this ad', 403));
  }

  if (req.body.images && Array.isArray(req.body.images)) {
    if (ad.images && ad.images.length > 0) {
      await deleteImages(ad.images);
    }

    req.body.images = await uploadImages(req.body.images, 'ads');
  }

  req.body.status = 'Pending';

  const updatedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Ad has been successfully updated.',
    data: updatedAd,
  });
});

exports.deleteAd = catchAsync(async (req, res, next) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    return next(new AppError('No Ad found with that id', 404));
  }

  if (!checkAdOwnership(req.user.id, ad.user)) {
    return next(new AppError('You are not the owner of this ad', 403));
  }

  if (ad.images && ad.images.length > 0) {
    await deleteImages(ad.images);
  }

  await Ad.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'Ad has been successfully deleted.',
    data: null,
  });
});
