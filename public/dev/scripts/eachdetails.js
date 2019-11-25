// *******************************************************************************
// SCRIPT : eachdetails.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = basePath

if (is_production_mode) {
  coll_base_path = baseProductionPath
}

// -------- Link Page with Collection and Documents -----
var coll_lang = 'CORE';
var coll_name = 'LIST_DATA';
var document_ID = 'NA';
var filter = 'NA';
var extra = 'NA';

// Global Data variables
// All documents data
var allDocCmpData = {}

// Mapping Data
var mainDocMapDetails = {}
var docMapDetails = {}

// ***********************************************

// ***********************************************
// ----------- Read Parameters -------------------
function getParams() {
  // Read Parameters
  displayOutput('Read Parameters ...')
  var idx = document.URL.indexOf('?');
  var params = new Array();
  if (idx != -1) {
    var pairs = document.URL.substring(idx + 1, document.URL.length).split('&');
    for (var i = 0; i < pairs.length; i++) {
      nameVal = pairs[i].split('=');
      params[nameVal[0]] = nameVal[1];
    }
  }
  displayOutput(params);

  // ------- Update Variables ------------
  if ('detail1' in params) {
    coll_name = params['detail1'];
    document_ID = params['detail2'];
    extra = params['detail3'];
  }

  displayOutput(coll_name + ' , ' + document_ID + ' , ' + extra)


}

// *************************************************
// Read Data form Database and create HTML Page
// *************************************************
function readCompleateCollection() {

  showPleaseWait();

  var totaldocCount = 0;

  db.collection(coll_base_path + coll_lang + '/' + coll_name).get().then((querySnapshot) => {
    displayOutput("SIZE : " + querySnapshot.size);

    if (querySnapshot.size == 0) {
      // ------ No Details Present -------------  
      displayOutput('No Record Found !!')
      hidePleaseWait();

    } else {

      totaldocCount = querySnapshot.size
      var docCount = 0;

      // Read Each Documents
      querySnapshot.forEach((doc) => {
        displayOutput(`${doc.id} =>`, doc.data());

        allDocCmpData[doc.id] = doc.data()

        // Check Document count
        docCount++;
        if (totaldocCount == docCount) {
          hidePleaseWait();
        }

      });

      // Update HTML Page
      updateHTMLPage();

    }

  });

} // EOF


// Read Document Data in async mode
async function readDocumentDataAsync(docID) {

  showPleaseWait()

  await db.collection(coll_base_path + coll_lang + '/' + coll_name + '_DATA').doc(docID).get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');
        hidePleaseWait()

      } else {
        displayOutput(docID + ' - Document data Read Done.');
        allDocCmpData[docID] = doc.data()

      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);
      displayOutput(err)

      hidePleaseWait()
    });


  // ------------- Read MAIN Document --------------
  await db.collection(coll_base_path + coll_lang + '/' + coll_name + '_DATA').doc('MAIN').get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');

        hidePleaseWait()

      } else {
        displayOutput('MAIN - Document data Read Done.');
        allDocCmpData['MAIN'] = doc.data()

        // Update Mapping Data set
        if (coll_name == 'DESTINATIONS') {
          updateMappingDetails_D(docID)
        } else if (coll_name == 'PACKAGES') {
          updateMappingDetails_P(docID)
        }


        hidePleaseWait()

        updateHTMLPage()

      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);
      displayOutput(err)

      hidePleaseWait()
    });

}


// ******************************************************
// --------------- START UP CODE -----------------------
// Call Function when page loaded
// ******************************************************

startUpCalls();

// Get Parameters details
getParams();

// Read All Documents from Collection
//readCompleateCollection();

// Async Mode
readDocumentDataAsync(document_ID)

// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage() {

  displayOutput(allDocCmpData)
  displayOutput(mainDocMapDetails)
  displayOutput(docMapDetails)

  // HTML Modification functions  
  if (coll_name == 'DESTINATIONS') {
    document.getElementById("col_section_1").style.display = 'block';
    document.getElementById("header_section").style.display = 'block';
    document.getElementById("header_btn_options").style.display = 'none';

    genHTMLContentType1('col_section_1')

  } else if (coll_name == 'PACKAGES') {
    document.getElementById("col_section_2").style.display = 'block';
    document.getElementById("header_section").style.display = 'block';

    genHTMLContentType2('col_section_2')

  }

  startUpCalls()



}

