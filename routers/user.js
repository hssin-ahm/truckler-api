const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAllDrivers,
  userPhotoUpload,
  updateloggeduser,
  changePassword,
} = require('../controllers/user');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/changepassword').put(protect, changePassword);
router.route('/').get(advancedResults(User), getUsers).post(createUser);
router.route('/drivers').get(protect, authorize('admin'), getAllDrivers);
router.route('/:id/photo').post(protect, userPhotoUpload);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/updateloggeduser/:id').put(updateloggeduser);

module.exports = router;
