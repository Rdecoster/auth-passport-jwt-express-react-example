const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/utils');

// test route for debuging
router.get('/check', (req, res) => {
  console.log('hit');
  res.status(200).send();
});
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    //at this point passport has already authenticated the JWT look at the passport JS files for the configs
    // here we can add extra steps or middleware to preform other task after it has been authenticated.

    //    console.log(req.headers.authorization," Auth header")
    //    const token = req.headers.authorization
    //    console.log(token,"my token)
    console.log(' your token has been authenticated ');
    //sending a status 200 back to client. If the route is not authenticated passport will automatically send a 400 status.
    res.status(200).json({
      success: true,
      msg: 'You are successfully authenticated to this route!',
    });
  }
);

// Validate an existing user and issue a JWT
router.post('/login', function (req, res, next) {
  // searches to see if the user id grabbed from the post request body from client.
  User.findOne({ username: req.body.username })

    .then((user) => {
      console.log(user, 'returned obkect from the User.findOne');
      if (!user) {
        console.log('could not find user!!!');
        return res
          .status(401)
          .json({ success: false, msg: 'could not find user' });
      }

      // Function defined at bottom of app.js
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        console.log(tokenObject);
        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expiresIn,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: 'you entered the wrong password' });
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Register a new user
router.post('/register', function (req, res, next) {
  console.log(req.body, ' my login Register');
  const saltHash = utils.genPassword(req.body.regPass);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.regName,
    hash: hash,
    salt: salt,
  });

  try {
    newUser.save().then((user) => {
      res.json({ success: true, user: user });
    });
  } catch (err) {
    res.json({ success: false, msg: err });
  }
});

module.exports = router;