// Show Details in Model
// Show Review Details
function viewReviewDetails() {
  viewModel('All Review' ,'All Review Content')
}

// Show Overview details
function viewOverview() {

  if(coll_name == 'DESTINATIONS') {
    viewModel('Overview' ,getInfoDetails("Description"))
  } else if(coll_name == 'PACKAGES') {
    viewModel('Overview' ,getInfoDetails("Overview"))
  }
 
}


// *******************************************************
// --------------- Mapping Functions ---------------------
// Generate Map function from Collection Options
// Paste complete code here
// Format code using shift+alt+F

// <<<<<<<<<<<<<<<<<< CODE SECTION START >>>>>>>>>>>>>>>>>>>>>>>>>>>>

//**************** Mapping Function ***************************
// Update Mapping Data Sets details
function updateMappingDetails_D(docID) {
  if("MAIN" in allDocCmpData) {
    mainDocMapDetails["ID"] = allDocCmpData["MAIN"]["INFO0"]
    mainDocMapDetails["NAME"] = allDocCmpData["MAIN"]["INFO1"]
    mainDocMapDetails["DESC"] = allDocCmpData["MAIN"]["INFO2"]
    mainDocMapDetails["VISIBLE"] = allDocCmpData["MAIN"]["INFO3"]
    mainDocMapDetails["OWNER"] = allDocCmpData["MAIN"]["INFO4"]
    mainDocMapDetails["LINKS"] = allDocCmpData["MAIN"]["INFO5"]
    mainDocMapDetails["TDOC"] = allDocCmpData["MAIN"]["INFO6"]
    mainDocMapDetails["ADMIN"] = allDocCmpData["MAIN"]["INFO7"]
    mainDocMapDetails["IMAGE_TAB"] = allDocCmpData["MAIN"]["INFO8"]
    mainDocMapDetails["MULTI_TAB"] = allDocCmpData["MAIN"]["INFO9"]
    mainDocMapDetails["FORM_TAB"] = allDocCmpData["MAIN"]["INFO10"]
    mainDocMapDetails["COLL_DOC"] = allDocCmpData["MAIN"]["INFO11"]
    mainDocMapDetails["DOC_PBLS"] = allDocCmpData["MAIN"]["INFO12"]
    mainDocMapDetails["DOC_LIST"] = allDocCmpData["MAIN"]["INFO13"]
    mainDocMapDetails["DEF_IMG"] = allDocCmpData["MAIN"]["INFO14"]
    mainDocMapDetails["LIST_REF_INFO"] = allDocCmpData["MAIN"]["INFO15"]
    mainDocMapDetails["IMAGE_INFO"] = allDocCmpData["MAIN"]["INFO16"]
    mainDocMapDetails["IMAGE_PRO_INFO"] = allDocCmpData["MAIN"]["INFO17"]
    mainDocMapDetails["MULTI_INFO"] = allDocCmpData["MAIN"]["INFO18"]
    mainDocMapDetails["FORM_INFO"] = allDocCmpData["MAIN"]["INFO19"]
    mainDocMapDetails["COMMON_DATA"] = allDocCmpData["MAIN"]["INFO20"]
  } else {
    displayOutput("MAIN Doc details is not found !!")
  }





if(docID in allDocCmpData) {
docMapDetails["id"] = allDocCmpData[docID]["INFO0"]
docMapDetails["price"] = allDocCmpData[docID]["INFO10"]
docMapDetails["cut_price"] = allDocCmpData[docID]["INFO11"]
docMapDetails["reach_details"] = allDocCmpData[docID]["INFO12"]
docMapDetails["packages_details"] = docID + "#INFO13"
docMapDetails["places_details"] = docID + "#INFO14"
docMapDetails["review_details"] = docID + "#INFO15"
docMapDetails["name"] = allDocCmpData[docID]["INFO2"]
docMapDetails["catageory"] = allDocCmpData[docID]["INFO3"]
docMapDetails["district"] = allDocCmpData[docID]["INFO30"]
docMapDetails["activities"] = allDocCmpData[docID]["INFO31"]
docMapDetails["ratings"] = allDocCmpData[docID]["INFO32"]
docMapDetails["tags"] = allDocCmpData[docID]["INFO4"]
docMapDetails["country"] = allDocCmpData[docID]["INFO5"]
docMapDetails["state"] = allDocCmpData[docID]["INFO6"]
docMapDetails["places"] = allDocCmpData[docID]["INFO7"]
docMapDetails["best_times"] = allDocCmpData[docID]["INFO8"]
docMapDetails["description"] = allDocCmpData[docID]["INFO9"]

// MAP Development and Production Image correctly .....
if(is_production_mode) {

// IMAGES Production Information

docMapDetails["image_1"] = docID + "#INFO17"
docMapDetails["image_2"] = docID + "#INFO19"
docMapDetails["image_3"] = docID + "#INFO21"
docMapDetails["image_4"] = docID + "#INFO23"
docMapDetails["image_5"] = docID + "#INFO25"
docMapDetails["image_6"] = docID + "#INFO27"
docMapDetails["model"] = docID + "#INFO29"

} else {
// IMAGES Information

docMapDetails["image_1"] = docID + "#INFO16"
docMapDetails["image_2"] = docID + "#INFO18"
docMapDetails["image_3"] = docID + "#INFO20"
docMapDetails["image_4"] = docID + "#INFO22"
docMapDetails["image_5"] = docID + "#INFO24"
docMapDetails["image_6"] = docID + "#INFO26"
docMapDetails["model"] = docID + "#INFO28"

}    
} else {
    displayOutput(docID + " Data not found !!")
}
}
//**************** END ***************************


