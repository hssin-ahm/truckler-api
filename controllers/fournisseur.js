const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Fournisseur = require('../models/Fournisseur');

// @desc   Get all Fournisseur
// @route  GET /api/v1/fournisseurs
// @access admin
exports.getFournisseurs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Create new fournisseur
// @route  POST /api/v1/fournisseurs
// @access admin

exports.createFournisseurs = asyncHandler(async (req, res, next) => {
  const fournisseur = await Fournisseur.create(req.body);
  res.status(201).json({
    success: true,
    data: fournisseur,
  });
});

// @desc   Get a single fournisseur
// @route  GET /api/v1/fournisseur/:id
// @access admin

exports.getFournisseur = asyncHandler(async (req, res, next) => {
  const fournisseur = await Fournisseur.findById(req.params.id);
  if (!fournisseur) {
    return next(
      new ErrorResponse(
        'Fournisseur not found with id of ' + req.params.id,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: fournisseur,
  });
});
// @desc   Update fournisseur
// @route  PUT /api/v1/fournisseur/:id
// @access admin

exports.updateFournisseur = asyncHandler(async (req, res, next) => {
  let fournisseur = await Fournisseur.findById(req.params.id);

  if (!fournisseur) {
    return next(
      new ErrorResponse(
        'FOurnisseur not found with id of ' + req.params.id,
        404
      )
    );
  }

  await Fournisseur.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    success: true,
  });
});

// @desc   Delete fournisseur
// @route  Delete /api/v1/fournisseur/:id
// @access admin

exports.deleteFournisseur = asyncHandler(async (req, res, next) => {
  let fournisseur = await Fournisseur.findById(req.params.id);

  if (!fournisseur) {
    return next(
      new ErrorResponse(
        'Fournisseur not found with id of ' + req.params.id,
        404
      )
    );
  }

  fournisseur.disable = true;
  Fournisseur.deleteOne(fournisseur);

  res.status(200).json({
    success: true,
    data: {},
  });
});
