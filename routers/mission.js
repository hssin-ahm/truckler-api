const express = require('express');
const {
  getMissions,
  createMission,
  getMission,
  updateMission,
  deleteMission,
  getDriverMission,
  filterbetDate,
  getMissionStatusData,
  getAllMissions,
  getClientMission,
} = require('../controllers/Mission');

const { protect, authorize } = require('../middleware/auth');

const Mission = require('../models/Mission');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();
router.use(protect, authorize('admin'));

router
  .route('/')
  .get(advancedResults(Mission, 'truck driver'), protect, getMissions)
  .post(protect, createMission);

router.route('/all').get(protect, getAllMissions);

router.route('/history').post(protect, filterbetDate);

router.route('/status').get(protect, getMissionStatusData);

router
  .route('/:id')
  .get(protect, getMission)
  .put(protect, updateMission)
  .delete(protect, deleteMission);

router
  .route('/:driver_id/driver')
  .get(protect, advancedResults(Mission, 'truck'), getDriverMission);

router
  .route('/:client_id/client')
  .get(protect, advancedResults(Mission, 'truck'), getClientMission);

module.exports = router;