//**************** Mapping Function ***************************
// Update Mapping Data Sets details
function updateMappingDetails_P(docID) {
  if("MAIN" in allDocCmpData) {
    mainDocMapDetails["ID"] = allDocCmpData["MAIN"]["INFO0"]
    mainDocMapDetails["NAME"] = allDocCmpData["MAIN"]["INFO1"]
    mainDocMapDetails["DESC"] = allDocCmpData["MAIN"]["INFO2"]
    mainDocMapDetails["VISIBLE"] = allDocCmpData["MAIN"]["INFO3"]
    mainDocMapDetails["OWNER"] = allDocCmpData["MAIN"]["INFO4"]
    mainDocMapDetails["LINKS"] = allDocCmpData["MAIN"]["INFO5"]
    mainDocMapDetails["TDOC"] = allDocCmpData["MAIN"]["INFO6"]
    mainDocMapDetails["ADMIN"] = allDocCmpData["MAIN"]["INFO7"]
    mainDocMapDetails["IMAGE_TAB"] = allDocCmpData["MAIN"]["INFO8"]
    mainDocMapDetails["MULTI_TAB"] = allDocCmpData["MAIN"]["INFO9"]
    mainDocMapDetails["FORM_TAB"] = allDocCmpData["MAIN"]["INFO10"]
    mainDocMapDetails["COLL_DOC"] = allDocCmpData["MAIN"]["INFO11"]
    mainDocMapDetails["DOC_PBLS"] = allDocCmpData["MAIN"]["INFO12"]
    mainDocMapDetails["DOC_LIST"] = allDocCmpData["MAIN"]["INFO13"]
    mainDocMapDetails["DEF_IMG"] = allDocCmpData["MAIN"]["INFO14"]
    mainDocMapDetails["LIST_REF_INFO"] = allDocCmpData["MAIN"]["INFO15"]
    mainDocMapDetails["IMAGE_INFO"] = allDocCmpData["MAIN"]["INFO16"]
    mainDocMapDetails["IMAGE_PRO_INFO"] = allDocCmpData["MAIN"]["INFO17"]
    mainDocMapDetails["MULTI_INFO"] = allDocCmpData["MAIN"]["INFO18"]
    mainDocMapDetails["FORM_INFO"] = allDocCmpData["MAIN"]["INFO19"]
    mainDocMapDetails["COMMON_DATA"] = allDocCmpData["MAIN"]["INFO20"]
  } else {
    displayOutput("MAIN Doc details is not found !!")
  }





if(docID in allDocCmpData) {
docMapDetails["id"] = allDocCmpData[docID]["INFO0"]
docMapDetails["name"] = allDocCmpData[docID]["INFO1"]
docMapDetails["catageory"] = allDocCmpData[docID]["INFO10"]
docMapDetails["tags"] = allDocCmpData[docID]["INFO11"]
docMapDetails["destination_id"] = allDocCmpData[docID]["INFO12"]
docMapDetails["country"] = allDocCmpData[docID]["INFO13"]
docMapDetails["state"] = allDocCmpData[docID]["INFO14"]
docMapDetails["district"] = allDocCmpData[docID]["INFO15"]
docMapDetails["difficulty"] = allDocCmpData[docID]["INFO16"]
docMapDetails["highlights"] = allDocCmpData[docID]["INFO17"]
docMapDetails["overview"] = allDocCmpData[docID]["INFO18"]
docMapDetails["inclusions"] = allDocCmpData[docID]["INFO19"]
docMapDetails["days"] = allDocCmpData[docID]["INFO2"]
docMapDetails["exclusions"] = allDocCmpData[docID]["INFO20"]
docMapDetails["to_take"] = allDocCmpData[docID]["INFO21"]
docMapDetails["organiser"] = allDocCmpData[docID]["INFO22"]
docMapDetails["map"] = allDocCmpData[docID]["INFO23"]
docMapDetails["places_list"] = docID + "#INFO24"
docMapDetails["review_list"] = docID + "#INFO25"
docMapDetails["hotels"] = allDocCmpData[docID]["INFO3"]
docMapDetails["hotel_star"] = allDocCmpData[docID]["INFO4"]
docMapDetails["hotel_image"] = allDocCmpData[docID]["INFO5"]
docMapDetails["itinerary_1d"] = docID + "#INFO56"
docMapDetails["itinerary_2d"] = docID + "#INFO57"
docMapDetails["itinerary_3d"] = docID + "#INFO58"
docMapDetails["itinerary_4d"] = docID + "#INFO59"
docMapDetails["routes"] = allDocCmpData[docID]["INFO6"]
docMapDetails["itinerary_5d"] = docID + "#INFO60"
docMapDetails["itinerary_6d"] = docID + "#INFO61"
docMapDetails["itinerary_7d"] = docID + "#INFO62"
docMapDetails["district"] = allDocCmpData[docID]["INFO64"]
docMapDetails["activities"] = allDocCmpData[docID]["INFO65"]
docMapDetails["ratings"] = allDocCmpData[docID]["INFO66"]
docMapDetails["best_time"] = allDocCmpData[docID]["INFO67"]
docMapDetails["cities"] = allDocCmpData[docID]["INFO68"]
docMapDetails["price"] = allDocCmpData[docID]["INFO7"]
docMapDetails["cut_price"] = allDocCmpData[docID]["INFO8"]
docMapDetails["includes"] = allDocCmpData[docID]["INFO9"]

// MAP Development and Production Image correctly .....
if(is_production_mode) {

// IMAGES Production Information

docMapDetails["image_1"] = docID + "#INFO27"
docMapDetails["image_2"] = docID + "#INFO29"
docMapDetails["image_3"] = docID + "#INFO31"
docMapDetails["image_4"] = docID + "#INFO33"
docMapDetails["image_5"] = docID + "#INFO35"
docMapDetails["itinerary_1"] = docID + "#INFO37"
docMapDetails["itinerary_2"] = docID + "#INFO39"
docMapDetails["itinerary_3"] = docID + "#INFO41"
docMapDetails["itinerary_4"] = docID + "#INFO43"
docMapDetails["itinerary_5"] = docID + "#INFO45"
docMapDetails["itinerary_6"] = docID + "#INFO47"
docMapDetails["itinerary_7"] = docID + "#INFO49"
docMapDetails["model"] = docID + "#INFO51"
docMapDetails["image_7"] = docID + "#INFO53"
docMapDetails["image_8"] = docID + "#INFO55"

} else {
// IMAGES Information

docMapDetails["image_1"] = docID + "#INFO26"
docMapDetails["image_2"] = docID + "#INFO28"
docMapDetails["image_3"] = docID + "#INFO30"
docMapDetails["image_4"] = docID + "#INFO32"
docMapDetails["image_5"] = docID + "#INFO34"
docMapDetails["itinerary_1"] = docID + "#INFO36"
docMapDetails["itinerary_2"] = docID + "#INFO38"
docMapDetails["itinerary_3"] = docID + "#INFO40"
docMapDetails["itinerary_4"] = docID + "#INFO42"
docMapDetails["itinerary_5"] = docID + "#INFO44"
docMapDetails["itinerary_6"] = docID + "#INFO46"
docMapDetails["itinerary_7"] = docID + "#INFO48"
docMapDetails["model"] = docID + "#INFO50"
docMapDetails["image_7"] = docID + "#INFO52"
docMapDetails["image_8"] = docID + "#INFO54"

}    
} else {
    displayOutput(docID + " Data not found !!")
}
}
//**************** END ***************************

