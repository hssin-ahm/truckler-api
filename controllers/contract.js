const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Contract = require('../models/Contract');

// @desc   Get all Contract
// @route  GET /api/v1/contract
// @access admin
exports.getContracts = asyncHandler(async (req, res, next) => {
  if (req.params.truckId) {
    const contract = await Contract.findOne({ truck: req.params.truckId });
    res.status(200).json({
      success: true,
      data: contract,
    });
  } else {
    const contract = await Contract.find({ disable: false });
    res.status(200).json({
      success: true,
      data: contract,
    });
  }
});

// @desc   Create new Contract
// @route  POST /api/v1/contract
// @access admin

exports.createContract = asyncHandler(async (req, res, next) => {
  const contract = await Contract.create(req.body);
  res.status(201).json({
    success: true,
    data: contract,
  });
});

// @desc   Get a single Contract
// @route  GET /api/v1/Contract/:id
// @access admin

exports.getContract = asyncHandler(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id);
  if (!contract) {
    return next(
      new ErrorResponse('Contract not found with id of ' + req.params.id, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: contract,
  });
});
// @desc   Update Contract
// @route  PUT /api/v1/contract/:id
// @access admin

exports.updateContract = asyncHandler(async (req, res, next) => {
  let contract = await Contract.findById(req.params.id);

  if (!contract) {
    return next(
      new ErrorResponse('Contract not found with id of ' + req.params.id, 404)
    );
  }

  await Contract.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    success: true,
  });
});

// @desc   Delete Contract
// @route  Delete /api/v1/contract/:id
// @access admin

exports.deleteContract = asyncHandler(async (req, res, next) => {
  let contract = await Contract.findById(req.params.id);

  if (!contract) {
    return next(
      new ErrorResponse('Contract not found with id of ' + req.params.id, 404)
    );
  }

  contract.disable = true;
  Contract.deleteOne(contract);

  res.status(200).json({
    success: true,
    data: {},
  });
});
