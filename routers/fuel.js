const express = require('express');
const {
  getFuel,
  getFuels,
  updateFuel,
  deleteFuel,
  createFuel,
  checkFuels,
  getAllFuels,
} = require('../controllers/fuel');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
router.use(protect, authorize('admin'));

const Fuel = require('../models/Fuel');
const advancedResults = require('../middleware/advancedResults');

router.route('/').get(protect, getFuels).post(protect, createFuel);

router.route('/cost').get(protect, getAllFuels);

router.route('/:truckId/trucks').get(protect, advancedResults(Fuel), getFuels);

router
  .route('/:id')
  .get(protect, getFuel)
  .put(protect, updateFuel)
  .delete(protect, deleteFuel);

router.route('/check/:truck_id').get(protect, checkFuels);

module.exports = router;