// <<<<<<<<<<<<<<<<< CODE SECTION END >>>>>>>>>>>>>>>>>>>>>

// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

// --------- Update Model Content ------------------------------- 
// Model Layout Configuration
function getModelLayoutConfig(mdl_coll){

  /*
  show_model_base_header = true
  show_model_base_button = true
  header_text_layout_position = 'center'
  header_button_layout_position = 'center'
  */

    return [true,true,'center','center']  
    
}

// Get Info details
function getInfoDetails(key) {
  return docMapDetails[getKeyDetails(key)]
}

// Create Model Content
function getModelCompleteContent(mdl_coll, all_doc_info_list, doc_data) {

  var html_div_line = ''  

  var header = doc_data[all_doc_info_list[0]]
  var sub_header = doc_data[all_doc_info_list[1]]
  var ratings = doc_data[all_doc_info_list[2]]
  var price = doc_data[all_doc_info_list[3]]
  var cut_price = doc_data[all_doc_info_list[4]]

  //html_div_line = '<b>' + header + '</b><br>' + content + '<br>' + content_1

  // Update Ratings
  //ratings = '2.5#(18,560)'
  if(!ratings.includes("#")) {
    ratings = '1#(1)'
  }


  var rating_num = ratings.split('#')[0]
      
      var ratings_line = ''
      for (i = 0; i < Number(rating_num.split('.')[0]); i++) {
        //ratings_line += '<i class="fas fa-star text-warning"></i>';
        ratings_line += '<i class="material-icons orange-text">star</i>';
      }

      if(rating_num.includes(".5")) {
        ratings_line += '<i class="material-icons orange-text">star_half</i>';
      }

     // ratings_line += rating_num + ' ' + ratings.split('#')[1]




      html_div_line = '<div><p style="font-size: 20px;">'+ header +'</p>\
      <p class="card-text" style="font-size: 10px;">'+ sub_header +'</p>\
      <p><small class="text-muted">' +  ratings_line  + '\
          </small>\
      <br>\
      <span class="right"> \
        <small style="text-decoration: line-through; class="text-muted">\
          ($'+ cut_price +')</small><small style="font-size: 20px;">$'+ price +'</small></span>\
          <br>\
    </p></div>';

   

  return html_div_line

}

