const express = require('express');
const router = express.Router();
const _ = require('lodash');
const validator = require('validator');
const {
  ObjectID
} = require('mongodb');

const {
  authorize
} = require('../../helpers/auth');
const {
  Todo
} = require('../../helpers/models');

// Get todos
router.get('/', authorize, function (req, res) {

  let period = {};
  let query = {};
  let sort = 'deadline';

  if (req.query.startdate) {
    if (validator.isISO8601(req.query.startdate)) {
      period.$gte = req.query.startdate;
    } else {
      return res.status(400).send({
        error: 'Bad request',
        message: 'Invalid startdate value in query.'
      });
    }
  }

  if (req.query.enddate) {
    if (validator.isISO8601(req.query.enddate)) {
      period.$lte = req.query.enddate;
    } else {
      return res.status(400).send({
        error: 'Bad request',
        message: 'Invalid enddate value in query.'
      });
    }
  }

  if (period.$gte || period.$lte) {
    query.deadline = period;
  }

  if (req.query.completed) {
    if (_.indexOf(['true', 'false'], req.query.completed) >= 0) {
      query.completed = req.query.completed;
    } else {
      return res.status(400).send({
        error: 'Bad request',
        message: 'Invalid completed value in query.'
      });
    }
  }

  if (req.query.priority) {
    if (_.indexOf(['0', '1', '2', '3'], req.query.priority) >= 0) {
      query.priority = req.query.priority;
    } else {
      return res.status(400).send({
        error: 'Bad request',
        message: 'Invalid priority value in query.'
      });
    }
  }

  if (req.query.sort) {
    if (_.indexOf(['deadline', '-deadline', 'priority', '-priority', 'completed', '-completed'], req.query.sort) >= 0) {
      sort = req.query.sort;
    } else {
      return res.status(400).send({
        error: 'Bad request',
        message: 'Invalid sort value in query.'
      });
    }
  }

  let projection = 'task deadline priority completed completedAt _userId';

  if (req.session.userType === 'user') {
    query._userId = req.session.userId;
    projection = 'task deadline priority completed completedAt';
  }

  Todo.find(query, projection).sort(sort).then(todos => {
    res.send({
      todos
    });
  }).catch(err => {
    res.status(500).send({
      error: 'Internal server error',
      message: err.message || err.errmsg || 'Server error occured.'
    });
  });

});

// Get todo by Id
router.get('/:id', authorize, function (req, res) {

  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send({
      error: 'Bad request',
      message: 'Invalid ID.'
    });
  }

  let query = {
    _id: req.params.id
  };

  let projection = 'task deadline priority completed completedAt _userId';

  if (req.session.userType === 'user') {
    query._userId = req.session.userId;
    projection = 'task deadline priority completed completedAt';
  }

  Todo.findOne(query, projection).then(todo => {
    if (!todo) {
      return res.status(404).send({
        error: 'Not found',
        message: 'Todo not found.'
      });
    }
    res.send({
      todo
    });
  }).catch(err => {
    res.status(500).send({
      error: 'Internal server error',
      message: err.message || err.errmsg || 'Server error occured.'
    });
  });


});

// Create new todo
router.post('/', authorize, function (req, res) {

  let body = _.pick(req.body, ['task', 'priority', 'deadline']);

  if (!body.deadline || !validator.isISO8601(body.deadline)) {
    return res.status(400).send({
      error: 'Bad request',
      message: 'Invalid date format for deadline field.'
    });
  }

  body._userId = req.session.userId;

  body.deadline = validator.toDate(body.deadline);

  const todo = new Todo(body);

  todo.save().then(todo => {
    res.send({
      ok: true,
      message: 'New todo is saved',
      _id: todo._id
    });
  }).catch(err => {
    res.status(400).send({
      error: 'Bad request',
      message: err.message || err.errmsg || 'Invalid request.'
    });
  });

});

// Update todo
router.patch('/:id', authorize, function (req, res) {

  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send({
      error: 'Bad request',
      message: 'Invalid ID.'
    });
  }

  let query = {
    _id: req.params.id
  };

  if (req.session.userType === 'user') {
    query._userId = req.session.userId;
  }

  let body = _.pick(req.body, ['task', 'completed', 'deadline', 'priority']);

  if (body.deadline && (!_.isString(body.deadline) || !validator.isISO8601(body.deadline))) {
    return res.status(400).send({
      error: 'Bad request',
      message: 'Invalid date format for deadline field.'
    });
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date();
  } else if (_.isBoolean(body.completed) && !body.completed) {
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(query, {
    $set: body
  }, {
    new: true,
    runValidators: true
  }).then(todo => {
    if (!todo) {
      return res.status(404).send({
        error: 'Not found',
        message: 'Todo not found.'
      });
    }
    res.send({
      ok: true,
      message: 'Todo updated.',
      todo
    });
  }).catch(err => {
    res.status(400).send({
      error: 'Bad request',
      message: err.message || err.errmsg || 'Invalid request data.'
    });
  });

});

// Delete todo
router.delete('/:id', authorize, function (req, res) {

  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send({
      error: 'Bad request',
      message: 'Invalid ID.'
    });
  }

  let query = {
    _id: req.params.id
  };

  if (req.session.userType === 'user') {
    query._userId = req.session.userId;
  }

  Todo.findOneAndRemove(query).then(todo => {
    if (!todo) {
      return res.status(404).send({
        error: 'Not found',
        message: 'Todo not found.'
      });
    }
    res.send({
      ok: true,
      message: 'Todo is deleted.',
      _id: todo._id
    });
  }).catch(err => {
    res.status(400).send(err);
  });

});

module.exports = router;