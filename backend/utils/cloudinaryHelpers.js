/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
const cloudinary = require('./cloudinary');
const catchAsync = require('./catchAsync');

exports.uploadImage = catchAsync(async (image, folder) => {
  const result = await cloudinary.uploader.upload(image, {
    folder,
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
});

exports.uploadImages = catchAsync(async (images, folder) => {
  const uploadedImages = [];

  for (const img of images) {
    this.uploadImage(img, folder);
  }

  return uploadedImages;
});

exports.deleteImage = catchAsync(async (public_id) => {
  if (!public_id) return;

  await cloudinary.uploader.destroy(public_id);
});

exports.deleteImages = catchAsync(async (images) => {
  for (const img of images) {
    this.deleteImage(img.public_id);
  }
});
