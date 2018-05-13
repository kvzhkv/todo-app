
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