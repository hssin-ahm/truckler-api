const express = require('express');
const {
  getTrucks,
  createTruck,
  getTruck,
  updateTruck,
  deleteTruck,
  truckPhotoUpload,
  searchByKey,
  getTrucksWithoutPagination,
  getTruckStatusData,
} = require('../controllers/trucks');

const Truck = require('../models/Truck');

const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();
router.use(protect, authorize('admin'));


router
  .route('/')
  .get(advancedResults(Truck, 'information model'), protect, getTrucks)
  .post(protect, createTruck);

router.route('/search/:key').get(protect, searchByKey);
router.route('/:id/photo').put(protect, authorize('admin'), truckPhotoUpload);

router.route('/all/nopag').get(protect, getTrucksWithoutPagination);
router.route('/status').get(protect, getTruckStatusData);
router
  .route('/:id')
  .get(protect, getTruck)
  .put(protect, updateTruck)
  .delete(protect, deleteTruck);

module.exports = router;
