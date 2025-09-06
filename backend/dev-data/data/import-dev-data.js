const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../../models/userModel');
const Ad = require('../../models/adModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const ads = JSON.parse(fs.readFileSync(`${__dirname}/ads.json`, 'utf-8'));

const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Ad.create(ads);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Ad.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
