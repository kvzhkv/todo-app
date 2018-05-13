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