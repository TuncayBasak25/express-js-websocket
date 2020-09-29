var express = require('express');
var router = express.Router();

var db = require('../models/index');

var Joi = require('joi');

let userSchema = Joi.object( {
  username: Joi.string().min(3).max(8).required(),
  password: Joi.string().min(4).max(6).required()
});

/* Enter login page. */
router.all('/', async function(req, res, next) {console.log('test');

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
  res.render('login');
});

/* POST login page. */
router.post('/', async function(req, res, next) {
  try
  {
    const valid = userSchema.validate(req.body);

    if (valid.error)
    {
      res.render('login', { error: valid.error.details[0].message, lastUsername: req.body.username });
      return;
    }

    const user = await db.User.findOne({ where: {username: req.body.username } });

    if (!user)
    {
      res.render('login', { error: "User don't exists.", lastUsername: req.body.username });
      return;
    }

    if (user.dataValues.password !== req.body.password)
    {
      res.render('login', { error: "Password is wrong.", lastUsername: req.body.username });
      return;
    }

    await db.User.update({ sessionId: req.session.id }, { where: { username: req.body.username } });

    res.redirect('/');
  }
  catch (e) {
    console.log(e);
  }
});




module.exports = router;
