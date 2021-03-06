// get router
const express = require('express');
const router = express.Router();

// get user functions
const userService = require('../services/userService');

// get package for cookie token
const jwt = require('jsonwebtoken');

// to get variables from .env file
require('dotenv').config();

// server-side validation
const { body, validationResult } = require('express-validator');

// view login/home page
router.get('/', (req, res) => {
  try {
    let cookie = res.req.headers.cookie;

    // if cookie doesn't exist then show login page
    if (!cookie) {
      return res.render('index')
    } else if (cookie === 'token=') {
      return res.render('index')
    }
    // otherwise go straight to quizzes page
    return res.redirect('/quizzes')
  } catch(err) {
    console.error(err)
  }
})

router.post(
  '/',
  [
    body('username')
    .not().isEmpty().withMessage('Username cannot be empty.')
    .isLength({ max: 45 }).withMessage('Username cannot be longer than 45 characters.'),
    body('password')
    .not().isEmpty().withMessage('Password cannot be empty.')
  ],
  async (req, res, next) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      // validate login details entered
      const user = await userService.validateLogin(req.body);

      // if no user is found or password is entered wrong then show error message
      if (user == false) {
        res.render('error', { message: 'Username or password not recognised', error: {title: 'User not recognised', message: ''} });
        return;
      }
      
      // token contains username and role
      const token = jwt.sign({ 
        user: {
          username: user.username,
          role: user.role
        }
      },
      process.env.AUTH_SECRET);
      
      // set cookie and redirect
      res.cookie('token', token);
      res.redirect('/quizzes');
    } catch(err) {
      console.error(err);
    }
})

// logout
router.get('/logout', (req, res) => {
  try {
    // set new empty cookie to expire straight away and redirect
    res.cookie('token', '', { expiresIn: '1ms' });
    res.redirect('/');
  } catch(err) {
    console.error(err)
  }
})

// export router
module.exports = router;
