const express = require('express');

// Middlewares
const { repairExists } = require('../middlewares/repairs.middlewares');
const {
  protectToken,
  protectAdmin,
} = require('../middlewares/users.middlewares');
const {
  createRepairValidations,
  checkValidations,
} = require('../middlewares/userValidator.middleware');

// Controllers
const {
  getAllCompletedRepairs,
  getAllPendingRepairs,
  createRepair,
  getRepairById,
  repairCancelled,
  repairCompleted,
} = require('../controllers/repairs.controller');

const router = express.Router();

router.use(protectToken);

router.get('/completed', getAllCompletedRepairs);

router.get('/pending', protectAdmin, getAllPendingRepairs);

router.post('/', createRepairValidations, checkValidations, createRepair);

router.get('/:id', protectAdmin, repairExists, getRepairById);

router.patch('/:id', protectAdmin, repairExists, repairCompleted);

router.delete('/:id', protectAdmin, repairExists, repairCancelled);

module.exports = { repairsRouter: router };
