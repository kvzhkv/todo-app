var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send({
    ok: true,
    message: 'Welcome to Todo App API',
    version: '1.0.0'
  });
});

module.exports = router;
