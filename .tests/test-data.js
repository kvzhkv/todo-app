const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const app = require('../app');

chai.use(chaiHttp);

const adminAgent = chai.request.agent(app);
const user1Agent = chai.request.agent(app);
const user2Agent = chai.request.agent(app);

let admin = {
  email: 'admin@admin.com',
  password: '123456',
  type: 'admin'
}

let admin2 = {
  email: 'admin2@admin.com',
  password: '123456',
  type: 'admin'
}

let user1 = {
  email: 'user1@user.com',
  password: '123456'
}

let user2 = {
  email: 'user2@user.com',
  password: '123456'
}

let adminTodos = [{
    task: 'admin-task0',
    deadline: '2018-05-14'
  },
  {
    task: 'admin-task1',
    deadline: '2018-05-15'
  },
  {
    task: 'admin-task2',
    deadline: '2018-05-16',
    priority: 1
  },
  {
    task: 'admin-task3',
    deadline: '2018-05-17',
    priority: 2
  },
  {
    task: 'admin-task4',
    deadline: '2018-05-18',
    priority: 3
  }
];

let user1Todos = [{
    task: 'user1-task0',
    deadline: '2018-05-14'
  },
  {
    task: 'user1-task1',
    deadline: '2018-05-15'
  },
  {
    task: 'user1-task2',
    deadline: '2018-05-16',
    priority: 1
  },
  {
    task: 'user1-task3',
    deadline: '2018-05-17',
    priority: 2
  },
  {
    task: 'user1-task4',
    deadline: '2018-05-18',
    priority: 3
  }
];

let user2Todos = [{
    task: 'user2-task0',
    deadline: '2018-05-14'
  },
  {
    task: 'user2-task1',
    deadline: '2018-05-15'
  },
  {
    task: 'user2-task2',
    deadline: '2018-05-16',
    priority: 1
  },
  {
    task: 'user2-task3',
    deadline: '2018-05-17',
    priority: 2
  },
  {
    task: 'user2-task4',
    deadline: '2018-05-18',
    priority: 3
  }
];

module.exports = {
  chai,
  user1Agent,
  user2Agent,
  adminAgent,
  expect,
  app,
  admin,
  admin2,
  user1,
  user2,
  mongoose,
  adminTodos,
  user1Todos,
  user2Todos
}