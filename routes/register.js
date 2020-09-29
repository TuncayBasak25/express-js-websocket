var express = require('express');
var router = express.Router();

var db = require('../models/index');

var Joi = require('joi');

let userSchema = Joi.object( {
  username: Joi.string().min(3).max(8).required(),
  password: Joi.string().min(4).max(6).required()
});

/* Enter login page. */
router.all('/', async function(req, res, next) {

  try
  {
    const actualUser = await db.User.findOne({ where: {sessionId: req.session.id } });

    if (actualUser)
    {
      res.redirect('/');
    }

    next();
  }
  catch (e) {
    console.log(e);
  }
});

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('register');
});

/* POST login page. */
router.post('/', async function(req, res, next) {
  try
  {
    const valid = userSchema.validate(req.body);

    if (valid.error)
    {
      res.render('register', { error: valid.error.details[0].message });
      return;
    }

    const user = await db.User.findOne({ where: {username: req.body.username } });

    if (user)
    {
      res.render('register', { error: "This username is already taken.", lastUsername: req.body.username });
      return;
    }

    await db.User.create( {username: req.body.username, password: req.body.password} );

    res.redirect('/login');
  }
  catch (e) {
    console.log(e);
  }
});




module.exports = router;
