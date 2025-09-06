/* eslint-disable camelcase */
const User = require('../models/userModel');
const Ad = require('../models/adModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { uploadImage, deleteImage } = require('../utils/cloudinaryHelpers');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  const updatedObj = filterObj(req.body, 'name', 'email');

  if (req.body.photo) {
    if (req.user.photo) {
      await deleteImage(req.user.photo.publid_id);
    }

    updatedObj.photo = await uploadImage(req.body.photo, 'users');
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.suspendMe = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  await User.findByIdAndUpdate(req.user.id, { accountStatus: 'Suspended' });

  res.status(204).json({
    status: 'success',
    message: 'Your account has been suspended successfully',
    data: null,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  await User.findByIdAndUpdate(req.user.id, { accountStatus: 'Deleted' });

  res.status(204).json({
    status: 'success',
    message: 'Your account has been deleted successfully',
    data: null,
  });
});

exports.getMyFav = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('favorites');
  const { favorites } = user;

  res.status(200).json({
    status: 'success',
    results: favorites.length,
    data: {
      data: favorites,
    },
  });
});

exports.addToFav = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { adId } = req.body;

  if (!adId) {
    return next(new AppError('Please provide adId to add to favorites', 400));
  }

  const adExists = await Ad.findById(adId);
  if (!adExists) {
    return next(new AppError('Ad not found', 404));
  }

  if (Ad.status !== 'Available') {
    return next(new AppError('Cannot add unavailable ad to favorites', 400));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { favorites: adId },
    },
    {
      new: true,
    },
  ).populate('favorites');
  const { favorites } = user;

  res.status(200).json({
    status: 'success',
    data: {
      data: favorites,
    },
  });
});

exports.removeFromFav = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const adId = req.params.id;

  if (!adId) {
    return next(
      new AppError('Please provide ad ID to remove from favorites', 400),
    );
  }

  const user = await User.findById(userId);
  if (!user.favorites.includes(adId)) {
    return next(new AppError('Ad not found in your favorites', 404));
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { favorites: adId },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
