require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

const indexRoutes = require('./routes/index.routes');
const authRoutes = require('./routes/v1/auth.routes');
const todosRoutes = require('./routes/v1/todos.routes');
const usersRoutes = require('./routes/v1/users.routes');

const app = express();

const {
  mongoose
} = require('./helpers/db');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST, PUT, PATCH, DELETE');
  next();
});

app.use(session({
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: parseInt(process.env.COOKIE_MAX_AGE, 10)
  },
  name: process.env.COOKIE_NAME,
  saveUninitialized: false,
  resave: true,
  rolling: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

app.use('/api/v1/session', authRoutes);
app.use('/api/v1/todos', todosRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/', indexRoutes);

// catch unknown route and send error
app.use(function (req, res) {
  res.status(404).send({
    error: 'Not found',
    message: 'Resource not found, unknown route.'
  });
});

module.exports = app;