var express = require('express');
var Recipe = require('../database/model/recipe');
var router = express.Router();
var fs = require("fs");
var createError = require('http-errors');
var multer = require('multer');


upload = multer({ dest: './public/images' });

/* GET view list form. */
router.get('/', function (req, res, next) {
  Recipe.find().exec(
    (error, recipe) => {
      if (error || !recipe) {
        res.send('Błąd odczytu bazy danych');
      } else {
        //console.log(post);
        res.render('recipes', { title: "Lista przepisów", recipes: recipe, user: req.user })
      }
    }
  )
});

/* GET add form. */
router.get('/add', function (req, res, next) {
  if (req.user != null)
    res.render('add', { title: 'Dodaj przepis', bform: true, user: req.user });
  else
    res.redirect("/")
});

/* POST add */
router.post('/add', upload.single('picture'), function (req, res) {
  Recipe.create({
    owner: req.user,
    name: req.body.name,
    kind: req.body.kind,
    ingredients: req.body.ingredients,
    preparation: req.body.preparation,
    picture_name: req.file.originalname,
    picture_type: req.file.mimetype,
    picture_size: req.file.size,
    picture_data: fs.readFileSync(req.file.path)
  }, (error) => {
    if (error) {
      console.log(error);
    }
    else
      res.redirect("/recipes");
  });
})

/* GET picture saved in mongoDB */
router.get('/photo/:id', (req, res) => {

  console.log("ID" + req.params.id)
  Recipe.findOne(
    {
      _id: req.params.id
    }, (err, result) => {

      if (err || !result) return console.log(err)
      res.contentType(result.picture_type);
      res.send(result.picture_data);
    })
})

/* GET delete recipe form. */
router.get('/delete/:id', function (req, res, next) {
  Recipe.findOneAndRemove({
    _id: req.params.id
  }, (error, user) => {
    if (error || !user) {
      console.log(req.params.id)
      next(createError(404, 'Nie znaleziono strony'))
    } else {
      res.redirect('/recipes')
    }
  })
})

/* GET edit form. */
router.get('/edit/:id', function (req, res, next) {
  Recipe.findOne({
    _id: req.params.id
  }, (error, recipe) => {
    if (req.user == recipe.owner) {
      res.render('edit', {
        title: "Edytuj przepis",
        name: recipe.name,
        kind: recipe.kind,
        ingredients: recipe.ingredients,
        preparation: recipe.preparation,
        id: recipe._id,
        bform: true,
        user: req.user
      })
    }
    else {
      console.log("Brak uprawnień")
      res.redirect('/recipes')
    }
  })
})

/* POST edit form. */
router.post('/edit/:id', function (req, res, next) {
  Recipe.findOneAndUpdate({
    _id: req.params.id
  }, {
    name: req.body.name,
    kind: req.body.kind,
    ingredients: req.body.ingredients,
    preparation: req.body.preparation,
    user: req.user
  }, (error, result) => {
    if (error) {
      console.log(error)
    } else {
      res.redirect("/recipes");
    }
  })
})

module.exports = router;