const express = require('express');
const {
  getReclamations,
  getReclamation,
  createReclamation,
  updateReclamation,
  deleteReclamation,
} = require('../controllers/reclamations');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getReclamations)
  .post(protect, createReclamation);

router
  .route('/:id')
  .get(protect, getReclamation)
  .put(protect, updateReclamation)
  .delete(protect, deleteReclamation);

module.exports = router;
