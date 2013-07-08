// JavaScript Document
var url1 = "https://donate.peacecorps.gov/index.cfm?shell=donate.contribute.summary";
var url2 = "https://donate.peacecorps.gov/index.cfm?shell=donate.contribute.process";
var url3 = "https://www.pay.gov/paygov/OCIServlet";
var cookietemp;
// Get information screen

var submitForm5 = function () {
	$.ajax({
    url: "https://pay.gov"+$('form[name="authorizePaymentForm"]').attr('action'),
    type: 'POST', headers:{"Cookie":localStorage["cookietemp"]},
	error: function(error) {alert("Error submitting form.  Check your network connection.");$("body").removeClass("loading");},
    data:$('form[name="authorizePaymentForm"]').serialize()+"&formAction=Submit+Payment",
    success: function(res) {
    alert("ajax to pay.gov FINAL payment succcesful");
	console.log(res);
	if($(res).find('#main p')[1]==undefined)
	{
			alert("no error message,using html");
	$("#donatepanel2").html($(res).find('form[name="authorizePaymentForm"]'));
	alert("form replaced, submitting second ajax");
	$.ajax({
    url: "https://pay.gov"+$('form[name="authorizePaymentForm"]').attr('action'),
    type: 'POST', headers:{"Cookie":localStorage["cookietemp"]},
    data:$('form[name="authorizePaymentForm"]').serialize(),
	error: function(error) {alert("Error submitting form.  Check your network connection.");$("body").removeClass("loading");},
    success: function(res) {
	console.log(res);
	$("#donatepanel2").html(res);
	var tempdata=$('form[action="https://donate.peacecorps.gov/donate/contribute/pgsuccess.cfm"]').serialize();
	console.log("submitted to peacecorps sucess page");
	console.log(tempdata);
	//START FINAL AJAX
	$.ajax({
    url: "https://donate.peacecorps.gov/donate/contribute/pgsuccess.cfm",
    type: 'POST', headers:{"Cookie":localcStorage["cookietemp"]},
    data: $('form[action="https://donate.peacecorps.gov/donate/contribute/pgsuccess.cfm"]').serialize(),
	error: function(error) {alert("Error submitting form.  Check your network connection.");$("body").removeClass("loading");},
    success: function(res) {
	$("#donatepanel2").html($(res).find("#main"));
	$("body").removeClass("loading");
	$($("#main").find('p')[2]).hide()
	$("#main").append("<a class='button' href='#donate'>Back to Donate</a>")
		}});// end peace corps final ajax
	
	
	}});// end final submission ajax
	}//end if sucessful
	else /* if ($(res).find('#main p')[1].innerHTML=="We apologize for the error during the donation process. Please try one of the options below to contribute to a Volunteer's community project. We appreciate your patience!")*/{
		console.log("error in payment");
		 $("body").removeClass("loading");
		 alert("There was an error in your payment.  Please check your information and try again");
		 $("body").removeClass("loading");

	} // end if statement if sucessful
	}//end sucessfunction
	});
}


var submitForm4 = function (){
console.log ("submitting 3rd ajax");
$.ajax({
    url: "https://pay.gov"+$('form[name="enterPlasticCardPaymentInformation"]').attr('action')+";"+localStorage["cookietemp"],
    type: 'POST', headers:{"Cookie":localStorage["cookietemp"],"Origin":"https://www.pay.gov","Referer":"https://www.pay.gov/paygov/OCIServlet"},
	error: function(error) {alert("Error submitting form.  Check your network connection.");$("body").removeClass("loading");},
    data:$('form[name="enterPlasticCardPaymentInformation"]').serialize()+"&formAction=Continue+with+Plastic+Card+Payment",
    success: function(res,textstat,jqXHR) {
    alert("ajax to pay.gov payment succcesful");
	console.log(res);
	//alert(jqXHR.getResponseHeader("Set-Cookie"));
	//alert(jqXHR.getResponseHeader("Location"));
	if($(res).find('#main p')[1]==undefined)
	{
		
		$("body").removeClass("loading");
	$("#donatepanel2").html($(res).find('form[name="authorizePaymentForm"]'));
	var temp = $("label[for='authorizeTransaction']");
	$("label[for='authorizeTransaction']").remove();
	$("#authorizeTransaction").after(temp);//fix checkbox styling
	$('input[name="formAction"]').addClass("button submitbutton");
	$('input[name="formAction"]').click(function(event){
		if($("#authorizeTransaction").prop('checked'))
		{
		if($("#customerEmail").val()==$("#confirmEmailAddress").val())
		{
		$("body").addClass("loading");
		event.preventDefault();
		submitForm5();
		}
		else {
			alert("The email addresses you have provided do not match.");
			event.preventDefault();
		}
		}
		else {alert("Please authorize the payment to continue.");
			event.preventDefault();}
		});//end new click listener
	
	}
	/*if ($(res).find('#main p')[1].innerHTML=="We apologize for the error during the donation process. Please try one of the options below to contribute to a Volunteer's community project. We appreciate your patience!")*/
	else if (jqXHR.getResponseHeader("Set-Cookie")!=null)
	{
	localStorage.setItem("cookietemp", jqXHR.getResponseHeader("Set-Cookie").substring(0,75));
	alert("new cookie detected,saved");
	submitForm4();
	}
	else
	{
		alert("xhr:"+jqXHR.getResponseHeader("Set-Cookie"));
		console.log("error in payment");
		 $("body").removeClass("loading");
		 alert("There was an error in your payment.  Please check your information and try again");
		 event.preventDefault();
	}
	/*else{
	$("body").removeClass("loading");
	$("#donatepanel2").html($(res).find('form[name="authorizePaymentForm"]'));
	$('input[name="formAction"]').addClass("button submitbutton");
	$('input[name="formAction"]').click(function(){
		$("body").addClass("loading");
		submitForm5();
		});
	
	}*/
	/*$(".donatepanel").html($(res).find('form[name="enterPlasticCardPaymentInformation"]'));
        $('input[name="formAction"]').addClass("button submitbutton");
        $("body").removeClass("loading");*/
	}
	});
}
	
