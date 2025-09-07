const Category = require('../models/categoryModel');
const Report = require('../models/reportModel');
const User = require('../models/userModel');
const Ad = require('../models/adModel');
const { deleteImages } = require('../utils/cloudinaryHelpers');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const categories = await features.query;

  const totalCategories = await Category.countDocuments();
  const limit = req.query.limit * 1 || 20;
  const totalPages = Math.ceil(totalCategories / limit);
  const currentPage = req.query.page * 1 || 1;

  res.status(200).json({
    status: 'success',
    results: categories.length,
    totalCategories,
    totalPages,
    currentPage,
    data: categories,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Category has been successfully created.',
    data: category,
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError('No category found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Category has been successfully updated.',
    data: category,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Category has been successfully deleted.',
    data: null,
  });
});

exports.getAllReports = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Report.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reports = await features.query;

  const totalReports = await Report.countDocuments();
  const limit = req.query.limit * 1 || 20;
  const totalPages = Math.ceil(totalReports / limit);
  const currentPage = req.query.page * 1 || 1;

  res.status(200).json({
    status: 'success',
    results: reports.length,
    totalReports,
    totalPages,
    currentPage,
    data: reports,
  });
});

exports.getReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new AppError('No report found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: report,
  });
});

exports.processReport = catchAsync(async (req, res, next) => {
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status: 'Processed' },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!report) {
    return next(new AppError('No report found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Report has been successfully processed.',
    data: report,
  });
});

exports.getAllAds = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Ad.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const ads = await features.query;

  const totalAds = await Ad.countDocuments();
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
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    return next(new AppError('No Ad found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: ad,
  });
});

exports.updateAd = catchAsync(async (req, res, next) => {
  const ad = await Ad.findByIdAndUpdate(
    req.params.id,
    { status: 'Available' },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!ad) {
    return next(new AppError('No Ad found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Ad status updated to Available',
    data: ad,
  });
});

exports.deleteAd = catchAsync(async (req, res, next) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    return next(new AppError('No Ad found with that id', 404));
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

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

  const totalUsers = await Ad.countDocuments();
  const limit = req.query.limit * 1 || 20;
  const totalPages = Math.ceil(totalUsers / limit);
  const currentPage = req.query.page * 1 || 1;

  res.status(200).json({
    status: 'success',
    results: users.length,
    totalUsers,
    totalPages,
    currentPage,
    data: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.suspendUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  await User.findByIdAndUpdate(req.params.id, {
    accountStatus: 'Suspended',
    byAdmin: true,
  });

  res.status(204).json({
    status: 'success',
    message: 'User has been successfully suspended.',
    data: null,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  await User.findByIdAndUpdate(req.params.id, {
    accountStatus: 'Deleted',
    byAdmin: true,
  });

  res.status(204).json({
    status: 'success',
    message: 'User has been successfully deleted.',
    data: null,
  });
});
