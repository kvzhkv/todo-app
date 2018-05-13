const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const app = require('../app');

chai.use(chaiHttp);

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
    task: 'Go shopping',
    deadline: '2018-05-14'
  },
  {
    task: 'Send resume',
    deadline: '2018-05-15'
  },
  {
    task: 'Create wish-list',
    deadline: '2018-05-16'
  },
  {
    task: 'Send message to a friend',
    deadline: '2018-05-17'
  },
  {
    task: 'Send a postcard',
    deadline: '2018-05-18'
  }
];

let user1Todos = [{
    task: 'Go shopping',
    deadline: '2018-05-14'
  },
  {
    task: 'Send resume',
    deadline: '2018-05-15'
  },
  {
    task: 'Create wish-list',
    deadline: '2018-05-16'
  },
  {
    task: 'Send message to a friend',
    deadline: '2018-05-17'
  },
  {
    task: 'Send a postcard',
    deadline: '2018-04-20'
  },
  {
    task: 'Go shopping',
    deadline: '2018-05-25'
  },
  {
    task: 'Send resume',
    deadline: '2018-05-15'
  },
  {
    task: 'Create wish-list',
    deadline: '2018-06-29'
  },
  {
    task: 'Send message to a friend',
    deadline: '2018-05-18'
  },
  {
    task: 'Send a postcard',
    deadline: '2018-04-20'
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
    deadline: '2018-05-16'
  },
  {
    task: 'user2-task3',
    deadline: '2018-05-17'
  },
  {
    task: 'user2-task4',
    deadline: '2018-04-20'
  },
  {
    task: 'user2-task5',
    deadline: '2018-05-25'
  },
  {
    task: 'user2-task6',
    deadline: '2018-05-15'
  },
  {
    task: 'user2-task7',
    deadline: '2018-06-29'
  },
  {
    task: 'user2-task8',
    deadline: '2018-05-18'
  },
  {
    task: 'user2-task9',
    deadline: '2018-04-20'
  }
];

// for(let i = 0; i < 10; i++) {
//   adminTodos.push({
//     task: 'task' + i,
//     deadline: new Date()
//   })
// }

const adminAgent = chai.request.agent(app);
const user1Agent = chai.request.agent(app);
const user2Agent = chai.request.agent(app);


describe('POST /api/v1/users', () => {

  before(() => {
    mongoose.connection.dropDatabase();
  })

  it('should register admin', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send(admin)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.email).to.be.equal(admin.email);
        expect(res.body.message).to.exist;
        done();
      });
  });

  it('should not register another admin', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send(admin2)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(403);
        expect(res.body.error).to.exist;
        expect(res.body.message).to.exist;
        done();
      })
  })

  it('should register user1', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send(user1)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.email).to.be.equal(user1.email);
        expect(res.body.message).to.exist;
        done();
      });
  });

  it('should register user2', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send(user2)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.email).to.be.equal(user2.email);
        expect(res.body.message).to.exist;
        done();
      });
  });

  it('should not register user with same email', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send(user1)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.exist;
        expect(res.body.message).to.exist;
        done();
      });
  });

});

describe('POST /api/v1/session', () => {

  it('should not log in with wrong email', (done) => {
    chai.request(app)
      .post('/api/v1/session')
      .send({
        email: admin.email + 's',
        password: admin.password
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('Unauthorized');
        expect(res.body.message).to.exist;
        done();
      });
  })

  it('should not log in with wrong password', (done) => {
    chai.request(app)
      .post('/api/v1/session')
      .send({
        email: user1.email,
        password: user1.password + '1234'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('Unauthorized');
        expect(res.body.message).to.exist;
        done();
      });
  })

  it('should log in admin', (done) => {
    adminAgent
      .post('/api/v1/session')
      .send({
        email: admin.email,
        password: admin.password
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.exist;
        done();
      });
  })

  it('should log in user1', (done) => {
    user1Agent
      .post('/api/v1/session')
      .send(user1)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.exist;
        done();
      });
  })

  it('should log in user2', (done) => {
    user2Agent
      .post('/api/v1/session')
      .send(user2)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.exist;
        done();
      });
  })

});

