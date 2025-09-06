const Category = require('../models/categoryModel');
const Report = require('../models/reportModel');
const User = require('../models/userModel');
const adController = require('./adController');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      data: categories,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: category,
    },
  });
});
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: category,
    },
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
    data: {
      data: category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find();

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: {
      data: reports,
    },
  });
});

exports.getReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new AppError('No report found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: report,
    },
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
    data: {
      data: report,
    },
  });
});

exports.getAllAds = adController.getAllAds;
exports.getAd = adController.getAd;
exports.deleteAd = adController.deleteAd;

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      data: users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
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
    data: null,
  });
});
