const validator = require('validator');
const { mongoose } = require('./db');

const TodoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true,
    minLength: 1
  },
  completed: {
    type: Boolean,
    default: false,
    index: true
  },
  completedAt: {
    type: Date,
    default: null
  },
  deadline: {
    type: Date,
    required: true,
    index: true
  },
  _userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 3,
    index: true
  }
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not valid email!!'
    }
  },
  type: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    unique: false
  },
  password: {
    required: true,
    type: Object
  }
});

const Todo = mongoose.model('Todo', TodoSchema);

const User = mongoose.model('User', UserSchema);

module.exports = {
  Todo,
  User
};