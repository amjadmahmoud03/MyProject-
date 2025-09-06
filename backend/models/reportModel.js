const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Report must belong to a user!'],
  },
  ad: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ad',
    required: [true, 'Report must belong to a advertising!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Processed'],
      message: 'Status is either: (Pending, Processed)',
    },
    default: 'Pending',
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description is long, must be less than or equal to 500.'],
  },
});

reportSchema.index({ user: 1, ad: 1 }, { unique: true });
reportSchema.index({ status: 1 });

reportSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo _id',
  });
  next();
});

reportSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'ad',
    select: '_id',
  });
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
