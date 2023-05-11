const express = require('express');
const {
  truckModelPhotoUpload,
  createTruckModel,
  getTruckModels,
} = require('../controllers/truck_model');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.route('/photo').post(truckModelPhotoUpload);
router
  .route('/')
  .get(protect, authorize('admin'), getTruckModels)
  .post(protect, createTruckModel);

module.exports = router;
