const express = require('express');
const {
  getClient,
  getClients,
  updateClient,
  deleteClient,
  createClient,
  getAllClients,
} = require('../controllers/client');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
router.use(protect, authorize('admin'));

const Client = require('../models/Client');
const advancedResults = require('../middleware/advancedResults');

router.route('/').get(advancedResults(Client), getClients).post(createClient);
router.route('/all').get(getAllClients);

router.route('/:id').get(getClient).put(updateClient).delete(deleteClient);

module.exports = router;