describe('GET /api/v1/users', () => {

  it('should give info about all registered users to admin', (done) => {
    adminAgent
      .get('/api/v1/users')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.users).to.be.an('array').lengthOf(3);
        res.body.users.forEach(user => {
          if (user.email === user1.email) {
            user1._id = user._id;
          }
          if (user.email === user2.email) {
            user2._id = user._id;
          }
          if (user.email === admin.email) {
            admin._id = user._id;
          }
        });
        done();
      });
  });

  it('should give info about user1 to user1', (done) => {
    user1Agent
      .get('/api/v1/users')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.user.email).to.equal(user1.email);
        expect(res.body.user.type).to.equal('user');
        done();
      });
  });

  it('should not give any info to unauthorized user', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('Unauthorized');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

});

describe('POST /api/v1/todos', () => {

  it('should create new todo for user1', (done) => {
    user1Agent
      .post('/api/v1/todos')
      .send(user1Todos[0])
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.a('string');
        expect(res.body._id).to.exist;
        user1Todos[0]._id = res.body._id;
        done();
      });
  });

  it('should create new todo for user2', (done) => {
    user2Agent
      .post('/api/v1/todos')
      .send(user2Todos[0])
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.a('string');
        expect(res.body._id).to.exist;
        user2Todos[0]._id = res.body._id;
        done();
      });
  });

  it('should not create new todo with invalid deadline Date format', (done) => {
    user1Agent
      .post('/api/v1/todos')
      .send({
        task: 'some task',
        deadline: '21.05.2018'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad request')
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should not create new todo without deadline field', (done) => {
    user1Agent
      .post('/api/v1/todos')
      .send({
        task: 'some task'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad request')
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should not create new todo without task field', (done) => {
    user1Agent
      .post('/api/v1/todos')
      .send({
        task: '',
        deadline: '2018-05-23'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad request')
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should not create new todo with empty request', (done) => {
    user1Agent
      .post('/api/v1/todos')
      .send({})
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('Bad request')
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should not create new todo from unauthorized user', (done) => {
    chai.request(app)
      .post('/api/v1/todos')
      .send({})
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('Unauthorized')
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should populate db with 10 todos of user1');

  it('should populate db with 10 todos of user2');

  it('should populate db with 10 todos of admin');

});

describe('GET /api/v1/todos/:id', () => {

  it('should get one todo for user1 by given id', (done) => {
    user1Agent
      .get('/api/v1/todos/' + user1Todos[0]._id)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.todo).to.be.an('object');
        expect(res.body.todo._id).to.be.equal(user1Todos[0]._id);
        expect(res.body.todo.task).to.be.equal(user1Todos[0].task);
        done();
      });
  });

  it('should not get todo created by user1 for user2', (done) => {
    user2Agent
      .get('/api/v1/todos/' + user1Todos[0]._id)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(404);
        expect(res.body.error).to.be.equal('Not found');
        expect(res.body.message).to.be.equal('Todo not found.');
        done();
      });
  });

  it('should get any todo for admin', (done) => {
    adminAgent
      .get('/api/v1/todos/' + user2Todos[0]._id)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.todo).to.be.an('object');
        expect(res.body.todo._id).to.be.equal(user2Todos[0]._id);
        expect(res.body.todo.task).to.be.equal(user2Todos[0].task);
        done();
      });
  });

  it('should not get todo with invalid id', (done) => {
    user1Agent
      .get('/api/v1/todos/' + user1Todos[0]._id + '23')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.equal('Bad request');
        expect(res.body.message).to.be.equal('Invalid ID.');
        done();
      });
  });

});

