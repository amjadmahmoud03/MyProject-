const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the category name!'],
    trim: true,
    unique: true,
    minlength: [3, 'Category name is short, must be more than or equal to 3.'],
    maxlength: [15, 'Category name is long, must be less than or equal to 15.'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [100, 'Description is long, must be less than or equal to 100.'],
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
