const express = require('express');

const {
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  getuserrole,
  verifresetpasswordtoken,
} = require('../controllers/auth');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotPassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/verifresetpasswordtoken/:resettoken', verifresetpasswordtoken);
router.get('/getuserrole', protect, getuserrole);

module.exports = router;