// Create HTML Content Type 1
function genHTMLContentType1() {
  displayOutput('>>> Create HTML Content Type 1')    
 
   // Update header Images
   document.getElementById('banner_main_image').src = getImageUrl(getInfoDetails("Image 1"))

   // Update Image View
   updateImageView("dest_image_view",["Image 1","Image 2","Image 3","Image 4","Image 5"])

   // Get All Header Details
  let headerData = getHashDataList(mainDocMapDetails["COMMON_DATA"]) 
  
  $("#dest_header_1").html(headerData["HEADER_1"]);
  $("#dest_header_2").html(headerData["HEADER_2"]);
  $("#dest_header_3").html(headerData["HEADER_3"]);
  $("#dest_header_4").html(headerData["HEADER_4"]);
  $("#dest_header_5").html(headerData["HEADER_5"]);

  //$("#banner_main_header").html(getInfoDetails("Name"));
  //$("#banner_small_header").html(" ");
 
  // Update HTML Page Details getInfoDetails("Name")
  $("#dest_title").html(getInfoDetails("Name"));
  $("#dest_price").html('&#x20b9;' + getInfoDetails("Price"));
  $("#dest_best_time").html(getInfoDetails("Best Times"));  
  //$("#dest_ratings").html(getInfoDetails("Ratings"));
  $("#dest_description").html(getInfoDetails("Description"));

  // Update Activities
  var all_activities_list = getInfoDetails("Activities").split(',')

  var activities_html_line = ''
  for(each_act_idx in all_activities_list) {
    var act_name = all_activities_list[each_act_idx]
    activities_html_line += '<div class="chip"> \
                <img src="Images/default.jpg" alt="default"> '+ act_name +'</div>'
  }

  $("#dest_activities").html(activities_html_line);

  // Update List Ref Details
  getListRefDetails(getInfoDetails("Packages Details"), 'all_packages_list_ref')

}

