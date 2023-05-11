const express = require('express');
const {
  getIntervention,
  getInterventions,
  updateIntervention,
  deleteIntervention,
  createIntervention,
  checkInterventions,
  getAllinterventions,
} = require('../controllers/interventions');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
router.use(protect, authorize('admin'));

const Intervention = require('../models/Intervention');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(protect, getInterventions)
  .post(protect, createIntervention);

router
  .route('/:truckId/trucks')
  .get(protect, advancedResults(Intervention), getInterventions);

router.route('/cost').get(protect, getAllinterventions);

router
  .route('/:id')
  .get(protect, getIntervention)
  .put(protect, updateIntervention)
  .delete(protect, deleteIntervention);

router.route('/check/:truck_id').get(protect, checkInterventions);

module.exports = router;
