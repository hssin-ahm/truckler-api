const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'or'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)/g, (match) => `$${match}`);

  // Finding resource
  if (req.query.searchfieldname && !req.params.truckId) {
    const name = req.query.searchfieldname;
    const value = req.query.value;
    query = model.find({
      [name]: { $regex: value, $options: '$i' },
      ...JSON.parse(queryStr),
      disable: false,
    });
  } else if (req.query.searchfieldname) {
    const name = req.query.searchfieldname;
    const value = req.query.value;
    query = model.find({
      [name]: { $regex: value, $options: '$i' },
      disable: false,
      ...JSON.parse(queryStr),
      truck: req.params.truckId,
    });
  } else if (req.params.truckId) {
    query = model.find({
      ...JSON.parse(queryStr),
      truck: req.params.truckId,
    });
  } else if (req.params.driver_id) {
    query = model.find({
      driver: req.params.driver_id,
    });
  } else {
    query = model.find({ ...JSON.parse(queryStr), disable: false });
  }
  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let total;
  if (req.query.searchfieldname && !req.params.truckId) {
    const name = req.query.searchfieldname;
    const value = req.query.value;

    total = await model.countDocuments({
      [name]: { $regex: value, $options: '$i' },
    });
  } else if (req.query.searchfieldname) {
    const name = req.query.searchfieldname;
    const value = req.query.value;

    total = await model.countDocuments({
      [name]: { $regex: value, $options: '$i' },
      disable: false,
      ...JSON.parse(queryStr),
      truck: req.params.truckId,
    });
  } else if (req.params.truckId) {
    total = await model.countDocuments({ truck: req.params.truckId });
  } else if (req.params.driver_id) {
    total = await model.countDocuments({ driver: req.params.driver_id });
  } else {
    total = await model.countDocuments({
      ...JSON.parse(queryStr),
      disable: false,
    });
  }

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
    if (populate.indexOf('truck') != -1) {
      query.populate({
        path: 'truck',
        populate: {
          path: 'model',
        },
      });
    }
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    total: total,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
