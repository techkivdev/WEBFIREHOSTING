// *******************************************************************************
// SCRIPT : index.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// *********************************************
// ------------- CONFIGURATION ----------------
var basePath = '/DATABASE/DEVELOPMENT/PUBLIC/';
var baseProductionPath = '/DATABASE/PRODUCTION/PUBLIC/';

var imagebasePath = '/DATABASE/DEVELOPMENT/PUBLIC/';
var imagebaseProductionPath = '/DATABASE/PRODUCTION/PUBLIC/';

// ********************************************
// ------------ Mode Configuration -----------
// Debug Mode
var debug_mode = true

// Change Mode for Production or Development
var is_production_mode = false

// ---------- Main Variables ---------
var coll_base_path = basePath

if(is_production_mode) {
  coll_base_path = baseProductionPath
}

// -------- Link Page with Collection and Documents -----
var coll_lang = 'CORE';
var coll_name = 'COLLECTION2_DATA';
var user_role = 'DEV';
var document_ID = 'DOC0';

// Global Data variables
// All documents data
var allDocCmpData = {}

// Mapping Data
var mainDocMapDetails = {}
var docMapDetails = {}

// ********************************************

// ***********************************************
// ----------- Read Parameters -------------------
function getParams(){
	// Read Parameters
	displayOutput('Read Parameters ...')
	var idx = document.URL.indexOf('?');
	var params = new Array();
	if (idx != -1) {
		var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
		for (var i=0; i<pairs.length; i++){
			nameVal = pairs[i].split('=');
			params[nameVal[0]] = nameVal[1];
		}
	}
	displayOutput(params);
	
  // ------- Update Variables ------------
  if(params.size > 0) {
    coll_lang = params['lang_name'];
    coll_name = params['coll_name'];
    user_role = params['role'];
    document_ID = params['docID'];
  } 

  displayOutput(coll_lang +' , '+ coll_name + ' , ' + user_role + ' , ' + document_ID)
	
	
}

// *************************************************
// Read Data form Database and create HTML Page
// *************************************************
function readCompleateCollection() {

  showPleaseWait();
  
  var totaldocCount = 0;

	db.collection(coll_base_path+coll_lang+'/'+coll_name).get().then((querySnapshot) => {
    displayOutput("SIZE : " + querySnapshot.size);

        if(querySnapshot.size == 0) {
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
              if(totaldocCount == docCount) {
                 hidePleaseWait();
              }

            });

            // Update HTML Page
            updateHTMLPage();           

	   	  }
		
	});
	
} // EOF

// Read Only one Document Data
function readDocumentData(docID) {

  showPleaseWait()

  let getDoc = db.collection(coll_base_path+coll_lang+'/'+coll_name).doc(docID).get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');
        hidePleaseWait()

      } else {
        displayOutput('Document data Done.');
        allDocCmpData[docID] = doc.data()

        updateHTMLPage()

        hidePleaseWait()
      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);

      hidePleaseWait()
    });

}

// Read Document Data in async mode
async function readDocumentDataAsync(docID) {

  showPleaseWait()

  await db.collection(coll_base_path+coll_lang+'/'+coll_name).doc(docID).get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');
        hidePleaseWait()
       
      } else {
        displayOutput(docID + ' - Document data Read Done.');
        allDocCmpData[docID] = doc.data()

        mapDocumentDetails(docID)
      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);

      hidePleaseWait()
    });


    // ------------- Read MAIN Document --------------
    await db.collection(coll_base_path+coll_lang+'/'+coll_name).doc('MAIN').get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');

        hidePleaseWait()
       
      } else {
        displayOutput('MAIN - Document data Read Done.');
        allDocCmpData['MAIN'] = doc.data()

        mapMAINDocDetails()

        hidePleaseWait()

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

// Get Parameters details
getParams();

// Read All Documents from Collection
//readCompleateCollection();

// Read only one Document Data
//readDocumentData(document_ID);

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
  updateHeaderImages()
  

}

// *******************************************************
// --------------- Mapping Functions ---------------------

