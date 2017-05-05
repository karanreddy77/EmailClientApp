var templates=[];
var edit=0;
var curTemp=0;
var tempId;
var baseUrl="http://localhost:3000/";
//var baseUrl="https://emailclientapp-166303.appspot.com/";
$(document).ready(function(){
	$(":file").filestyle('size', 'lg');
	$("#temp").prop('disabled', true);
	$("#sendr").prop('disabled', true);
	/* $("#tempSel").click(function(){
		if(templates.length==0)
		{
			fetchTemplates();	
		}
	}) */
	$("#tempMenu").click(function(){
		if(templates.length==0)
		{
			fetchTemplates();	
		}
	})
	$("#edit").click(function(){
		if(edit==0)
		{
			$("#temp").prop('disabled', false);
			$("#edit").text("Editing Enabled");
			edit=1;
		}
		else
		{
			if(templates.length==0)
			{
				$("#temp").val("");
			}
			else
			{
				$("#temp").val(templates[curTemp].content);
			}
			$("#temp").prop('disabled', true);
			$("#edit").text("Editing Disabled");
			edit=0;
		}
	})
	$("#sendBtn").click(function(){
		var emailData={};
		emailData.sender=$("#sendr").val();
		console.log("print send in formhandler:"+emailData.sender);
		if($("#recp").val()=="")
		{
			 alert("Please enter Recipients");
		}
		else
		{
	
			emailData.recipients=$("#recp").val();
		}
		if($("#temp").val()=="")
		{
			 alert("Please enter some Template");
		}
		else
		{
			emailData.template=$("#temp").val();
		}
		if($("#recp").val()!="" && $("#temp").val()!=""){
			emailData.edit=edit;
			emailData.templateId=tempId;
			$.post(baseUrl+"users/sendMail",emailData,function(data){
				$("#recp").val("");
				$("#temp").val("");

				console.log(data);
			})	
		}
		
		// emailData.
	});
	$("#logout").click(function(){
		$.get(baseUrl+"users/logout",function(data){
			window.location=data.redirect;
		});
	})

})
	
function fetchTemplates()
{
	$.get(baseUrl+"users/getTemplates",function(data){
			 // var data=JSON.parse(data);
				console.log(data);
				templates=data;
				for(var i=0;i<templates.length;i++)
				{
					$("#tempMenu ul").append('<li><a href="#">'+templates[i].templateId+'</a></li>');

				}
				$(".dropdown-menu li a").click(function(){
			      $("#tempSel").text($(this).text());
			      for(var i=0;i<templates.length;i++)
			      {
			      	console.log($(this).text().toString());
			      	if(templates[i].templateId==$(this).text().toString())
			      	{
			      		curTemp=i;
			      		tempId=templates[i].templateId;
			      		$("#temp").val(templates[i].content);
			      	}
			      }
			      
			   	});

				// console.log(data);
			});
}	

function testing()
{
	var formdata= new FormData();
	var file=document.getElementById('contacts').files[0];
	// console.log(file);
	formdata.append('contacts',file);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', baseUrl+'users/contactUpload', true);
	// Set up a handler for when the request finishes.
	xhr.onload = function () {
	  if (xhr.status === 200) {
	    // File(s) uploaded.
	    var resp=JSON.parse(xhr.responseText);
	    var list="";
	    for(var i=0;i<resp.length-1;i++)
	    {
	    	list+=resp[i].Emails+",";
	    }
	    list+=resp[resp.length-1].Emails;
	    $("#recp").val(list);
	    $(":file").filestyle('clear');
	    $('input[type="file"]').val(null);
	    // alert('file uploaded');
	  } else {
	    alert('An error occurred!');
	  }
	};
	 // $.post("http://localhost:3000/users/contactUpload",formdata,function(data){
	 		
	 // });
	 // $.ajax({url: "http://localhost:3000/users/contactUpload",data:formdata,method:'POST', success: function(result){
  //       console.log(result);
  //   }});
	xhr.send(formdata);
}