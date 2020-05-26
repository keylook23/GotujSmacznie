var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('readrecipe', { title: 'Odczytaj przepis' });
});

module.exports = router;