// MAP MAIN Document Details
function mapMAINDocDetails() {  

  if('MAIN' in allDocCmpData) {

    mainDocMapDetails['ID'] = allDocCmpData['MAIN']['INFO0']
    mainDocMapDetails['NAME'] = allDocCmpData['MAIN']['INFO1']
    mainDocMapDetails['DESC'] = allDocCmpData['MAIN']['INFO2']
    mainDocMapDetails['VISIBLE'] = allDocCmpData['MAIN']['INFO3']
    mainDocMapDetails['OWNER'] = allDocCmpData['MAIN']['INFO4']
    mainDocMapDetails['LINKS'] = allDocCmpData['MAIN']['INFO5']
    mainDocMapDetails['TDOC'] = allDocCmpData['MAIN']['INFO6']
    mainDocMapDetails['ADMIN'] = allDocCmpData['MAIN']['INFO7']
    mainDocMapDetails['IMAGE_TAB'] = allDocCmpData['MAIN']['INFO8']
    mainDocMapDetails['MULTI_TAB'] = allDocCmpData['MAIN']['INFO9']
    mainDocMapDetails['FORM_TAB'] = allDocCmpData['MAIN']['INFO10']
    mainDocMapDetails['COLL_DOC'] = allDocCmpData['MAIN']['INFO11']
    mainDocMapDetails['DOC_PBLS'] = allDocCmpData['MAIN']['INFO12']
    mainDocMapDetails['DOC_LIST'] = allDocCmpData['MAIN']['INFO13']
    mainDocMapDetails['DEF_IMG'] = allDocCmpData['MAIN']['INFO14']
    mainDocMapDetails['LIST_REF_INFO'] = allDocCmpData['MAIN']['INFO15']
    mainDocMapDetails['IMAGE_INFO'] = allDocCmpData['MAIN']['INFO16']
    mainDocMapDetails['IMAGE_PRO_INFO'] = allDocCmpData['MAIN']['INFO17']
    mainDocMapDetails['MULTI_INFO'] = allDocCmpData['MAIN']['INFO18']
    mainDocMapDetails['FORM_INFO'] = allDocCmpData['MAIN']['INFO19']
    mainDocMapDetails['COMMON_DATA'] = allDocCmpData['MAIN']['INFO20']

  } else {
    displayOutput('MAIN Doc details is not found !!')
  }
  

}

// MAP Documents Details
function mapDocumentDetails(docID) {  

  if(docID in allDocCmpData) {

    // Text Information
    docMapDetails['TEXT_1'] = allDocCmpData[docID]['INFO0']
    docMapDetails['TEXT_2'] = allDocCmpData[docID]['INFO1']
    docMapDetails['TEXT_3'] = allDocCmpData[docID]['INFO2']
    docMapDetails['TEXT_4'] = allDocCmpData[docID]['INFO3']
    docMapDetails['TEXT_5'] = allDocCmpData[docID]['INFO4']

    // Multi Text Information
    docMapDetails['MULTI_1'] = allDocCmpData[docID]['INFO5']
    docMapDetails['MULTI_2'] = allDocCmpData[docID]['INFO6']

    // Control Information
    docMapDetails['CNT_1'] = allDocCmpData[docID]['INFO22']

    // LIST REF Information
    docMapDetails['LIST_1'] = docID + '#INFO23'
    docMapDetails['LIST_2'] = docID + '#INFO26'

    // MAP Development and Production Image correctly .....
    if(is_production_mode) {

      // IMAGES Production Information
      docMapDetails['IMG_1'] = docID + '#INFO10'
      docMapDetails['IMG_2'] = docID + '#INFO12'
      docMapDetails['IMG_3'] = docID + '#INFO14'
      docMapDetails['IMG_4'] = docID + '#INFO16'
      docMapDetails['IMG_5'] = docID + '#INFO19'
      docMapDetails['IMG_6'] = docID + '#INFO21'
      docMapDetails['IMG_7'] = docID + '#INFO8'
    } else {

      // IMAGES Information
      docMapDetails['IMG_1'] = docID + '#INFO11'
      docMapDetails['IMG_2'] = docID + '#INFO13'
      docMapDetails['IMG_3'] = docID + '#INFO15'
      docMapDetails['IMG_4'] = docID + '#INFO18'
      docMapDetails['IMG_5'] = docID + '#INFO20'
      docMapDetails['IMG_6'] = docID + '#INFO7'
      docMapDetails['IMG_7'] = docID + '#INFO9'

    }

    // TREE Information
    docMapDetails['TREE_1'] = docID + '#INFO24'

    // FORM Information
    docMapDetails['FORM_1'] = docID + '#INFO25'

    

    

  } else {
    displayOutput(docID + ' Data not found !!')
  }

}

// *******************************************************
// --------------- Extract Functions ---------------------

