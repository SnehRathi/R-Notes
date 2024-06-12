const express = require('express');
const { signup, login, getUserProfile,logout } = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', auth, getUserProfile);

router.post('/logout', logout);

module.exports = router;