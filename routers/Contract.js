const express = require('express');
const {
  getContracts,
  createContract,
  getContract,
  updateContract,
  deleteContract,
} = require('../controllers/contract');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect, authorize('admin'));

router.route('/').get(protect, getContracts).post(protect, createContract);

router.route('/:truckId/trucks').get(protect, getContracts);
router
  .route('/:id')
  .get(protect, getContract)
  .put(protect, updateContract)
  .delete(protect, deleteContract);

module.exports = router;