// Create HTML Content Type 2
function genHTMLContentType2() {
  displayOutput('>>> Create HTML Content Type 2')

  // Update header Images
  document.getElementById('banner_main_image').src = getImageUrl(getInfoDetails("Image 1"))

  // Update Image View
  updateImageView("pkg_image_view",["Image 1","Image 2","Image 3","Image 4","Image 5"])


  // Get All Header Details
  let headerData = getHashDataList(mainDocMapDetails["COMMON_DATA"]) 
  
  //$("#pkg_header_1").html(headerData["HEADER_1"]);  - Price
  $("#pkg_header_2").html(headerData["HEADER_2"]);
  $("#pkg_header_3").html(headerData["HEADER_3"]);
  $("#pkg_header_4").html(headerData["HEADER_4"]);
  $("#pkg_header_5").html(headerData["HEADER_5"]);
  $("#pkg_header_6").html(headerData["HEADER_6"]);
  $("#pkg_header_7").html(headerData["HEADER_7"]);
  $("#pkg_header_8").html(headerData["HEADER_8"]);
  $("#pkg_header_9").html(headerData["HEADER_9"]);
  //$("#pkg_header_10").html(headerData["HEADER_10"]);
  $("#pkg_header_11").html(headerData["HEADER_11"]);
  $("#pkg_header_12").html(headerData["HEADER_12"]);
  $("#pkg_header_13").html(headerData["HEADER_13"]);
  $("#pkg_header_14").html(headerData["HEADER_14"]);
  $("#pkg_header_15").html(headerData["HEADER_15"]);
  $("#pkg_header_16").html(headerData["HEADER_16"]);
  $("#pkg_header_17").html(headerData["HEADER_17"]);

  // -------------------------------------------
  

  //$("#banner_main_header").html(getInfoDetails("Name"));
  //$("#banner_small_header").html(" ");

  // Update HTML Page Details
  $("#pkg_id").html(getInfoDetails("ID"));
  $("#pkg_title").html(getInfoDetails("Name"));
  $("#pkg_price").html('&#x20b9;' + getInfoDetails("Price"));
  if(getInfoDetails("Cut Price") != '0'){$("#pkg_cut_price").html('&#x20b9;' + getInfoDetails("Cut Price"));}
  $("#pkg_best_time").html(getInfoDetails("Best Time"));
  $("#pkg_days").html(getInfoDetails("Days"));
  $("#pkg_hotel_inc").html(getInfoDetails("Hotel Star"));
  $("#pkg_cities").html(getInfoDetails("Cities"));
  $("#pkg_ratings").html(getInfoDetails("Ratings").replace('#',','));

  // Update Activities
  var all_activities_list = getInfoDetails("Activities").split(',')

  var activities_html_line = ''
  for(each_act_idx in all_activities_list) {
    var act_name = all_activities_list[each_act_idx]
    activities_html_line += '<div class="chip"> \
                <img src="Images/default.jpg" alt="default"> '+ act_name +'</div>'
  }

  $("#pkg_activities").html(activities_html_line);

  // Update Includes
  var all_includes_list = getInfoDetails("Includes").split(',')

  var includes_html_line = ''
  for(each_incl_idx in all_includes_list) {
    var incl_name = all_includes_list[each_incl_idx]
    includes_html_line += '<div class="chip"> \
                <img src="Images/default.jpg" alt="default"> '+ incl_name +'</div>'
  }

  $("#pkg_includes").html(includes_html_line);


  $("#pkg_description").html(getInfoDetails("Overview"));

  // Update Highlights
  var highligts_details = getInfoDetails("Highlights")

  if(highligts_details == "NA") {
    document.getElementById("card_highlights").style.display = 'none';
  } else {  

  var all_highlights_list = highligts_details.split('#')

  var highlights_html_line = ''
  for(each_highl_idx in all_highlights_list) {
    if(each_highl_idx == 0){continue}
    var highl_name = all_highlights_list[each_highl_idx]
    highlights_html_line += '<blockquote>' + highl_name + '</blockquote>'
  }

  $("#pkg_highlights").html(highlights_html_line);
}


// Update Hotels Details
var hotel_details = getInfoDetails("Hotels")

$("#hotel_name").html(hotel_details.split('#')[1].split(':')[1].trim());
$("#hotel_days").html(hotel_details.split('#')[2].split(':')[1].trim());
$("#hotel_star").html(hotel_details.split('#')[3].split(':')[1].trim());

var extra_details = hotel_details.split('#')[4].split(':')[1].trim()
if(extra_details == "NA") {  
  document.getElementById("hotel_extra").style.display = 'none';
} else {
  $("#hotel_extra").html(extra_details);
}

var hotel_image_details = getImageUrl(getInfoDetails(getInfoDetails("Hotel Image")))
if(hotel_image_details != "NOK") {
  document.getElementById('hotel_image').src = hotel_image_details
} else {
  document.getElementById('hotel_image').src = getDirectImageUrl("Images/hotel_default.jpg")
}



// Update Inclusions
var all_inclusions_list = getInfoDetails("Inclusions").split('#')

  var inclusions_html_line = ''
  for(each_incl_idx in all_inclusions_list) {
    if(each_incl_idx == 0){continue}
    var incl_name = all_inclusions_list[each_incl_idx]
    inclusions_html_line += '<div class="collapsible-header grey lighten-4"><i class="material-icons">add</i>'+ incl_name +'</div>'
  }

  $("#pkg_inclusions").html(inclusions_html_line);


  // Update Inclusions
var all_exclusion_list = getInfoDetails("Exclusions").split('#')

var exclusion_html_line = ''
for(each_exincl_idx in all_exclusion_list) {
  if(each_exincl_idx == 0){continue}
  var exclu_name = all_exclusion_list[each_exincl_idx]
  exclusion_html_line += '<div class="collapsible-header grey lighten-4"><i class="material-icons">remove</i>'+ exclu_name +'</div>'
}

$("#pkg_exclusions").html(exclusion_html_line);


// Update Itinerary 
updateMultiInfoDetails(getInfoDetails("Itinerary 1D"),"itinerary_1")
updateMultiInfoDetails(getInfoDetails("Itinerary 2D"),"itinerary_2")
updateMultiInfoDetails(getInfoDetails("Itinerary 3D"),"itinerary_3")
updateMultiInfoDetails(getInfoDetails("Itinerary 4D"),"itinerary_4")
updateMultiInfoDetails(getInfoDetails("Itinerary 5D"),"itinerary_5")
updateMultiInfoDetails(getInfoDetails("Itinerary 6D"),"itinerary_6")
updateMultiInfoDetails(getInfoDetails("Itinerary 7D"),"itinerary_7")


// Update Bookmark Section
let bookmark_line ='<a href="#!" onclick="bookmarkHandling(\'' + getInfoDetails("ID")  + '\')"><i class="medium material-icons white-text">favorite_border</i></a>'
$("#pkg_bookmark_sec").html(bookmark_line);

}

