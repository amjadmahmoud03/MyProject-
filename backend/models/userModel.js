const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name!'],
    trim: true,
    minlength: [4, 'Name is short, must be more than or equal to 4.'],
    maxlength: [15, 'Name is long, must be less than or equal to 20.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: {
    public_id: String,
    url: String,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role is ethier: (user, admin)',
    },
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password!'],
    minlength: [8, 'Password is short, must be more than or equal to 8.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same!',
    },
  },
  accountStatus: {
    type: String,
    enum: {
      values: ['Active', 'Suspended', 'Deleted'],
      message: 'accountStatus is ethier: (Active, Suspended, Deleted)',
    },
    default: 'Active',
  },
  byAdmin: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  favorites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Ad',
    },
  ],
});

// There is an index on email because it's unique.
userSchema.index({ accountStatus: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  if (this.options.skipHook) return next();
  this.find({ accountStatus: { $nin: ['Suspended', 'Deleted'] } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
