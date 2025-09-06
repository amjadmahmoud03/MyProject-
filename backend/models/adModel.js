const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide the ad title!'],
    trim: true,
    minlength: [5, 'Title is short, must be more than or equal to 5.'],
    maxlength: [30, 'Title is long, must be less than or equal to 30.'],
  },
  color: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    trim: true,
    validate: {
      validator: function (value) {
        const validSizes = ['S', 'M', 'L', 'XL'];
        const isEnumValid = validSizes.includes(value);
        const isDimensionValid = /^\d{1,5}x\d{1,5}(x\d{1,5})?$/.test(value);

        return isEnumValid || isDimensionValid;
      },
      message:
        "Size must be either (S, M, L, XL) or a dimension format like '120x120x120'.",
    },
  },
  price: {
    type: Number,
    required: [true, 'Please provide the price!'],
    min: [1, 'Price is wrong, must be more than or equal 1'],
    validate: {
      validator: function (value) {
        return Number.isFinite(value);
      },
      message: 'Price must be a valid number.',
    },
  },
  currency: {
    type: String,
    required: true,
    enum: {
      values: ['USD', 'EUR', 'SYP'],
      message: 'Price is ethier: (USD, EUR, SYP)',
    },
    default: 'USD',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  condition: {
    type: String,
    required: [true, 'Please provide the condition!'],
    enum: {
      values: ['New', 'Used'],
      message: 'Condition is ethier: (NEW, USED)',
    },
    default: 'New',
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Available'],
      message: 'Status is ethier: (Pending, Available)',
    },
    default: 'Pending',
  },
  delivery: {
    type: Boolean,
    default: false,
  },
  exchange: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description is long, must be less than or equal to 200.'],
  },
  contact: {
    type: Map,
    of: String,
    default: {},
    required: [true, 'Please provide the contact method!'],
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  viewedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Ad must belong to a user!'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Ad must belong to a category!'],
  },
});

adSchema.index({ user: 1 });
adSchema.index({ category: 1 });
adSchema.index({ createdAt: -1 });
adSchema.index({ views: -1 });

adSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

adSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name',
  });
  next();
});

adSchema.pre(/^findByIdAndUpdate/, function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
