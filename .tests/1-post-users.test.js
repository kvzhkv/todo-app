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