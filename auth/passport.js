const passport=require('passport');
const gStrategy=require('passport-google-oauth').OAuth2Strategy;
const User=require('./../db/dbSetup').user;
var google = require('googleapis');
var path = require('path');
const fs=require('fs');
const baseUrl=require('./../config/url');
var clientcd={clientID:'684531750081-707ei03t4ekj4vvvl2f5l5uchftkm2oi.apps.googleusercontent.com',
	clientSecret:'ruqN6IlDAU8PCzFK8j6pclZv',
	callbackURL:baseUrl+"auth/google/callback"};

module.exports=function(passport)
{
	passport.serializeUser((user,done)=>{
		done(null,user.id);
	})
	passport.deserializeUser((id,done)=>{
		User.findById(id,function(err,user){
			done(err,user);
		})
		// done(null,id);
	})

	passport.use(new gStrategy(clientcd,
	function(accessToken,requestToken,profile,done)
	{
        //var credentials={"access_token":accessToken,"refresh_token":requestToken,"token_type":"Bearer","expiry_date":1493522866623}; 
        var credentials={"access_token":accessToken,"refresh_token":requestToken}; 
		 
		 fs.writeFileSync(path.resolve('config/client_tokens.json'),JSON.stringify(credentials),'utf8');
		 // sendSampleMail(oauth2Client,profile.id,function(err,results){
		 // 	if(err) console.log(err)
		 // 	else console.log(results);
		 // }); 
		User.findOne({googleId:profile.id},function(err,obj)
		{
			if(err)
			{
				throw err;
			}
			else
			{
				if(obj)
				{
					 done(null,obj,{message:'user already exists'});
				}
				else
				{
					var params={
						googleId:profile.id,
						email:profile.emails[0].value,
						name:profile.displayName
					};
					console.log(params);
					var newUser=new User(params);
					newUser.save(function(err,obj)
					{
						if(err) throw err;
						else
						{
							done(null,obj);
						}
					});
				}	
			}
		});
	}
	));
}	