const express = require('express');
const {
  getTruckInfos,
  deleteTruckInfo,
  createTruckinfo,
  updateTruckinfo,
} = require('../controllers/truckInfo');

const TruckInfo = require('../models/TruckInfo');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(protect, authorize('admin'));

router
  .route('/')
  .get(getTruckInfos)
  .post(createTruckinfo)
  .delete(deleteTruckInfo);

router.route('/:id').put(updateTruckinfo).delete(deleteTruckInfo);

module.exports = router;
