const express = require('express');
const { getCosts, getTotalprice, getAllCosts } = require('../controllers/cost');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

const Cost = require('../models/Cost');

const advancedResults = require('../middleware/advancedResults');

router.route('/:truckId/trucks').get(protect, advancedResults(Cost), getCosts);
router.route('/:truckId/total').get(protect, getTotalprice);

router.route('/all').get(protect, getAllCosts);

module.exports = router;
