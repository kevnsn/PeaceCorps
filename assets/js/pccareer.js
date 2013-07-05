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
 var datastring; //contains returned search page
 var dataarray; // contains returned search results
 var searchstring;
 var locationstring;
 var pages; // stores total number of pages
 var currpage; // stores current page
 var test;
 
    function toggle_visibility(id) {
       var e = document.getElementById(id);
       if(e.style.display != 'none')
          e.style.display = 'none';
       else
          e.style.display = 'block';
    }
	
function showHide(obj, objToHide) {
	//console.log(objToHide);
                //var el = $("#" + objToHide)[0];
                if (obj.className == "expanded") {
                    obj.className = "collapsed";
                } else {
                    obj.className = "expanded";
                }
                 toggle_visibility(objToHide);
            }
			
radioChange = function () {
				console.log("radio button activated"); 
				if ($("#radio-choice-2").attr('checked'))
				{
					console.log("radio2"); // Domestic filter selected, show state filter
					$("#countrydiv").hide();
					$('#id_country').val("")
					//$('#id_country').selectmenu('refresh');
					$("#statediv").show();
					}
				else if ($("#radio-choice-3").attr('checked'))
				{
					console.log("radio3"); // International selected, show country filter
					$("#statediv").hide();
					$('#id_state').val("");
					//$('#id_state').selectmenu('refresh');
					$("#countrydiv").show();
				}
				else
				{
					$("#countrydiv").hide();
					$("#statediv").hide();		
					console.log("radio1") // show all jobs;
				}					
			};
			
 function addForm() {
	 console.log("Form listeners started");
	 //Add button listener
	 $("#requestbutton").click(function() {
		  $("body").addClass("loading");
		  checkSubmit();
		  });
		
		$("#nextbutton").click(function() {
		  $("body").addClass("loading");
		 updateSearch(searchstring,currpage+1);
		  });
		  
		$("#prevbutton").click(function() {
		  $("body").addClass("loading");
		  updateSearch(searchstring,currpage-1);
		  });
		//Add listener for location field
		$("#radio-choice-1").change(radioChange);
		
		$("#radio-choice-2").change(radioChange);
		
		$("#radio-choice-3").change(radioChange);
			
			//bind back button
		$("#backresultbutton").bind("click", function(e){$("#jobcontainer").hide();
				$("#resultcontainer").show();
				e.preventDefault();
				});

		//document.addEventListener("backbutton", onBackKeyDown, false);
    		}
			
/*function onBackKeyDown() {
			$("#jobcontainer").hide();
			$("#resultcontainer").show();
		}*/
checkSubmit = function() 
{
	
	if ($("#radio-choice-2").attr('checked'))
	{
		locationstring = "?location_macro=us";
	}
	else if($("#radio-choice-3").attr('checked'))
	{
		locationstring = "?location_macro=int";
	}
	else
	{
		locationstring ="?location_macro=";
	}
	
	 var country = ($("#id_country").val()=="") ? "": "&country="+$("#id_country").val();
	 var state = ($("#id_state").val()=="") ? "": "&state="+$("#id_state").val();
	 var classif = "&classification="+$("#id_classification").val();
	 var tagarray= $("#id_tags").val();
	 var tagstring="";
	 if (tagarray!=null)
	 {for (var i = 0; i < tagarray.length; i++)
		 {
			tagstring+="&tags=" + tagarray[i];
		 }
	 }
	 
	 var ncecheck= ($("#id_nce").attr('checked')==false) ? "": "&nce=on";
	 var advcheck= ($("#id_not_advanced_degree_required").attr('checked')==false) ? "": "&not_advanced_degree_required=on";
	 var keyword = "&keyword_search="+$("#search-basic").val();
	
	 searchstring = "http://www.peacecorps.gov/resources/returned/careerlink/jobs/"+locationstring+country+state+classif+tagstring+ncecheck+advcheck+keyword;
	
	console.log("searching with" +searchstring);
	updateSearch(searchstring,1);
};

