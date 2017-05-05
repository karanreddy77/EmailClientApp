var express = require('express');
var router = express.Router();
var mailing=require('./../mailing/sendMail');
const template=require('./../db/dbSetup').template;
var fs=require('fs');
var path=require('path');
var upload  = require('multer')({dest:path.resolve('uploads/')});
var XLSX=require('xlsx');
const baseUrl=require('./../config/url');
const  googleAuth = require('google-auth-library');
var clientcd={clientId:'684531750081-707ei03t4ekj4vvvl2f5l5uchftkm2oi.apps.googleusercontent.com',
	clientSecret:'ruqN6IlDAU8PCzFK8j6pclZv',
	callbackUrl:baseUrl+"auth/google/callback"};
	var auth=new googleAuth();
	var credentials=JSON.parse(fs.readFileSync(path.resolve('config/client_tokens.json'),"utf8"));
var oauth2Client = new auth.OAuth2(clientcd.clientId, clientcd.clientSecret, clientcd.callbackUrl);
/* GET users listing. */
router.get('/', function(req, res, next) {
	if(req.isAuthenticated())
	{
		res.render('user',{name:req.user.name,email:req.user.email});
	}
	else
	{
		res.render('login');
	}
	
});
router.get('/getTemplates',function(req,res){
	template.find({},function(err,data){
		res.send(data);
	})
});
router.post('/sendMail',function(req,res){
	//console.log(req.body);
	if(req.isAuthenticated())
	{
		var cont=req.body;
		if(cont.edit==1)
		{
			console.log(cont);
			template.update({templateId:cont.templateId},{content:cont.template},function(err,data){
				if(err)
				{
					console.log(err);
				}
				else
				{
					console.log(data);
				}
			})
		}
		oauth2Client.credentials=credentials;
		console.log("users sender: "+cont.sender);
		mailing(oauth2Client,req.user.googleId,cont.sender,cont.recipients.split(","),cont.template,function(err,result){
			if (err) {
	          console.log('err:', err);
	        } else {
	        	console.log(result);
	        res.setHeader("Cache-Control", "no-cache");
    		res.setHeader("Expires", new Date(1962, 6, 7));		
	          res.send(result);
	        }
		});
	}
	else{
		res.end('Not authenticated');
	}
	
});
router.get('/logout',function(req,res){
	req.logout();
	req.session.destroy();
	res.send({redirect: '/login'});
	// req.session.destroy(function (err) {
 //    	res.send({redirect: '/login'}); //Inside a callback… bulletproof!
 //  	});
});
router.post('/contactUpload',upload.single('contacts'),function(req,res){
	if(req.isAuthenticated())
	{
		var workbook=XLSX.readFile(req.file.path);
		var sheet=workbook.Sheets[workbook.SheetNames[0]];
		var data=XLSX.utils.sheet_to_json(sheet);
		res.send(data);
	}
	else
	{
		res.end('Not authenticated');
	}
})
module.exports = router;
