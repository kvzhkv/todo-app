const express = require('express');
const router = express.Router();

const {
  User
} = require('../../helpers/models');

const {
  hashPassword,
  authorize
} = require('../../helpers/auth');

// register new user
router.post('/', function (req, res) {

  let user = new User({
    email: req.body.email,
    password: hashPassword(req.body.password),
    type: req.body.type
  });

  if (req.body.type === 'admin') {

    User.findOne({
      type: 'admin'
    }).then(doc => {
      if (!doc) {
        user.save().then(user => {
          res.send({
            ok: true,
            message: 'Admin user is created.',
            email: user.email
          });
        }).catch(err => {
          res.status(400).send({
            error: 'Bad request',
            message: err.message || err.errmsg || 'User with this email already exists.'
          });
        });
      } else {
        res.status(403).send({
          error: 'Conflict',
          message: 'Admin user already exists.'
        });
      }
    }).catch(err => {
      res.status(500).send({
        error: 'Internal server error',
        message: err.message || err.errmsg || 'Server error occured.'
      });
    });

  } else {

    user.save().then(user => {
      res.send({
        ok: true,
        message: 'New user is created.',
        email: user.email
      });
    }).catch(err => {
      res.status(400).send({
        error: 'Bad request',
        message: err.message || err.errmsg || 'User with this email already exists.'
      });
    });

  }
});

// get list of users
router.get('/', authorize, function (req, res) {

  if (req.session.userType === 'admin') {
    User.find({}, 'email type').then(users => {
      res.send({
        users
      });
    }).catch(err => {
      res.status(500).send({
        error: 'Internal server error',
        message: err.message || err.errmsg || 'Server error occured.'
      });
    });
  } else {
    User.findById(req.session.userId, 'email type').then(user => {
      res.send({
        user
      });
    }).catch(err => {
      res.status(500).send({
        error: 'Internal server error',
        message: err.message || err.errmsg || 'Server error occured.'
      });
    });
  }

});

module.exports = router;