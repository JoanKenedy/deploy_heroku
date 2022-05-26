const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/user.model');

//Utils

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.findAll();
  res.status(200).json({
    users,
  });
});
const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hassPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hassPassword,
    role,
  });

  newUser.password = undefined;

  res.status(201).json({
    newUser,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { user } = req;

  res.status(200).json({
    user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { user } = req;
  const { name, email } = req.body;

  // const user = await User.update({ name, email }, { where: { id: id } });

  await user.update({ name, email });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res) => {
  const { user } = req;
  // Soft delete
  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  user.password = undefined;

  res.status(200).json({ status: 'success', token, user });
});

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
};
