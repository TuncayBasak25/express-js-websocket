var express = require('express');
var router = express.Router();

var db = require('../models/index');

/* Logout. */
router.all('/', async function(req, res, next) { // all signifie tout type de requete (POST, GET, DELETE, PUT...)
  try
  {
    await db.User.update({ sessionId: null}, { where: { sessionId: req.session.id } } );
    
    res.redirect('/');
  }
  catch (e)
  {
    console.log(e);
  }
});



module.exports = router;
