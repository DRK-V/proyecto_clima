const express = require('express');
const { registerUser, loginUser, checkEmail, requestPasswordReset, handleResetLink, resetPassword } = require('../controllers/datacontroller');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/checkEmail', checkEmail);
router.post('/reques',  requestPasswordReset);
router.get('/link', handleResetLink);
router.post('/resetPassword', resetPassword);
module.exports = router;
