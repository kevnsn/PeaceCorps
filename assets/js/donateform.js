// JavaScript Document
var url1 = "https://donate.peacecorps.gov/index.cfm?shell=donate.contribute.summary";
var url2 = "https://donate.peacecorps.gov/index.cfm?shell=donate.contribute.process";
var url3 = "https://www.pay.gov/paygov/OCIServlet";
// Get information screen

var submitForm3 = function (){
console.log ("submitting 3rd ajax");
$.ajax({
    url: url3,
    type: 'POST',
    data:$('form[name="Paymentinfo"]').serialize(),
    success: function(res) {
alert("ajax to pay.gov succcesful");
	console.log(res);
	$(".donatepanel").html($(res).find('form[name="enterPlasticCardPaymentInformation"]'));
        $('input[name="formAction"]').addClass("button submitbutton");
        $("body").removeClass("loading");
	}
	});
}

// Get confirmation screen
var submitForm2 = function (){
console.log ("submitting 2nd ajax");
$.ajax({
    url: url2,
    type: 'POST',
    data:$("#donationForm").serialize(),
    success: function(res) {
	console.log(url2);
	$(".donatepanel").html($(res).find("form[name='Paymentinfo']"));
        $('button[name="senddata"]').addClass("button submitbutton");
        $("body").removeClass("loading");
        $('button[name="senddata"]').click(function(event) {
        $("body").addClass("loading");
        /*submitForm3();*/ //removes loading mask when done
        });
      }});
}


var submitForm1 = function () {
$.ajax({
    url: url1,
    type: 'POST',data:$("#genForm").serialize(),
    success: function(res) {
	console.log(res);
	$(".donatepanel").html($(res).find("#donationForm"));
        $('button[name="submit"]').addClass("button submitbutton")
        $("body").removeClass("loading")
        $('button[name="submit"]').click(function(event) {/*alert("submit clicked" + $("card_name").val());*/
if ($("#card_name").val().length!=0&&$("#card_address").val().length!=0&&$("#card_city").val().length!=0&&$("#card_state").val().length!=0&&$("#card_zip").val().length!=0){
alert("good form");
$("body").addClass("loading");
submitForm2(); //removes loading mask when done
}
else {alert("Please enter all required fields.");event.preventDefault();}
});
}
	});
}





//Upon load of page, set up validation script parameters
setupDonate = function () {
	console.log("donate form loaded");	

$('button[name="submitDonate"]').click(function(event) {//alert("submit clicked");
if ($("#amt").val()>=0.5)
{
//alert("good form");
$("body").addClass("loading");
submitForm1(); //removes loading mask when done
}
else {alert("Please enter a valid donation amount");}

event.preventDefault();});
	/*jQuery.validator.addMethod("twoDecimal", function(value, element) {
    	return this.optional(element) || /^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{2})?$/.test(value);
	});
	
	jQuery.validator.addMethod("posterChoice", function(value, element) {
		var amount = (jQuery("#amt").val()).replace(',','');
		return (amount >= 20 && amount < 100 && jQuery('#yes_premium').is(':checked')) ? !this.optional(element) : true;											 
	});*/
	
	//Clear out any previously selected values
	jQuery('#amt').val('');
//jQuery('#amt').change(function() { alert("amtchanged");});
	//jQuery('#yes_premium').attr('checked', false);
	//jQuery('#no_premium').attr('checked', false);
	
	//Add check to amount to enable appropriate options based on donation amount
	/*jQuery('#amt').change(function() {
		//strip comma out of number for comparison
		var amount = (jQuery("#amt").val()).replace(',','');
	
		if (amount >= 10)
		{
			
			if (jQuery("#yes_premium").is(':disabled'))
			{
				enablePremium();	
			}	
			
			if (amount >= 20 && amount < 100)
			{
				if (!(jQuery("#no_premium").is(':checked')))
				{
					enablePoster();
				}
			}
			else
			{
				disablePoster();
			}		
			
		}
		else {
			disablePremium();
			disablePoster();
		}	
	
		
	});

	jQuery('#yes_premium').click(function() {
		  var amount = (jQuery("#amt").val()).replace(',','');
		  
		  if (amount >= 20 && amount < 100)
		  {
			  enablePoster();
		  }
			
	});
	
	jQuery('#no_premium').click(function() {
		disablePoster();
    });
*/

	//Set up validation on required fields
	/*jQuery("#genForm").validate({
		rules: {
			amt: {
				required: true,
				twoDecimal: true
			},
			donorprem: "required",
			donorrec: "required",
			tshirt: "posterChoice"
		}, submitHandler: function(form) {
    alert("formsubmit");
  }
	}
);*/
	
	//disablePremium();
	//disablePoster();

}

/*

function enablePremium() {
	jQuery("#yes_premium").attr('disabled', false);
	jQuery("#no_premium").attr('disabled', false);
	jQuery("#donorpremques").attr('style', 'color:#45413e');	
}

function disablePremium() {
	jQuery("#yes_premium").attr('disabled', true);
	jQuery("#yes_premium").attr("checked", false);
	jQuery("#no_premium").attr('disabled', true);
	jQuery("#no_premium").attr("checked", false);
	jQuery("#donorpremques").attr('style', 'color:#9b9890');	
}

function disablePoster() {
	jQuery("#poster").val('');
	jQuery("#poster").attr('disabled', true);
	jQuery("#posterlbl").attr('style', 'color:#9b9890');
}

function enablePoster() {
	jQuery("#poster").attr('disabled', false);
	jQuery("#posterlbl").attr('style', 'color:#45413e');	
}*/
