var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var log=false;
  if(req.user!=null){log=true; }
  res.render('index', { title: 'Strona główna', login:  log, user: req.user});
});

module.exports = router;