var submitForm3 = function (){
console.log ("submitting 3rd ajax");
$.ajax({
    url: url3,cache:"false",
    type: 'POST',
	error: function(error) {alert("Error submitting form.  Check your network connection.");$("body").removeClass("loading");},
    data:$('form[name="Paymentinfo"]').serialize(),
    success: function(res, textStatus,  jqXHR) {
    alert("ajax to pay.gov succcesful");
	//console.log(res);
	 //cookietemp=jqXHR.getResponseHeader('Set-Cookie');
	//console.log(cookietemp);
	alert("cookie gathered");
	console.log(res);
	var t = $(res).find('.hidden_link').attr('href');
	console.log(t);
	var temp = t.substring(1,t.indexOf('?'));
	console.log(temp);
	alert(temp);
	alert("xhr:"+jqXHR.getResponseHeader("Set-Cookie"));
	if(temp.substring(0,11)=="jsessionid=")
	{localStorage.setItem("cookietemp", temp);}
	else if (jqXHR.getResponseHeader("Set-Cookie")!=null)
	{localStorage.setItem("cookietemp", jqXHR.getResponseHeader("Set-Cookie").substring(0,75));
	alert("new cookie set as:" + localstorage["cookietemp"]);
	}
	
	//alert(jqXHR.getResponseHeader("Location"));
	//console.log("cookie set as"+t.substring(0,t.indexOf('?')));
	$("#donatepanel2").html($(res).find('form[name="enterPlasticCardPaymentInformation"]'));
	$('form[name="enterPlasticCardPaymentInformation"]').prepend("<h2>Enter Payment Info</h2>"); // add Informational Header
    $('input[name="formAction"]').addClass("button submitbutton");
    $("body").removeClass("loading");
	$('input[name="formAction"]').click(function(event){
	if ($("#cardHolderName").val().length!=0&&$("#cardHolderAddress").val().length!=0&&$("#plasticCardNumber").val().length!=0&&$("#cardSecurityCode").val().length!=0&&$("#expirationYear").val()!=""&&$("#expirationMonth").val()!=""){
		alert("good form");
		$("body").addClass("loading");
		submitForm4(); //removes loading mask when done
		event.preventDefault();
}
else {alert("Please enter all required fields.");event.preventDefault();}		
		});//end click listener
	}//end sucess
	});//end ajax
}

// Get confirmation screen
var submitForm2 = function (){
console.log ("submitting 2nd ajax");
$.ajax({
    url: url2,
    type: 'POST',
    data:$("#donationForm").serialize(),
	error: function(error) {alert("Error submitting form.  Check your network connection.");$("body").removeClass("loading");},
    success: function(res) {
	console.log(url2);
	$("#donatepanel2").html($(res).find("form[name='Paymentinfo']"));
	$("#donatepanel2").show();//hide all other previous processing
	$($("#donatepanel2").find('p')[1]).hide()
	$($("#donatepanel2").find('p')[2]).hide()
	$("#localcontent2").hide();
	$('#localcontent2').scrollTop(0);
        $('button[name="senddata"]').addClass("button submitbutton");
		$("form[name='Paymentinfo']").attr("action","")
        $("body").removeClass("loading");
        $('button[name="senddata"]').click(function(event) {
		event.preventDefault();
        $("body").addClass("loading");
        submitForm3();//removes loading mask when done
        });
      }});
}
var result;

var submitForm1 = function () {
$.ajax({
    url: url1,
    type: 'POST',data:$("#genForm").serialize(),
	error: function(error) {alert("Error submitting form.  Check your network connection.");$("body").removeClass("loading");},
    success: function(res) {
	console.log(res);
	//$(".donatepanel").html($(res).find("#donationForm"));
	$("#ajaxcontent").html($(res).find("input[type='hidden']"))
	$("#ajaxcontent").prepend($(res).find("#donateSummaryTable"))
	$("body").removeClass("loading");
	$.ui.loadContent("donate2",false,false,"fade");
}
	});
}

//Upon load of page, set up validation script parameters
setupDonate = function () {
	removeLoad();
	console.log("donate form loaded");	
	$('button[name="submit"]').addClass("button submitbutton");
	$('#localcontent2').show()
	$("#donatepanel2").hide();
	$('button[name="submitDonate"]').unbind('click');
	$('button[name="submitDonate"]').click(function(event) {//alert("submit clicked");
	if ($("#amt").val()>=1.0)
	{
		//alert("good form");
        $("body").addClass("loading");
        submitForm1(); //removes loading mask when done
}
else {alert("Please enter a valid numerical donation amount (no cents, periods, or symbols).");}
event.preventDefault();});
	jQuery('#amt').val('');
}


setupDonate2 = function () {
console.log("donate form loaded");	
//$("#donatepanel2").attr();
//$("#localcontent2").show();
$('button[name="submit"]').addClass("button submitbutton");
$('button[name="submit"]').unbind('click');
$('button[name="submit"]').click(function(event) {//alert("submit clicked");
if ($("#card_name").val().length!=0&&$("#card_address").val().length!=0&&$("#card_city").val().length!=0&&$("#card_state").val().length!=0&&$("#card_zip").val().length!=0){
//alert("good form");
$("body").addClass("loading");
submitForm2(); //removes loading mask when done
event.preventDefault();
}
else {alert("Please enter all required fields.");event.preventDefault();}
}); //end click listene
}

