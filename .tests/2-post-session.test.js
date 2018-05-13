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