// Extract Image URL Details
function getImageUrl(details) {

  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  // Check Visible Status
  if(allDocCmpData[docID][info_details+'_INFO4']) {
     // Check Source Status
     var image_url = 'NA'
     if(allDocCmpData[docID][info_details+'_INFO5']) {
            // Return DB Url
            image_url = allDocCmpData[docID][info_details+'_INFO1']
     } else {
            // Return External Url
            image_url = allDocCmpData[docID][info_details+'_INFO3']
     }

     if(image_url == 'NA') {
       return mainDocMapDetails['DEF_IMG']
     } else {
       return image_url
     }

  } else {
       // Return Collection Default Image Url
       return mainDocMapDetails['DEF_IMG']
  }

}

// Get Image Description details
function getImageDesc(details) {
  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  return allDocCmpData[docID][info_details+'_INFO6']
}

// Extract LIST_REF Details
function getListRefDetails(details,htmlID) {

  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  var list_ref_details = {} 
  list_ref_details['BS_LYT'] = allDocCmpData[docID][info_details+'_INFO1']
  list_ref_details['BS_IMG_REF'] = allDocCmpData[docID][info_details+'_INFO2']
  list_ref_details['BS_TITLE'] = allDocCmpData[docID][info_details+'_INFO3']
  list_ref_details['BS_DESC'] = allDocCmpData[docID][info_details+'_INFO4']
  list_ref_details['MDL_COLL'] = allDocCmpData[docID][info_details+'_INFO5']
  list_ref_details['MDL_DOC'] = allDocCmpData[docID][info_details+'_INFO6']
  list_ref_details['MDL_LYT'] = allDocCmpData[docID][info_details+'_INFO7']
  list_ref_details['MDL_INFO'] = allDocCmpData[docID][info_details+'_INFO8']
  list_ref_details['MDL_CLICK'] = allDocCmpData[docID][info_details+'_INFO9']
  list_ref_details['VISIBLE'] = allDocCmpData[docID][info_details+'_INFO10']

  //Read Collection Document data from LIST_DATA collection
  db.collection(coll_base_path+coll_lang+'/'+'LIST_DATA').doc(list_ref_details['MDL_COLL']).get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No such document!'); 
    } else {
      displayOutput(docID + ' - Document data Read Done.');
      list_ref_details['MDL_DOC_DATA'] = doc.data()

      // ----- Update HTML Content ---------
      if(list_ref_details['VISIBLE']) {
        createListRefHTMLContent(list_ref_details,htmlID)
      }
    }
  })
  .catch(err => {
    displayOutput('Error getting document', err);    
  });

}


// ******************************************************
// --------------- Common Functions --------------------
function displayOutput(details) {
  if(debug_mode) {
    console.log(details)
  }
}


// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

// Update Header Image
function updateHeaderImages() {

  // Update HTML Page
  var header_carousel_1_line = '<div class="item active">\
  <img src="' + getImageUrl(docMapDetails['IMG_1']) +'" alt="New York" width="1200" height="700">\
  <div class="carousel-caption">\
  <h3>New York</h3>\
  <p>' + getImageDesc(docMapDetails['IMG_1']) +'</p>\
  </div> </div>\
  <div class="item">\
  <img src="' + getImageUrl(docMapDetails['IMG_2']) +'" alt="Chicago" width="1200" height="700">\
  <div class="carousel-caption">\
  <h3>Chicago</h3>\
  <p>' + getImageDesc(docMapDetails['IMG_2']) +'</p>\
  </div> </div>\
  <div class="item">\
  <img src="' + getImageUrl(docMapDetails['IMG_3']) +'" alt="Los Angeles" width="1200" height="700">\
  <div class="carousel-caption">\
  <h3>LA</h3>\
  <p>' + getImageDesc(docMapDetails['IMG_3']) +'</p>\
  </div></div>';

  $("#header_carousel_1").html(header_carousel_1_line);

  // Update Text Information
  var header_information = '<h3>'+ docMapDetails['TEXT_1'] + '</h3>\
  <p><em>'+ docMapDetails['TEXT_2'] + '</em></p>\
  <p>'+ docMapDetails['MULTI_1'] + '</p>\
  <br>';

  $("#header_information").html(header_information);

  // Collect List Ref Details and Display Into HTML
  getListRefDetails(docMapDetails['LIST_1'],'model_list_ref_1')
  getListRefDetails(docMapDetails['LIST_2'],'model_list_ref_2')

}

// Create List ref layout HTML content
function createListRefHTMLContent(details,htmlID) {

  var all_doc_list = details['MDL_DOC'].split(',')
  var all_doc_info_list = details['MDL_INFO'].split(',')  

  var each_list_ref_div_content = '';

  // Read Each Document details and create lsit view 
  for(each_doc in all_doc_list) {

    var doc_id = all_doc_list[each_doc]

    // Get Doc Details
    var doc_details = details['MDL_DOC_DATA'][doc_id]
    
    // Create Layout according to the Model Layouts
    
    each_list_ref_div_content += modelLayoutSelector(doc_id,details['MDL_LYT'],doc_details,all_doc_info_list)

  }
   
  // Update HTML Page
  $("#"+htmlID).html(each_list_ref_div_content);

}

