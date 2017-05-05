const mongoose=require('mongoose');

mongoose.connect('mongodb://admin:admin123@ds127531.mlab.com:27531/emailclientdb');
const Schema= mongoose.Schema;

var uSchema = new Schema({
	googleId:{type:String,required:true},
	email:{type:String},
	name:{type:String}
});
var tempSchema= new Schema({
	templateId:{type:String},
	content:{type:String}
});
var tempModel=mongoose.model('templates',tempSchema);
var userModel =mongoose.model('users',uSchema);
module.exports={user:userModel,template:tempModel};