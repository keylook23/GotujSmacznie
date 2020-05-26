var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('addrecipe', { title: 'Dodaj przepis' });
});

module.exports = router;



