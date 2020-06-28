var express = require('express');
var User = require('../database/model/user');
var router = express.Router();
var createError = require('http-errors');
var bcrypt = require('bcrypt')

const salt = 10;

/* GET users list */
router.get('/', function (req, res, next) {
  User.find().exec(
    (error, user) => {
      if (error || !user) {
        res.send('Błąd odczytu bazy danych');
      }
      else if (req.user == null) {
        res.redirect("/")
      }
      else
        res.render('users', { title: "Lista użytkowników", users: user, user: req.user })
    }
  )
});

/* GET register form. */
router.get('/register', function (req, res, next) {
  if (req.user == null)
    res.render('register', { title: 'Zarejestruj użytkownika', bform: true });
  else
    res.redirect("/")
});

/* POST register form. */
router.post('/register', function (req, res, next) {
  const hash = bcrypt.hashSync(req.body.pass, salt);
  console.log("HASH CODE: " + hash);
  if (req.body.pass != req.body.repass) {
    res.render('register', { title: 'Zarejestruj użytkownika', info: 'Hasła muszą być identyczne', bform: true });
  } else {
    User.create({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: hash
    }, (error, result) => {
      if (error) {
        res.redirect("/users/register")
      }
      else
        res.redirect("/users/login");
    });
  }
})

/* GET update form. */
router.get('/update/:id', function (req, res, next) {
  if (req.user == null) {
    res.redirect("/")
  }
  else {
    User.findOne({
      _id: req.params.id
    }, (error, user) => {
      if (error || !user) {
        console.log(error)
      } else {
        res.render('update', {
          title: "Edytuj użytkownika",
          name: user.name,
          surname: user.surname,
          email: user.email,
          id: user._id,
          bform: true,
          user: req.user
        })
      }
    })
  }
})

/* POST update form. */
router.post('/update/:id', function (req, res, next) {
  User.findOneAndUpdate({
    _id: req.params.id
  }, {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email
  }, (error, result) => {
    if (error) {
      console.log(error)
    } else
      res.redirect("/users");
  })
})

/* GET delete form. */
router.get('/delete/:id', function (req, res, next) {
  if (req.user == null) {
    res.redirect("/")
  }
  else{
    User.findOneAndRemove({
      _id: req.params.id
    }, (error, user) => {
      if (error || !user) {
        console.log(req.params.id)
        next(createError(404, 'Nie znaleziono strony'))
      } else {
        res.redirect('/users')
      }
    })
  }
})

/* GET login form. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Zaloguj' });
});

/* POST login form */
router.post('/login', function (req, res, next) {

  const hash = bcrypt.hashSync(req.body.pass, salt);
  console.log("PASS: " + req.body.pass);
  console.log("HASH CODE: " + hash);

  User.findOne(
    {
      email: req.body.email
    }, (error, user) => {
      if (error || !user) {
        res.render('login', { title: 'Zaloguj', info: 'Nieprawidłowy login', bform: true });
      } else {
        if (bcrypt.compareSync(req.body.pass, user.password)) {
          res.cookie('user', req.body.email, { signed: true });
          res.redirect("/");
        } else {
          res.render('login', { title: 'Zaloguj', info: 'Nieprawidłowe hasło', bform: true });
        }
      }
    })
})

/* GET logout form */
router.get('/logout', function (req, res, next) {
  res.clearCookie('user', { signed: false });
  res.redirect('/');
});

module.exports = router;