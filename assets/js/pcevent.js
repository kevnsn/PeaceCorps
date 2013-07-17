// JavaScript Document
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
 //Helper methods to check for form completion and change button status.
// var addformlisteners;
 //var checkSubmit;
 
 
 //--------Hack to load faster -- 
 //http://lou.prado.me/tech_blog/how_to_fix_long_start_times_and_blank_white_screen_for_android_apps_built_on_phonegap_and_jqtouch.php
  //main string for the link for mailto:
 var edatastring; //contains returned search page
 var edataarray; // contains returned search results
 var esearchstring;
 var epages; // stores total number of epages
 var ecurrpage; // stores current page
 //var eetest;
 

 function eventaddForm() {
	 console.log("Form listeners started");
	 //Add button listener
	 $("#eventrequestbutton").click(function(e) {
		  $("body").addClass("loading");
		  echeckSubmit();
		  e.preventDefault();
		  });
		
		$("#eventnextbutton").click(function() {
		  $("body").addClass("loading");
		 eupdateSearch(esearchstring,ecurrpage+1);
		  });
		  
		$("#eventprevbutton").click(function() {
		  $("body").addClass("loading");
		  eupdateSearch(esearchstring,ecurrpage-1);
		  });
		//Add listener for location field
		
			//bind back button
		$("#eventbackresultbutton").bind("click", function(e){$("#eventjobcontainer").hide();
				$("#eventresultcontainer").show();
				e.preventDefault();
				});

		//document.addEventListener("backbutton", onBackKeyDown, falrese);
    		}
			
/*function onBackKeyDown() {
			$("#jobcontainer").hide();
			$("#resultcontainer").show();
		}*/
echeckSubmit = function() 
{

	 var state = "?state="+$("#event_id_state").val();
	 var keyword = "&keyword_search="+$("#event_id_keyword_search").val();
	 esearchstring = "http://www.peacecorps.gov/meet/events/"+state+keyword;
	console.log("searching with" +esearchstring);
	eupdateSearch(esearchstring,1);
};

eupdateSearch = function(urlstring,pagenumber) {
	//console.log("spinner deployed");
	$("body").addClass("loading");
	$.ajax({
    url: urlstring+"&page="+pagenumber,
    type: 'GET',	
	error: function(){$("body").removeClass("loading");alert("There was an error connecting to the database.  Please check your connection and try again.");},
    success: function(res) {
		
		$("body").removeClass("loading");
       // var headline = $(res.responseText).find('a.tsh').text();
	   console.log("AJAX success");
	   console.log(res);

	   edatastring = $(res).find('div#main');
        console.log(edatastring);
		//console.log(edatastring.find('span.step-links'));
		//dispaly total results  / epages strings
		$("#eventnote").text(edatastring.find('p.note').text());
		
		//get total number of epages
		epages = Math.ceil((parseInt(edatastring.find('p.note strong').text().split(' ')[0],10)/10));
		
		//get current page number
		ecurrpage = (edatastring.find('span.step-links span.current').length==0) ? 1:parseInt(edatastring.find('span.step-links span.current').text().split(' ')[1],10);
		
		//adjust buttons accordingly:
		  $('#eventnextbutton').removeClass('ui-disabled');
		  $('#eventnextbutton').removeAttr("disabled");
		  $('#eventprevbutton').removeClass('ui-disabled');
		 $('#eventprevbutton').removeAttr("disabled");
		if(ecurrpage==epages)
		{$('#eventnextbutton').addClass('ui-disabled');
		  $('#eventnextbutton').attr("disabled","true");}
		if(ecurrpage==1)
		{$('#eventprevbutton').addClass('ui-disabled')
		$('#eventprevbutton').attr("disabled","true");}
		
		$("#eventpagelabel").text("Page "+ecurrpage + " of " + epages);
		$("#eventbottomcontainer").show()
		$("#eventdatatable").html(edatastring.find('#resultTable'));
		edataarray = $('#eventdatatable tr:has(td)').map(function(i, v) {
			var $td =  $('td', this);
				return {id: ++i,
						 postdate: $td.eq(0).text().trim(),
						 eventname: $($td.eq(1)).find('a').text(),
						 elink: "http://www.peacecorps.gov/"+$td.eq(1).html().trim().substring(10, $td.eq(1).html().trim().indexOf(">")-1),          
						 location:$td.eq(2).text().trim(),
						 zipcode:$td.eq(3).text().trim(),
						 state:$td.eq(4).text().trim(),
				}
		}).get();
		//console.log(edataarray);
		var data='<ul class="list" id="eventreslist" >';
		var length = edataarray.length;
		var locationtext;
		
		for (var i = 0; i < length; i++) {
			locationtext=" ("+edataarray[i].location +", " +edataarray[i].state+")";
			data+='<li  date="'+edataarray[i].postdate+'"><a class="joblink" href="'+edataarray[i].elink+'"><h3>'+edataarray[i].eventname+'</h3><h4>Date: '+edataarray[i].postdate+locationtext+'</h4></a></li>';
		}
		data+='</ul>';
		//console.log(data);
		$("#eventresulttable").html(data);
    	//$("#pagelabel").html(edatastring.find('span.step-links').html());
		/*$("#reslist").listview({
		    autodividers: true,
		    autodividersSelector: function (li) {
		        var out = li.attr('date');
		        return out;
		    }
		}).listview('refresh');*/
		$("body").removeClass("loading");
		//$.mobile.hidePageLoadingMsg();
		$("#eventjobcontainer").hide();
		$("#eventresultcontainer").show();
				
		//bind list links
		$(".joblink").bind("click", function(e){$("body").addClass("loading");echangePage(this.getAttribute('href')); /*etest = this;*/e.preventDefault(); return false;});
		} //end onsuccess
}); //end ajax 
}; //end function
//Create content for a search result
echangePage = function(joburl) {
	//$("#jobtext").load(joburl+" div#main");
	console.log("startajax to change page");
	$("body").addClass("loading");
	
	$.ajax({
    url: joburl,
    type: 'GET',
	error: function(){alert("There was an error connecting to the database.  Please check your connection and try again.");},
    success: function(res) {
		//console.log("Ajax success");
		//console.log(res);
	 edatastring = $(res).find('div#main');
	// console.log(edatastring);
	$("#eventjobtext").html(edatastring);
	$("#eventjobtext a").bind("click", function(e){ /*etest = this;*/e.preventDefault(); /*alert(this.getAttribute('href'));*/loadURL(this.getAttribute('href'));return false;});
	$("#eventjobcontainer").show();
	$("#eventresultcontainer").hide();
	$("body").removeClass("loading");
	}
	});
}

epart2=function(){
	  //Hide state and country input fields
		eventaddForm(); // Add listeners and functionality
		//Start a search//updateSearch("http://www.peacecorps.gov/resources/returned/careerlink/jobs/?location_macro=&classification=&keyword_search=",1);
		esearchstring="http://www.peacecorps.gov/meet/events/?state=&keyword_search=";
		$('#eventnextbutton').addClass('ui-disabled');
		  $('#eventnextbutton').attr("disabled","true");
		$('#eventprevbutton').addClass('ui-disabled')
		$('#eventprevbutton').attr("disabled","true");
		
};