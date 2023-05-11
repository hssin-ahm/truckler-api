const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Client = require('../models/Client');

// @desc   Get all Client
// @route  GET /api/v1/Client
// @access admin
exports.getClients = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get all Client without pagination
// @route  GET /api/v1/Client/all
// @access admin
exports.getAllClients = asyncHandler(async (req, res, next) => {
  const clients = await Client.find();

  res.status(201).json({
    success: true,
    data: clients,
  });
});

// @desc   Create new Client
// @route  POST /api/v1/Client
// @access admin

exports.createClient = asyncHandler(async (req, res, next) => {
  const client = await Client.create(req.body);

  res.status(201).json({
    success: true,
    data: client,
  });
});

// @desc   Get a single Client
// @route  GET /api/v1/Client/:id
// @access admin

exports.getClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(
      new ErrorResponse('Client not found with id of ' + req.params.id, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: client,
  });
});
// @desc   Update Client
// @route  PUT /api/v1/Client/:id
// @access admin

exports.updateClient = asyncHandler(async (req, res, next) => {
  let client = await Client.findById(req.params.id);

  if (!client) {
    return next(
      new ErrorResponse('Client not found with id of ' + req.params.id, 404)
    );
  }

  await Client.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    success: true,
  });
});

// @desc   Delete Client
// @route  Delete /api/v1/Client/:id
// @access admin

exports.deleteClient = asyncHandler(async (req, res, next) => {
  let client = await Client.deleteOne({ _id: req.params.id });

  if (!client) {
    return next(
      new ErrorResponse('Client not found with id of ' + req.params.id, 404)
    );
  }

  Client.deleteOne(client);

  res.status(200).json({
    success: true,
    data: {},
  });
});
