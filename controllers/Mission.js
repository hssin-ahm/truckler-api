const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Mission = require('../models/Mission');

// @desc   Get all Mission
// @route  GET /api/v1/mission
// @access admin
exports.getMissions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get all Missions without pagination
// @route  GET /api/v1/missions/all
// @access admin
exports.getAllMissions = asyncHandler(async (req, res, next) => {
  const missions = await Mission.find();
  res.status(201).json({
    missions,
  });
});

// @desc   Create new Mission
// @route  POST /api/v1/mission
// @access admin

exports.createMission = asyncHandler(async (req, res, next) => {
  const mission = await Mission.create(req.body);
  res.status(201).json({
    success: true,
    data: mission,
  });
});

// @desc   Get a single Mission
// @route  GET /api/v1/Mission/:id
// @access admin

exports.getMission = asyncHandler(async (req, res, next) => {
  const mission = await Mission.findById(req.params.id);
  if (!mission) {
    return next(
      new ErrorResponse('truck not found with id of ' + req.params.id, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: mission,
  });
});

// @desc   Get a Mission driver
// @route  GET /api/v1/missions/:driver_id/driver
// @access admin

exports.getDriverMission = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get a Mission client
// @route  GET /api/v1/missions/:client_id/client
// @access admin

exports.getClientMission = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Update Mission
// @route  PUT /api/v1/Mission/:id
// @access admin

exports.updateMission = asyncHandler(async (req, res, next) => {
  let mission = await Mission.findById(req.params.id);

  if (!mission) {
    return next(
      new ErrorResponse('Mission not found with id of ' + req.params.id, 404)
    );
  }

  await Mission.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    success: true,
  });
});

// @desc   Filter between two dates
// @route  POST /api/v1/Mission/history
// @access admin

exports.filterbetDate = asyncHandler(async (req, res, next) => {
  let missions = await Mission.find({
    date: {
      $gte: req.body.startDate,
      $lte: req.body.endDate,
    },
  }).populate('truck driver');

  res.status(200).json({
    missions,
  });
});

// @desc   Delete Mission
// @route  Delete /api/v1/Mission/:id
// @access admin

exports.deleteMission = asyncHandler(async (req, res, next) => {
  let mission = await Mission.findById(req.params.id);

  if (!mission) {
    return next(
      new ErrorResponse('Mission not found with id of ' + req.params.id, 404)
    );
  }

  await Mission.findByIdAndUpdate(req.params.id, { status: 'Incomplete' });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc   get Missions Status Data
// @route  GET /api/v1/Missions/status
// @access admin

exports.getMissionStatusData = asyncHandler(async (req, res, next) => {
  let totalCompleteMission = await Mission.countDocuments({
    status: 'Complete',
    disable: false,
  });
  let totalIncompleteMission = await Mission.countDocuments({
    status: 'Incomplete',
    disable: false,
  });
  let totalInprogressMission = await Mission.countDocuments({
    status: 'In progress',
    disable: false,
  });

  res.status(200).json({
    totalCompleteMission,
    totalIncompleteMission,
    totalInprogressMission,
  });
});
