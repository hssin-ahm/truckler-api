const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Cost = require('../models/Cost');

// @desc   Get all truck Cost
// @route  GET /api/v1/cost/:truckId
// @access admin
exports.getCosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get total price
// @route  GET /api/v1/cost/:truckId/total
// @access admin
exports.getTotalprice = asyncHandler(async (req, res, next) => {
  let costs = await Cost.find({ truck: req.params.truckId });
  let price_total = 0;

  costs.forEach((data) => {
    price_total += data?.price_total;
  });

  res.status(200).json(price_total);
});

// @desc   Get all Cost
// @route  GET /api/v1/cost/all
// @access admin
exports.getAllCosts = asyncHandler(async (req, res, next) => {
  const option = req.query.option;
  var datee = new Date();
  var day = '' + datee.getDate();
  var month = '' + (datee.getMonth() + 1); //months from 1-12
  var year = '' + datee.getFullYear();
  if (day.length == 1) {
    day = '0' + day;
  }
  if (month.length == 1) {
    month = '0' + month;
  }
  var filterDate = '';
  switch (option) {
    case 'week':
      minusWeek = datee.setDate(datee.getDate() - 7);

      filterDate = new Date(minusWeek);
      break;
    case 'year':
      filterDate = year + '-' + 01 + '-' + 01;
      break;

    default:
      filterDate = year + '-' + month + '-' + '01';
      break;
  }

  const costs = await Cost.find({
    date: {
      $gte: filterDate,
    },
  })
    .select('price_total date')
    .sort({ date: -1 });
  res.status(201).json({
    // total: costs.length,
    data: costs,
  });
});
