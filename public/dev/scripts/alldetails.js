// *******************************************************************************
// SCRIPT : alldetails.js
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
    document_ID = params['detail1'];
    filter = params['detail2'];
    extra = params['detail3'];
  }

  displayOutput(coll_name + ' , ' + filter + ' , ' + extra)


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

  await db.collection(coll_base_path + coll_lang + '/' + coll_name).doc(docID).get()
    .then(doc => {
      if (!doc.exists) {
        showAlert('No Record Found!!');
        hidePleaseWait()

      } else {
        displayOutput(docID + ' - Document data Read Done.');
        allDocCmpData[docID] = doc.data()

        updateHTMLPage()
      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);

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

  hidePleaseWait()

  // HTML Modification functions
  document.getElementById("header_section").style.display = 'block';
  document.getElementById("main_section").style.display = 'block';
  updateCardLayout('col_section_1')


}

// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

// Model Layout Configuration
function getModelLayoutConfig(mdl_coll){

  /*
  show_model_base_header = true
  show_model_base_button = true
  header_text_layout_position = 'center'
  header_button_layout_position = 'center'
  */

 switch (mdl_coll) {
  case "DESTINATIONS":
    return [false,false,'left','center']
    
  case "PACKAGES":
    return [false,false,'left','center']

  default:
    return [true,false,'left','center']
}

  
    
}

// Update Header Image
function updateCardLayout(htmlID) {

  // -------------- Update Layout -----------------------
  var base_layout = ''
  var base_title = ''
  var model_layout = ''


  switch (document_ID) {
    case "DESTINATIONS":
      base_layout = 'CARD_ROW'
      model_layout = 'SQUARE_CARD_IMAGE'
      base_title = ''

      // Here also you can update other html pages also
      $("#banner_main_header").html("Best Destinations");
      //$("#banner_small_header").html("Enjoy your choice");
      $("#heading_title").html("Destinations");

      document.getElementById('banner_main_image').src = getDirectImageUrl("Images/destinations_bkg.jpg")

      
      break;

    case "PACKAGES":
      base_layout = 'CARD_ROW'
      model_layout = 'SQUARE_CARD'
      base_title = ''

      // Here also you can update other html pages also

      $("#banner_main_header").html("Best Packages");
      //$("#banner_small_header").html("Enjoy your choice");
      $("#heading_title").html("Packages");

      document.getElementById('banner_main_image').src = getDirectImageUrl("Images/packages_bkg.jpg")

      break;

    default:
      displayOutput("Default");
  }

  // ----------------------------------------------------

  var coll_list_data = allDocCmpData[document_ID]


  var each_list_ref_div_content = '';

  // Read Each Document details and create lsit view 
  for (each_doc_id in coll_list_data) {

    var doc_data = coll_list_data[each_doc_id]

    // Create Layout according to the Model Layouts  
    var currentmdlContent = modelLayoutSelector_local(model_layout, doc_data, 'STATICPAGE,eachdetails,' + document_ID + ',' + each_doc_id + ',NA')
    each_list_ref_div_content += currentmdlContent

  }

  // Get BASE Layout content 
  var base_layout_content = getBaseLayoutHTML_local(model_layout,base_layout, base_title, each_list_ref_div_content)


  // Update HTML Page
  $("#" + htmlID).html(base_layout_content);
}

// ****************************************************************
// Create complete content according to your inputs
// Here you can do modification
function getCompleteModelContentDetails(doc_details) {

  var html_div_line = ''
  // Change According to the document_ID 

  switch (document_ID) {
    case "DESTINATIONS":

      var header = doc_details['INFO2']
      var content = doc_details['INFO2']

      html_div_line = '<b>' + header

      break;

    case "PACKAGES":

      var header = doc_details['INFO1']
      var sub_header = doc_details['INFO11']
      var ratings = doc_details['INFO66']
      var price = doc_details['INFO7']
      var cut_price = doc_details['INFO8']
     
      // Update Ratings
      //ratings = '2.5#(18,560)'
      if(!ratings.includes("#")) {
        ratings = '1#(1)'
      }


      var rating_num = ratings.split('#')[0]
      
      var ratings_line = ''
      for (i = 0; i < Number(rating_num.split('.')[0]); i++) {
        //ratings_line += '<i class="fas fa-star text-warning"></i>';
        ratings_line += '<i class="material-icons">star</i>';
      }

      if(rating_num.includes(".5")) {
        ratings_line += '<i class="material-icons">star_half</i>';
      }

      ratings_line += rating_num + ' ' + ratings.split('#')[1]




      html_div_line = '<div><p style="font-size: 30px;">'+ header +'</p>\
                  <p class="card-text" style="font-size: 11px;">'+ sub_header +'</p>\
                  <p><small class="text-muted">' +  ratings_line  + '\
                      </small>\
                  <br>\
                  <span class="right"> \
                    <small style="text-decoration: line-through; class="text-muted">\
                      ($'+ cut_price +')</small><small style="font-size: 40px;">$'+ price +'</small></span>\
                      <br>\
                </p></div>';
      break;

    default:
      displayOutput("No Document found");
      html_div_line = ''
  }

  return html_div_line
}

// *****************************************************************

// ----------------------------------------------------------------
// ----------- MDOEL Layout's -------------------------------------

// Model Layout Selector - Local
function modelLayoutSelector_local(mdl_layout, doc_details, mdl_action_details) {

  var mdl_html_line = ''

  //Information Details
  var complete_content = getCompleteModelContentDetails(doc_details)

  var mdl_map_details = {}
  mdl_map_details['ID'] = doc_details['ID']
  mdl_map_details['IMAGE'] = doc_details['IMAGE']
  mdl_map_details['CONTENT'] = complete_content
  mdl_map_details['ACTION'] = mdl_action_details


  // SQUARE_CARD_HORIZ Layout
  if (mdl_layout == 'SQUARE_CARD_HORIZ') {

    mdl_html_line = modelLytSquareHoriCard_local(mdl_map_details)
  }

  // SQUARE_CARD Layout
  if (mdl_layout == 'SQUARE_CARD') {

    mdl_html_line = modelLytSquareCard_local(mdl_map_details)
  }

  // SQUARE_CARD Layout
  if (mdl_layout == 'SQUARE_CARD_IMAGE') {

    mdl_html_line = modelLytSquareCardImage_local(mdl_map_details)
  }

  return mdl_html_line;

}

// Model Square Card Horizontal - Local
function modelLytSquareHoriCard_local(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT'] 

  var htmlLine = '<div class="col s12 m7"><a href="' + clickHandling(mdl_map_details) + '">\
            <div class="card horizontal hoverable">\
              <div class="card-image">\
                <img src="' + getModelImageRef(image_ref) + '">\
              </div>\
              <div class="card-stacked">\
                <div class="card-content">\
                  <span class="blue-grey-text text-lighten-2">' + complete_content + '</span>\
                </div>\
              </div>\
            </div>\
          </a>\
        </div>';

  return htmlLine;

}

// Model Square Card - Local
function modelLytSquareCard_local(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT'] 

  var htmlLine = '<div class="col s12 m4"><a href="' + clickHandling(mdl_map_details) + '">\
                  <div class="card hoverable" style="border-radius: 25px;">\
                    <div class="card-image z-depth-2" style="border-radius: 25px 25px 0px 0px;">\
                      <img src="' + getModelImageRef(image_ref) + '" style="height: 200px; max-height: 200px; border-radius: 25px 25px 0px 0px;">\
                    </div>\
                    <div class="red-card-content white-text" style="border-radius: 0px 0px 25px 25px;">\
                      <div class="card-content white-text">' + complete_content + '</div>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

// Model Square Card with Image Only - Local
function modelLytSquareCardImage_local(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT'] 

  var htmlLine = '<div class="col s12 m6"><a href="' + clickHandling(mdl_map_details) + '">\
  <div class="card hoverable" style="border-radius: 25px;">\
    <div class="card-image" style="border-radius: 25px;">\
      <img src="' + getModelImageRef(image_ref) + '" style="height: 250px; max-height: 250px; border-radius: 25px;">\
      <span class="card-title">' + complete_content + '</span>\
    </div></div>\
</a>\
</div>';         

  return htmlLine;

}

// Create Base Layout - Local
function getBaseLayoutHTML_local(mdl_coll,base_layout, header, model_content) {

  var base_layout_html = ''

  var show_model_base_header = true
  var show_model_base_button = true
  var header_text_layout_position = 'center'
  var header_button_layout_position = 'center'

  // **********************************************************************
  // ---------------------- CARD_ROW -------------------------------
  // *********************************************************************

  if (base_layout == 'CARD_ROW') {
    
    // ------------- Configuration -------------------------
    var mdl_lyt_config = getModelLayoutConfig(mdl_coll)
    show_model_base_header = mdl_lyt_config[0]
    show_model_base_button = mdl_lyt_config[1]
    header_text_layout_position = mdl_lyt_config[2]
    header_button_layout_position = mdl_lyt_config[3]
    // -----------------------------------------------------

    base_layout_html = '<div class="row">\
                    <div class="col s12 ' + header_text_layout_position + '">\
                      </div>\
                  </div><div class="row">' + model_content + '</div>';
  }


  // **********************************************************************
  // ---------------------- CARD_ROW_HORIZ -------------------------------
  // **********************************************************************

  if (base_layout == 'CARD_ROW_HORIZ') {

     // ------------- Configuration -------------------------
     var mdl_lyt_config = getModelLayoutConfig(mdl_coll)
    show_model_base_header = mdl_lyt_config[0]
    show_model_base_button = mdl_lyt_config[1]
    header_text_layout_position = mdl_lyt_config[2]
    header_button_layout_position = mdl_lyt_config[3]
     // -----------------------------------------------------
     base_layout_html = '<div class="row">\
                    <div class="col s12 ' + header_text_layout_position + '">\
                    </div>\
                  </div>' + model_content;    

  }


  return base_layout_html;


}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  $(document).ready(function () {
    $('.modal').modal();
  });

}