// Get Multi Info details
function getMultiInfoDetails(id_details) {

var doc_id = id_details.split('#')[0]
var info_details = id_details.split('#')[1]

var multi_info_details = {}

multi_info_details["DAY"] =  allDocCmpData[doc_id][info_details+"_INFO1"]
multi_info_details["HEADER"] =  allDocCmpData[doc_id][info_details+"_INFO2"]
multi_info_details["TAGS"] =  allDocCmpData[doc_id][info_details+"_INFO3"]
multi_info_details["COMPLETE"] =  allDocCmpData[doc_id][info_details+"_INFO4"]
multi_info_details["IMAGE"] =  allDocCmpData[doc_id][info_details+"_INFO5"]
multi_info_details["STATUS"] =  allDocCmpData[doc_id][info_details+"_INFO6"]

 return multi_info_details

}

// Update Multi Info HTML Details
function updateMultiInfoDetails(id_details,html_tag) {

  var multi_details = getMultiInfoDetails(id_details)

  if(multi_details["STATUS"]) {

  $("#" + html_tag + "_day").html(multi_details["DAY"]);
  $("#" + html_tag + "_header").html(multi_details["HEADER"]);
  
 
  // Update Tags
  var all_tags_list = multi_details["TAGS"].split(',')

  var tags_html_line = ''
  for(each_tags_idx in all_tags_list) {
    var tag_name = all_tags_list[each_tags_idx]
    tags_html_line += '<div class="chip">'+ tag_name +'</div>'
  }

  $("#" + html_tag + "_tags").html(tags_html_line);


  // Update Body
var all_body_list = multi_details["COMPLETE"].split('#')

var body_html_line = ''
for(each_idx in all_body_list) {
  if(each_idx == 0){continue}
  var body_line = all_body_list[each_idx]
  body_html_line += '<blockquote>' + body_line + '</blockquote>'
}

// Update Image
var itnr_image_details = getImageUrl(getInfoDetails(multi_details["IMAGE"]))

if(itnr_image_details != "NOK") {
  body_html_line += '<br><img class="materialboxed" data-caption="Click on image to close it" width="250" src="' + itnr_image_details +'"></img>'
}

$("#" + html_tag + "_body").html(body_html_line);

  } else {
document.getElementById(html_tag).style.display = 'none';
  }

  

}

