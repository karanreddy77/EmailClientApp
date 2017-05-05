var express = require('express');
var router = express.Router();
var passport= require('passport');
	require('./../auth/passport')(passport);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/login',function(req,res){
	res.render('login');
})
router.get('/auth/google',passport.authenticate('google',{scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read','https://www.googleapis.com/auth/gmail.send'],accessType: 'offline',approval_prompt: 'force'}));

router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/login'}),function(req,res){
	res.redirect('/users/');
});
module.exports = router;
