const express = require('express');
const {
  getFournisseurs,
  createFournisseurs,
  getFournisseur,
  updateFournisseur,
  deleteFournisseur,
} = require('../controllers/fournisseur');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Fournisseur = require('../models/Fournisseur');

const router = express.Router();
router.use(protect, authorize('admin'));

router
  .route('/')
  .get(advancedResults(Fournisseur), protect, getFournisseurs)
  .post(protect, createFournisseurs);

router
  .route('/:id')
  .get(protect, getFournisseur)
  .put(protect, updateFournisseur)
  .delete(protect, deleteFournisseur);

module.exports = router;