// Update Image View
function updateImageView(divID,imagesList) {
  var image_html_line = ''
  
  for(idx in imagesList) {

    var imageName = imagesList[idx]
    
    var imageDetails = getImageUrl(getInfoDetails(imageName))

    if(imageDetails != "NOK") {

      var imageDesc = getImageDesc(getInfoDetails(imageName))

      image_html_line += '<div class="col s12 m4">\
                  <div class="card">\
                    <div class="card-image">\
                        <img class="materialboxed" data-caption="Click on image to close it" src="' + imageDetails +'"> </div>\
                    <div class="card-content">\
                        <p style="font-size: 10px;">'+ imageDesc +'</p>\
                      </div></div>\
                </div>';

    } 

  } // for end

  if(image_html_line == '') {
    document.getElementById(divID+"_section").style.display = 'none';
  } else {
    $("#"+divID).html(image_html_line);
  }
  

 


}

// Book Mark Handling
function bookmarkHandling(details) {

  displayOutput('Bookmark ID : ' + details)

}


// ----------- START UP CALLS ----------------
function startUpCalls() {

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function(){
    $('.collapsible').collapsible();
  });

  /*
  $('.carousel.carousel-slider').carousel({
    fullWidth: true
  });
  */

  $(document).ready(function(){
    $('.tabs').tabs();
  });

  $(document).ready(function(){
    $('.materialboxed').materialbox();
  });

}

