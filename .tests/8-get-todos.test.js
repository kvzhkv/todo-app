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

describe('GET /api/v1/todos', () => {

  it('should get all todos created by user1', (done) => {
    user1Agent
      .get('/api/v1/todos/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.todos).to.be.an('array').lengthOf(5);
        done();
      });
  });

  it('should get all todos created by user2', (done) => {
    user2Agent
      .get('/api/v1/todos/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.todos).to.be.an('array').lengthOf(5);
        done();
      });
  });

  it('should get all todos for admin', (done) => {
    adminAgent
      .get('/api/v1/todos/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.todos).to.be.an('array').lengthOf(15);
        done();
      });
  });

  it('should get all todos with priority 3 for admin', (done) => {
    adminAgent
      .get('/api/v1/todos?priority=3')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.todos).to.be.an('array').lengthOf(3);
        done();
      });
  });

  it('should get all todos with completed set to true', (done) => {
    adminAgent
      .get('/api/v1/todos?completed=true')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.todos).to.be.an('array').lengthOf(1);
        done();
      });
  });

  it('should get all todos with completed set to false', (done) => {
    adminAgent
      .get('/api/v1/todos?completed=false')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.todos).to.be.an('array').lengthOf(14);
        done();
      });
  });

  it('should get all todos with deadline from 2018-05-15 to 2018-05-17', (done) => {
    adminAgent
      .get('/api/v1/todos?startdate=2018-05-15&enddate=2018-05-17')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.todos).to.be.an('array').lengthOf(9);
        done();
      });
  });

});