describe('PATCH /api/v1/todos/:id', () => {

  it('should patch todo complete field and set completedAt', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        completed: true
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.equal('Todo updated.');
        expect(res.body.todo.completed).to.be.true;
        expect(res.body.todo.completedAt).to.be.a('string');
        done();
      });
  });

  it('should patch completed todo and set it uncomplete, set completedAt as null', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        completed: false
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.equal('Todo updated.');
        expect(res.body.todo.completed).to.be.false;
        expect(res.body.todo.completedAt).to.be.a('null');
        done();
      });
  });

  it('should patch todo priority and task', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        priority: 2,
        task: 'New task'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.equal('Todo updated.');
        expect(res.body.todo.priority).to.be.equal(2);
        expect(res.body.todo.task).to.be.equal('New task');
        done();
      });
  });

  it('should patch todo task and deadline', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        deadline: '2018-08-20',
        task: 'New task again'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.equal('Todo updated.');
        expect(res.body.todo.deadline).to.be.equal('2018-08-20T00:00:00.000Z');
        expect(res.body.todo.task).to.be.equal('New task again');
        done();
      });
  });

  it('should not patch todo created by another user', (done) => {
    user2Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        deadline: '2018-08-20',
        task: 'New task again'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(404);
        expect(res.body.error).to.be.equal('Not found');
        expect(res.body.message).to.be.equal('Todo not found.');
        done();
      });
  });

  it('should patch any todo by admin', (done) => {
    adminAgent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        deadline: '2018-04-20',
        task: 'Patched by admin!'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.equal('Todo updated.');
        expect(res.body.todo.deadline).to.be.equal('2018-04-20T00:00:00.000Z');
        expect(res.body.todo.task).to.be.equal('Patched by admin!');
        done();
      });
  });

  it('should not patch todo with invalid deadline field', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        deadline: '123'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.equal('Bad request');
        expect(res.body.message).to.be.equal('Invalid date format for deadline field.');
        done();
      });
  });

  it('should not patch todo with invalid priority field', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        priority: '123'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.equal('Bad request');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should not patch todo with invalid task field', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        task: ''
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.equal('Bad request');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should not patch todo with invalid completed field', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id)
      .send({
        completed: 123
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.equal('Bad request');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should not patch todo by invalid id', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[0]._id + '123')
      .send({
        completed: true
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.equal('Bad request');
        expect(res.body.message).to.be.equal('Invalid ID.');
        done();
      });
  });

});

describe('GET /api/v1/todos', () => {

  it('should get all todos created by user1');

  it('should get all todos created by user2');

  it('should get all todos for admin');


});

describe('DELETE /api/v1/todos/:id', () => {

  it('should delete todo by user1 created by user1', (done) => {
    user1Agent
      .delete('/api/v1/todos/' + user1Todos[0]._id)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.equal('Todo is deleted.');
        expect(res.body._id).to.be.equal(user1Todos[0]._id);
        done();
      });
  });

  it('should not delete todo created by another user', (done) => {
    user1Agent
      .delete('/api/v1/todos/' + user2Todos[0]._id)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(404);
        expect(res.body.error).to.be.equal('Not found');
        expect(res.body.message).to.be.equal('Todo not found.');
        done();
      });
  });

  it('should not delete any todo by unuathorized user', (done) => {
    chai.request(app)
      .delete('/api/v1/todos/' + user2Todos[0]._id)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.body.error).to.be.equal('Unauthorized');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should delete any todo by admin', (done) => {
    adminAgent
      .delete('/api/v1/todos/' + user2Todos[0]._id)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.equal('Todo is deleted.');
        expect(res.body._id).to.be.equal(user2Todos[0]._id);
        done();
      });
  });

  it('should not delete any todo by given invalid id', (done) => {
    user1Agent
      .delete('/api/v1/todos/' + '12345dssv')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.error).to.be.equal('Bad request');
        expect(res.body.message).to.be.equal('Invalid ID.');
        done();
      });
  });

  it('should not delete any todo with empty id', (done) => {
    adminAgent
      .delete('/api/v1/todos/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(404);
        expect(res.body.error).to.be.equal('Not found');
        done();
      });
  });

});

describe('DELETE /api/v1/session', () => {

  it('should log out user1', (done) => {
    user1Agent
      .delete('/api/v1/session')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should log out user2', (done) => {
    user2Agent
      .delete('/api/v1/session')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should log out admin', (done) => {
    adminAgent
      .delete('/api/v1/session')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.ok).to.be.true;
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

});