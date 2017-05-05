const template=require('./../db/dbSetup').template;

for(let i=0;i<5;i++)
{
	var temp=new template({
		templateId:'temp'+i,
		content:'this is sample template content'+i
	})
	temp.save(function(err){
		if(err) throw err;
		else console.log('done');
	})
}
