var express = require('express');
var Recipe = require('../database/model/recipe');
var router = express.Router();
var fs = require("fs"); 
var multer = require('multer');


upload = multer({ dest: './public/images' });

/* GET przepisy listing. */
router.get('/', function(req, res, next) {
    Recipe.find().exec(
      (error, recipe) => {
        if (error || !recipe) { 
           res.send('Błąd odczytu bazy danych');
        } else { 
           //console.log(post);
            res.render('recipes', {title: "Lista przepisów", recipes : recipe, user: req.user}) 
    } 
  }
    )   
  });

/* GET register form. */
router.get('/add', function(req, res, next) {
  if(req.user != null)
    res.render('add', { title: 'Dodaj nowy przepis', bform: true, user: req.user});
  else
  res.redirect("/")
  });


/* GET picture saved in mongoDB */
router.get('/photo/:id', (req, res) => {
    
  console.log("ID"+req.params.id)
    Recipe.findOne(
        {
        _id: req.params.id 
    }, (err, result) => {
    
    if (err || !result) return console.log(err)
        res.contentType(result.picture_type);
        res.send(result.picture_data);
      })
    })

/* POST addrecipe */
router.post('/add', upload.single('picture'), function(req, res) {

    console.log('Body- ' + JSON.stringify(req.body));
    console.log('File- ' + JSON.stringify(req.file));
    console.log('File-name ' + req.file.originalname);    
    
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
          res.send('BŁĄD: '+error.name+': '+error.errmsg);
      } 
      else 
      res.redirect("/recipes");
     
    });
    
  })
  
  module.exports = router;