var express = require('express');
var Recipe = require('../database/model/recipe');
var router = express.Router();


/* GET recipe list */
router.get('/', function (req, res, next) {
  Recipe.find().exec(
    (error, recipe) => {
      if (error || !recipe) {
        res.send('Błąd odczytu bazy danych');
      } else {
        console.log(recipe);
        res.render('recipe', { title: "Przepisy", recipes: recipe })
      }
    }
  )
});

/* GET addrecipe form. */
router.get('/add', function (req, res, next) {
    res.render('add', { title: 'Dodaj Przepis', bform: true });
  });
  
  /* POST addrecipe form. */
  router.post('/add', function (req, res, next) {
  
    Recipe.create({
      name: req.body.name,
      kind: req.body.kind,
      ingredients: req.body.ingredients,
      preparation: req.body.preparation,
      picture: req.body.preparation,
    }, (error, result) => {
      if (error) {
        console.log(error);
        res.send(error.name + ': ' + error.errmsg);
      }
      else
        res.redirect("/recipe");
        });
    })

    module.exports = router;