
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