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
    return [true,false,'left','center']
    
  case "PACKAGES":
    return [true,false,'left','center']

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
      base_title = 'All Destinations'

      // Here also you can update other html pages also
      $("#banner_main_header").html("Best Destinations");
      $("#banner_small_header").html("Enjoy your choice");

      document.getElementById('banner_main_image').src = getDirectImageUrl("Images/destinations_bkg.jpg")

      
      break;

    case "PACKAGES":
      base_layout = 'CARD_ROW'
      model_layout = 'SQUARE_CARD'
      base_title = 'All Packages'

      // Here also you can update other html pages also

      $("#banner_main_header").html("Best Packages");
      $("#banner_small_header").html("Enjoy your choice");

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
    var currentmdlContent = modelLayoutSelector_local(model_layout, doc_data, 'NEWPAGE,eachdetails,' + document_ID + ',' + each_doc_id + ',NA')
    each_list_ref_div_content += currentmdlContent

  }

  // Get BASE Layout content 
  var base_layout_content = getBaseLayoutHTML(model_layout,base_layout, base_title, each_list_ref_div_content)


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
        ratings_line += '<i class="fas fa-star text-warning"></i>';
      }

      if(rating_num.includes(".5")) {
        ratings_line += '<i class="fas fa-star-half text-warning"></i>';
      }

      ratings_line += rating_num + ' ' + ratings.split('#')[1]




      html_div_line = '<div class="black-text"><h6>'+ header +'</h6>\
                  <p class="card-text" style="font-size: 11px;">'+ sub_header +'</p>\
                  <p><small class="text-muted">' +  ratings_line  + '\
                      </small>\
                  <br>\
                  <span class="right"> \
                    <small style="text-decoration: line-through;" class="text-muted">\
                      ($'+ cut_price +')</small>$'+ price +' </span>\
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

// Model Layout Selector
function modelLayoutSelector_local(mdl_layout, doc_details, mdl_action_details) {

  var mdl_html_line = ''

  //Information Details
  var complete_content = getCompleteModelContentDetails(doc_details)


  // SQUARE_CARD_HORIZ Layout
  if (mdl_layout == 'SQUARE_CARD_HORIZ') {

    mdl_html_line = modelLytSquareHoriCard_local(
      doc_details['IMAGE'],
      complete_content,
      mdl_action_details
    )
  }

  // SQUARE_CARD Layout
  if (mdl_layout == 'SQUARE_CARD') {

    mdl_html_line = modelLytSquareCard_local(
      doc_details['IMAGE'],
      complete_content,
      mdl_action_details
    )
  }

  // SQUARE_CARD Layout
  if (mdl_layout == 'SQUARE_CARD_IMAGE') {

    mdl_html_line = modelLytSquareCardImage_local(
      doc_details['IMAGE'],
      complete_content,
      mdl_action_details
    )
  }

  return mdl_html_line;

}

// Model Square Card Horizontal
function modelLytSquareHoriCard_local(image_ref, complete_content, mdl_action_details) {

  var htmlLine = '<div class="col s12 m7"><a href="' + clickHandling(mdl_action_details.split(',')[0], mdl_action_details.split(',')[1], mdl_action_details.split(',')[2], mdl_action_details.split(',')[3], mdl_action_details.split(',')[4]) + '">\
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

// Model Square Card
function modelLytSquareCard_local(image_ref, complete_content, mdl_action_details) {

  var htmlLine = '<div class="col s12 m4"><a href="' + clickHandling(mdl_action_details.split(',')[0], mdl_action_details.split(',')[1], mdl_action_details.split(',')[2], mdl_action_details.split(',')[3], mdl_action_details.split(',')[4]) + '">\
                  <div class="card hoverable">\
                    <div class="card-image">\
                      <img src="' + getModelImageRef(image_ref) + '">\
                    </div>\
                    <div class="card-content">\
                      <span class="blue-grey-text text-lighten-2">' + complete_content + '</span>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

// Model Square Card with Image Only
function modelLytSquareCardImage_local(image_ref, complete_content, mdl_action_details) {

  var htmlLine = '<div class="col s12 m6"><a href="' + clickHandling(mdl_action_details.split(',')[0], mdl_action_details.split(',')[1], mdl_action_details.split(',')[2], mdl_action_details.split(',')[3], mdl_action_details.split(',')[4]) + '">\
                  <div class="card hoverable">\
                    <div class="card-image">\
                      <img src="' + getModelImageRef(image_ref) + '">\
                      <span class="card-title">' + complete_content + '</span>\
                    </div></div>\
                </a>\
              </div>';            

  return htmlLine;

}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  $(document).ready(function () {
    $('.modal').modal();
  });

}

