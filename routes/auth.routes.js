const express = require('express');
const router = express.Router();
const validator = require('validator');

const {
  User
} = require('../helpers/models');
const {
  authorize,
  verifyPassword
} = require('../helpers/auth');


// login user
router.post('/', function (req, res) {

  if (validator.isEmail(req.body.email)) {

    User.findOne({
      'email': req.body.email
    }).then(user => {
      if (!user) {
        return res.status(401).send({
          error: 'Unauthorized',
          message: 'Email or password is incorrect.'
        });
      }
      if (verifyPassword(req.body.password, user.password)) {
        req.session.email = req.body.email;
        req.session.userId = user._id;
        req.session.userType = user.type === 'admin' ? 'admin' : 'user';
        res.send({
          ok: true,
          message: 'Hello, you are logged in.'
        });
      } else {
        res.status(401).send({
          error: 'Unauthorized',
          message: 'Email or password is incorrect.'
        });
      }
    }).catch(err => {
      res.status(500).send({
        error: 'Internal server error',
        message: err.message || err.errmsg || 'Server error occured.'
      });
    });

  } else {
    res.status(401).send({
      error: 'Unauthorized',
      message: 'Email or password is incorrect.'
    });
  }

});

// logout user
router.delete('/', authorize, function (req, res) {
  req.session.destroy(function () {
    res.clearCookie(process.env.COOKIE_NAME);
    res.status(200).send({
      ok: true,
      message: 'You are logged out.'
    });
  });
});

module.exports = router;