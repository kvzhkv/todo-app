
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

  it('should populate db with 5 todos of user1', (done) => {
    user1Todos.forEach((todo, index) => {
      user1Agent
        .post('/api/v1/todos')
        .send(todo)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.ok).to.be.true;
          expect(res.body.message).to.be.a('string');
          expect(res.body._id).to.exist;
          user1Todos[index]._id = res.body._id;
        });
    });
    done();
  });

  it('should populate db with 5 todos of user2', (done) => {
    user2Todos.forEach((todo, index) => {
      user2Agent
        .post('/api/v1/todos')
        .send(todo)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.ok).to.be.true;
          expect(res.body.message).to.be.a('string');
          expect(res.body._id).to.exist;
          user2Todos[index]._id = res.body._id;
        });
    });
    done();
  });

  it('should populate db with 5 todos of admin', (done) => {
    adminTodos.forEach((todo, index) => {
      adminAgent
        .post('/api/v1/todos')
        .send(todo)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.equal(200);
          expect(res.body.ok).to.be.true;
          expect(res.body.message).to.be.a('string');
          expect(res.body._id).to.exist;
          adminTodos[index]._id = res.body._id;
        });
    });
    done();
  });

});