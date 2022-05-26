const express = require('express');

const router = express.Router();

//Middlewares

const {
  userExists,
  protectToken,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');
const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/userValidator.middleware');

// Controller
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
} = require('../controllers/users.controller');

router.post('/login', login);

router.post('/', createUserValidations, checkValidations, createUser);

router.use(protectToken);

router.get('/', getAllUsers);

router.get('/:id', userExists, getUserById);

router.patch('/:id', userExists, protectAccountOwner, updateUser);

router.delete('/:id', userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
