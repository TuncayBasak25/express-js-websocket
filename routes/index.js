var express = require('express');
var router = express.Router();

var db = require('../models/index');


/* GET home page. */
router.get('/', async function(req, res, next) {

  try
  {
    const actualUser = await db.User.findOne({ where: {sessionId: req.session.id } });

    if (actualUser)
    {
      res.render('userhome', { user:actualUser.dataValues.username });
    }
    else
    {
      res.render('home', {title: 'Home'});
    }
  }
  catch (e) {
    console.log(e);
  }
});


module.exports = router;
