let {
  admin,
  admin2,
  user1,
  user2,
  adminTodos,
  user1Todos,
  user2Todos,
  chai,
  mongoose,
  app,
  expect,
  adminAgent,
  user1Agent,
  user2Agent
} = require('./test-data');

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

  it('should patch another todo complete field and set completedAt', (done) => {
    user1Agent
      .patch('/api/v1/todos/' + user1Todos[1]._id)
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