// ----------------------------------------------------------------
// ----------- MDOEL Layout's -------------------------------------

// Model Layout Selector
function modelLayoutSelector(doc_id,mdl_layout,doc_details,all_doc_info_list) {

  var mdl_html_line = ''

  //Information Details
  var doc_info_details = {}
  doc_info_details['IMG'] = all_doc_info_list[0]
  doc_info_details['HEADER'] = all_doc_info_list[1]
  doc_info_details['CONTENT_1'] = all_doc_info_list[2]
  doc_info_details['CONTENT_2'] = all_doc_info_list[3]

  // CIRCLE_COLLAPSE Layout
  if(mdl_layout == 'CIRCLE_COLLAPSE') {

    mdl_html_line = modelLytCircleWithCollaps(
                                                doc_id,
                                                doc_details[doc_info_details['IMG']],
                                                doc_details[doc_info_details['HEADER']],
                                                doc_details[doc_info_details['CONTENT_1']],
                                                doc_details[doc_info_details['CONTENT_2']],
                                                true
                                                )
  }

  // CIRCLE_ONLY Layout
  if(mdl_layout == 'CIRCLE_ONLY') {

    mdl_html_line = modelLytCircleWithCollaps(
                                                doc_id,
                                                doc_details[doc_info_details['IMG']],
                                                doc_details[doc_info_details['HEADER']],
                                                doc_details[doc_info_details['CONTENT_1']],
                                                doc_details[doc_info_details['CONTENT_2']],
                                                false
                                                )
  }

  // SQUARE_WITH_BUTTON Layout
  if(mdl_layout == 'SQUARE_WITH_BUTTON') {

    mdl_html_line = modelLytSquareWithButton(
                                                doc_id,
                                                doc_details[doc_info_details['IMG']],
                                                doc_details[doc_info_details['HEADER']],
                                                doc_details[doc_info_details['CONTENT_1']],
                                                doc_details[doc_info_details['CONTENT_2']],
                                                true
                                                )
  }

  return mdl_html_line;

}

// Model Circle Layout with collaps feature
function modelLytCircleWithCollaps(doc_id,image_ref,header,content_1,content_2,is_collapse) {

  var htmlLine = '<div class="col-sm-4">\
            <p class="text-center"><strong>'+ header +'</strong></p><br>\
            <a href="#' + doc_id +'" data-toggle="collapse">\
              <img src="' + image_ref +'" class="img-circle person" alt="Random Name" width="255" height="255">\
            </a>';
      
      if(is_collapse) {
        htmlLine += '<div id="' + doc_id + '" class="collapse">\
            <p>' + content_1 +'</p>\
            <p>' + content_2 +'</p>\
            \
          </div>\
        </div>';
       } else {
        htmlLine += '</div>';
       }
           

  return htmlLine

}

// Model Square with button
function modelLytSquareWithButton(doc_id,image_ref,header,content_1,content_2,is_button) {
   
  var htmlLine = ' <div class="col-sm-4">\
      <div class="thumbnail">\
        <img src="' + image_ref +'" alt="Paris" width="400" height="300">\
        <p><strong>'+ header + '</strong></p>\
        <p>' + content_1 + '</p>\
        <button class="btn" data-toggle="modal" data-target="#myModal">' + content_2 +'</button>\
      </div>\
    </div>';

    return htmlLine;

}


// *********************************************************
// --------------------------- EXTRA MODEL ------------------------------
/**
 * Displays overlay with "Please wait" text. Based on bootstrap modal. Contains animated progress bar.
 */
function showPleaseWait() {
  var modalLoading = '<div class="modal" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false" role="dialog">\
      <div class="modal-dialog">\
          <div class="modal-content">\
              <div class="modal-header">\
                  <h4 class="modal-title">Please wait...</h4>\
              </div>\
              <div class="modal-body">\
                  <div class="progress">\
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"\
                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%; height: 40px">\
                    </div>\
                  </div>\
              </div>\
          </div>\
      </div>\
  </div>';
  $(document.body).append(modalLoading);
  $("#pleaseWaitDialog").modal("show");
}

/**
* Hides "Please wait" overlay. See function showPleaseWait().
*/
function hidePleaseWait() {
// Hide progress
  $("#pleaseWaitDialog").modal("hide");
}