updateSearch = function(urlstring,pagenumber) {
	//console.log("spinner deployed");
	//$("body").addClass("loading");
	$.ajax({
    url: urlstring+"&page="+pagenumber,
    type: 'GET',
    success: function(res) {
		
		$("body").removeClass("loading");
       // var headline = $(res.responseText).find('a.tsh').text();
	   console.log("AJAX success");
	   console.log(res);

	   datastring = $(res).find('div#main');
        console.log(datastring);
		//console.log(datastring.find('span.step-links'));
		//dispaly total results  / pages strings
		$("#note").text(datastring.find('p.note').text());
		
		//get total number of pages
		pages = Math.ceil((parseInt(datastring.find('p.note strong').text().split(' ')[0],10)/10));
		
		//get current page number
		currpage = (datastring.find('span.step-links span.current').length==0) ? 1:parseInt(datastring.find('span.step-links span.current').text().split(' ')[1],10);
		
		//adjust buttons accordingly:
		  $('#nextbutton').removeClass('ui-disabled');
		  $('#nextbutton').attr("disabled","");
		  $('#prevbutton').removeClass('ui-disabled');
		 $('#prevbutton').attr("disabled","");
		if(currpage==pages)
		{$('#nextbutton').addClass('ui-disabled');
		  $('#nextbutton').attr("disabled","true");}
		if(currpage==1)
		{$('#prevbutton').addClass('ui-disabled')
		$('#prevbutton').attr("disabled","true");}
		
		$("#pagelabel").text("Page "+currpage + " of " + pages);
		$("#bottomcontainer").show()
		$("#datatable").html(datastring.find('#resultTable'));
		dataarray = $('#datatable tr:has(td)').map(function(i, v) {
			var $td =  $('td', this);
				return {id: ++i,
						 postdate: $td.eq(0).text().trim(),
						 deadline: $td.eq(1).text().trim(),
						 link: "http://www.peacecorps.gov/"+$td.eq(2).html().trim().substring(10, $td.eq(2).html().trim().indexOf(">")-1),          
						 jobtitle:$td.eq(2).find('a').text(),
						 organization:$td.eq(3).text().trim(),
						 city:$td.eq(4).text().trim(),
						 state:$td.eq(5).text().trim(),
						 country:$td.eq(6).text().trim()
				}
		}).get();
		//console.log(dataarray);
		var data='<ul class="list" id="reslist" >';
		var length = dataarray.length;
		var locationtext;
		for (var i = 0; i < length; i++) {
			if(dataarray[i].country!="United States")
			{
				locationtext=" ("+dataarray[i].city +", " +dataarray[i].country+")";
			}
			else
			{
				locationtext=" ("+dataarray[i].city +", " +dataarray[i].state+")";
			}
			data+='<li  date="'+dataarray[i].postdate+'"><a class="joblink" href="'+dataarray[i].link+'"><h3>'+dataarray[i].jobtitle+'</h3><h4>'+dataarray[i].organization+locationtext+'</h4></a></li>';
		}
		data+='</ul>';
		//console.log(data);
		$("#resulttable").html(data);
    	//$("#pagelabel").html(datastring.find('span.step-links').html());
		/*$("#reslist").listview({
		    autodividers: true,
		    autodividersSelector: function (li) {
		        var out = li.attr('date');
		        return out;
		    }
		}).listview('refresh');*/
		$("body").removeClass("loading");
		//$.mobile.hidePageLoadingMsg();
		$("#jobcontainer").hide();
		$("#resultcontainer").show();
				
		//bind list links
		$(".joblink").bind("click", function(e){$("body").addClass("loading");changePage(this.getAttribute('href')); /*test = this;*/e.preventDefault(); return false;});
		} //end onsuccess
}); //end ajax 
}; //end function
//Create content for a search result
changePage = function(joburl) {
	//$("#jobtext").load(joburl+" div#main");
	console.log("startajax to change page");
	$("body").addClass("loading");
	
	$.ajax({
    url: joburl,
    type: 'GET',
    success: function(res) {
		//console.log("Ajax success");
		//console.log(res);
	 datastring = $(res).find('div#main');
	// console.log(datastring);
	$("#jobtext").html(datastring);
	$("#jobtext a").bind("click", function(e){loadURL(this.getAttribute('href')); /*test = this;*/e.preventDefault(); return false;});
	$("#jobcontainer").show();
	$("#resultcontainer").hide();
	$("body").removeClass("loading");
	}
	});
}

	function loadURL(url){navigator.app.loadUrl(url, { openExternal:true });} 

part2=function(){
	  //Hide state and country input fields
		$("#countrydiv").hide();
		$("#statediv").hide();	
		addForm(); // Add listeners and functionality
		//Start a search
		updateSearch("http://www.peacecorps.gov/resources/returned/careerlink/jobs/?location_macro=&classification=&keyword_search=",1);
		searchstring="http://www.peacecorps.gov/resources/returned/careerlink/jobs/?location_macro=&classification=&keyword_search=";
		$('#nextbutton').addClass('ui-disabled');
		  $('#nextbutton').attr("disabled","true");
		$('#prevbutton').addClass('ui-disabled')
		$('#prevbutton').attr("disabled","true");
		
};