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