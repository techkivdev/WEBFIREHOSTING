// *******************************************************************************
// SCRIPT : common.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// *********************************************
// ------------- CONFIGURATION ----------------
var basePath = '/DATABASE/DEVELOPMENT/PUBLIC/';
var basePrivatePath = '/DATABASE/DEVELOPMENT/PRIVATE/';
var baseProductionPath = '/DATABASE/PRODUCTION/PUBLIC/';
var baseProductionPrivatePath = '/DATABASE/PRODUCTION/PRIVATE/';

var imagebasePath = '/DATABASE/DEVELOPMENT/PUBLIC/';
var imagebaseProductionPath = '/DATABASE/PRODUCTION/PUBLIC/';

// ********************************************
// ------------ Mode Configuration -----------
// Debug Mode
var debug_mode = true

// Change Mode for Production or Development
var is_production_mode = false

// First Time Database Operation
var first_time_operation = false



// *******************************************************
// --------------- Extract Functions ---------------------

// Extract Image URL Details
function getImageUrl(details) {

  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  var final_image_ref = ''

  // Check Visible Status
  if (allDocCmpData[docID][info_details + '_INFO4']) {
    // Check Source Status
    var image_url = 'NA'
    if (allDocCmpData[docID][info_details + '_INFO5']) {
      // Return DB Url
      image_url = allDocCmpData[docID][info_details + '_INFO1']
    } else {
      // Return External Url
      image_url = allDocCmpData[docID][info_details + '_INFO3']
    }

    if (image_url == 'NA') {
      final_image_ref = mainDocMapDetails['DEF_IMG']
    } else {
      final_image_ref = image_url
    }

  } else {
    // Return Collection Default Image Url
    final_image_ref = "NOK"
  }

  return getDirectImageUrl(final_image_ref)

}

// Get Image Description details
function getImageDesc(details) {
  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  return allDocCmpData[docID][info_details + '_INFO6']
}

// Get Model Image ref details
// IDX 0 is Image url and 1 is DB id
function getModelImageRef(details) {
  return getDirectImageUrl(details[0])
}

// Get Local Image Details
function getDirectImageUrl(details) {
  if (details == 'NA') {
    return 'Images/default.jpg'
  } else {
    return details
  }
}

// Extract LIST_REF Details
function getListRefDetails(details, htmlID) {

  var docID = details.split('#')[0]
  var info_details = details.split('#')[1]

  var list_ref_details = {}
  list_ref_details['BS_LYT'] = allDocCmpData[docID][info_details + '_INFO1']
  list_ref_details['BS_IMG_REF'] = allDocCmpData[docID][info_details + '_INFO2']
  list_ref_details['BS_TITLE'] = allDocCmpData[docID][info_details + '_INFO3']
  list_ref_details['BS_DESC'] = allDocCmpData[docID][info_details + '_INFO4']
  list_ref_details['MDL_COLL'] = allDocCmpData[docID][info_details + '_INFO5']
  list_ref_details['MDL_DOC'] = allDocCmpData[docID][info_details + '_INFO6']
  list_ref_details['MDL_LYT'] = allDocCmpData[docID][info_details + '_INFO7']
  list_ref_details['MDL_INFO'] = allDocCmpData[docID][info_details + '_INFO8']
  list_ref_details['MDL_CLICK'] = allDocCmpData[docID][info_details + '_INFO9']
  list_ref_details['VISIBLE'] = allDocCmpData[docID][info_details + '_INFO10']

  // -------------- Change Here details for testing purpose -------------
  if (false) {
    list_ref_details['BS_LYT'] = 'CARD_ROW_HORIZ'
    list_ref_details['MDL_LYT'] = 'SQUARE_CARD_HORIZ'
  }



  //Read Collection Document data from LIST_DATA collection
  if (list_ref_details['MDL_COLL'] != 'NA') {
    db.collection(coll_base_path + coll_lang + '/' + 'LIST_DATA').doc(list_ref_details['MDL_COLL']).get()
      .then(doc => {
        if (!doc.exists) {
          displayOutput('No such document!');
        } else {
          displayOutput(docID + ' - Document data Read Done.');
          list_ref_details['MDL_DOC_DATA'] = doc.data()

          // ----- Update HTML Content ---------
          if (list_ref_details['VISIBLE']) {
            createListRefHTMLContent(list_ref_details, htmlID)
          }
        }
      })
      .catch(err => {
        displayOutput('LIST_DATA Error getting document');
        displayOutput()
      });
  }

}


// ******************************************************
// --------------- Common Functions --------------------
function displayOutput(details) {
  if (debug_mode) {
    console.log(details)
  }
}

// Display Toast Message
function toastMsg(msg) {
  M.toast({html: msg})
}

// ----- Click Handling Operation --------
function clickHandling(mdl_map_details) {

  var mdl_action_details = mdl_map_details['ACTION']
  var id = mdl_map_details['ID']

  var action = mdl_action_details.split(',')[0]
  var page_name = mdl_action_details.split(',')[1]
  var name = mdl_action_details.split(',')[2]
  var filter = mdl_action_details.split(',')[3]
  var extra = mdl_action_details.split(',')[4]


  if (action == 'STATICPAGE') {
    var url = page_name + '.html?detail1=' + encodeURIComponent(name) + '&detail2=' + encodeURIComponent(filter) + '&detail3=' + encodeURIComponent(extra);

    //document.location.href = url;
    return url
  } else if (action == 'FILTERPAGE') {

    var url = page_name + '.html?detail1=' + encodeURIComponent(name) + '&detail2=' + encodeURIComponent(id) + '&detail3=' + encodeURIComponent(extra);

    return url

  }  else {
    return 'NA'
  }

}

// --------  Get Key Names Details --------
function getKeyDetails(key_name) {
  return key_name.replace(' ','_').toLowerCase()
 }

 // Get Info details
function getInfoDetailsC(key) {
  return docMapDetails[getKeyDetails(key)]
}

// Get Hashvalues Details
function getHashDataList(details) {
  
  var dataList = {}

  if(details == "NA") {
       dataList['STATUS'] = false
  } else {      

  var all_details_list = details.split('#')

  let dataLine = '{'
  for(each_idx in all_details_list) {
    if(each_idx == 0){continue}
    var idx_data = all_details_list[each_idx]
    dataLine += '"' + idx_data.split(':')[0].trim() + '"'  + ':' + '"' + idx_data.split(':')[1].trim() +'",'
    
  }

  dataLine = dataLine.slice(0, -1) + '}'

  dataList = JSON.parse(dataLine)
  dataList['STATUS'] = true
  
}

return dataList

}



// ---------------------------------------------------------------
// ---------------------MODEL and BASE Layout -----------------------
// Create List ref layout HTML content
function createListRefHTMLContent(details, htmlID) {

  var all_doc_list = details['MDL_DOC'].split(',')
  var all_doc_info_list = details['MDL_INFO'].split(',')

  var each_list_ref_div_content = '';

  // Read Each Document details and create lsit view 
  for (each_doc in all_doc_list) {

    var doc_id = all_doc_list[each_doc]

    // Get Doc Details
    var doc_details = details['MDL_DOC_DATA'][doc_id]

    // Create Layout according to the Model Layouts    
    each_list_ref_div_content += modelLayoutSelector(details['MDL_COLL'], details['MDL_LYT'], doc_details, all_doc_info_list, details['MDL_CLICK'])

  }

  // Get BASE Layout content 
  var base_layout_content = getBaseLayoutHTML(details['MDL_COLL'],details['BS_LYT'], details['BS_TITLE'], each_list_ref_div_content)


  // Update HTML Page
  $("#" + htmlID).html(base_layout_content);

}

// Create Base Layout
function getBaseLayoutHTML(mdl_coll,base_layout, header, model_content) {

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
                      <h3><i class="mdi-content-send brown-text"></i></h3>\
                      <div class="row">'
                      if(show_model_base_header) {
                        base_layout_html += '<div class="col s12">\
                        <h4>' + header + '</h4>\
                      </div> ';                     
                    }
                        

                      if(show_model_base_button){
                        base_layout_html += '<div class="col s12">\
                          <div class="' + header_button_layout_position + '">\
                            <a onclick="clickViewAll(\'' + mdl_coll + '\')" class="waves-effect waves-light btn blue rcorners">View All</a>\
                          </div>\
                        </div>'
                      }

                      base_layout_html += '</div>\
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
                      <h3><i class="mdi-content-send brown-text"></i></h3>\
                      <div class="row">'
                      if(show_model_base_header) {
                        base_layout_html += '<div class="col s12">\
                        <h4>' + header + '</h4>\
                      </div> ';                     
                    }
                        

                      if(show_model_base_button){
                        base_layout_html += '<div class="col s12">\
                          <div class="' + header_button_layout_position + '">\
                            <a onclick="clickViewAll(\'' + mdl_coll + '\')" class="waves-effect waves-light btn blue">View All</a>\
                          </div>\
                        </div>'
                      }

                      base_layout_html += '</div>\
                      </div>\
                  </div>' + model_content;    

  }


  return base_layout_html;


}

// Click View All , Open new Page
function clickViewAll(details){
  displayOutput('Click : ' + details)

  var url = 'alldetails.html?detail1=' + encodeURIComponent(details) + '&detail2=' + encodeURIComponent('NA') + '&detail3=' + encodeURIComponent('NA');

  document.location.href = url;


}


// ----------------------------------------------------------------
// ----------- MDOEL Layout's -------------------------------------

// Model Layout Selector
function modelLayoutSelector(mdl_coll, mdl_layout, doc_details, all_doc_info_list, mdl_action_details) {

  var mdl_html_line = ''

  var complete_content = getModelCompleteContent(mdl_coll, all_doc_info_list, doc_details)


  var mdl_map_details = {}
  mdl_map_details['ID'] = doc_details['ID']
  mdl_map_details['IMAGE'] = doc_details['IMAGE']
  mdl_map_details['CONTENT'] = complete_content
  mdl_map_details['ACTION'] = mdl_action_details


  // SQUARE_CARD Layout
  if (mdl_layout == 'SQUARE_CARD') {

    mdl_html_line = modelLytSquareCard(mdl_map_details)
  }

  // SQUARE_CARD_IMAGE Layout
  if (mdl_layout == 'SQUARE_CARD_IMAGE') {

    mdl_html_line = modelLytSquareCardImage(mdl_map_details)
  }

  // SQUARE_CARD_HORIZ Layout
  if (mdl_layout == 'SQUARE_CARD_HORIZ') {

    mdl_html_line = modelLytSquareHoriCard(mdl_map_details)
  }

  return mdl_html_line;

}

// Model Square Card
// Important Point :
// : col s12 m6 - Desktop layout is same but in mobile layout one below to another one
// : col s6 m6  - Same in desktop and mobile also
function modelLytSquareCardNormal(mdl_map_details) {
  
  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT']  

  var htmlLine = '<div class="col s12 m4"><a href="' + clickHandling(mdl_map_details) + '">\
                  <div class="card hoverable">\
                    <div class="card-image">\
                      <img src="' + getModelImageRef(image_ref) + '">\
                    </div>\
                    <div class="card-content">\
                      <div>' + complete_content + '</div>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

// Model Square Card - Customize
function modelLytSquareCard(mdl_map_details) {

  var image_ref = mdl_map_details['IMAGE']
  var complete_content = mdl_map_details['CONTENT'] 

  var htmlLine = '<div class="col s12 m4"><a href="' + clickHandling(mdl_map_details) + '">\
                  <div class="card hoverable" style="border-radius: 25px;">\
                    <div class="card-image z-depth-2" style="height: 200px; max-height: 200px; widht: 500px; max-width: 500px; border-radius: 25px 25px 0px 0px;">\
                      <img src="' + getModelImageRef(image_ref) + '" style="height: 200px; max-height: 200px; widht: 400px; max-width: 400px; border-radius: 25px 25px 0px 0px;">\
                    </div>\
                    <div class="red-card-content white-text" style="border-radius: 0px 0px 25px 25px;">\
                      <div class="card-content white-text">' + complete_content + '</div>\
                    </div>\
                  </div>\
                </a>\
              </div>';

  return htmlLine;

}

// Model Square Card with Image Only
function modelLytSquareCardImage(mdl_map_details) {

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

// Model Square Card Horizontal
function modelLytSquareHoriCard(mdl_map_details) {

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



// *********************************************************
// --------------------------- EXTRA MODEL -----------------
/**
 * Displays overlay with "Please wait" text. Based on bootstrap modal. Contains animated progress bar.
 */
function showPleaseWait() {
  document.getElementById('main_progress').style.display = "block";
}

function hidePleaseWait() {
  // Hide progress
  document.getElementById('main_progress').style.display = "none";
}

// ------------- Show Alert ----------------------------
function showAlert(details) {
  alert(details)
}

// Get Current Date
function getTodayDate() {

  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  var today = new Date();
  var date = month[today.getMonth()].substring(0, 3)+' '+today.getDate() +', ' + today.getFullYear();

  return date
}


// View Model to show Information
function viewModel(header, content) {

  var model = '<!-- Modal Structure -->\
  <div id="messagemodel" class="modal modal-fixed-footer">\
    <div class="modal-content">\
      <h4> '+ header +'</h4>\
      <p>'+ content + '</p>\
    </div>\
    <div class="modal-footer">\
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
    </div>\
  </div>'

  var elem = document.getElementById('messagemodel');
  if (elem) { elem.parentNode.removeChild(elem); }
  
  
    $(document.body).append(model);
  
    $(document).ready(function () {
      $('.modal').modal();
    }); 
    
  
    $('#messagemodel').modal('open');


}

function viewModelCustom(header, content) {

  var model = '<!-- Modal Structure -->\
  <div id="messagemodel" class="modal">\
    <div style="margin-top: -5%;">\
      <p>'+ content + '</p>\
    </div>\
  </div>'

  var elem = document.getElementById('messagemodel');
  if (elem) { elem.parentNode.removeChild(elem); }
  
  
    $(document.body).append(model);
  
    $(document).ready(function () {
      $('.modal').modal();
    }); 
    
  
    $('#messagemodel').modal('open');


}

function closeModel() {
  $('#messagemodel').modal('close');
}

// Ask Model -  Validate some Information
function askModel(color,header, content, yesFunctionName) {

  let mdlContent = ''

  mdlContent += '<div class="left-align ' + color + '  white-text z-depth-2" style="border-radius: 25px 25px 0px 0px;">\
  <div class="card-content" style="padding: 5px;">\
  <p style="font-size: 30px; margin-left: 30px;">'+ header + '</p>\
  </div>\
  </div>'

  mdlContent += '<div class="card-content"><p class="grey-text" style="font-size: 15px; margin-left: 30px;">' + content + '</p>\</div>'

  mdlContent += '<div class="card-content center-align"><a onclick="'+yesFunctionName+'()" class="waves-effect waves-teal btn blue white-text rcorners">Yes</a>\
  <a onclick="askNO()" class="waves-effect waves-teal btn black white-text rcorners" style="margin-left: 2%;">No</a>\
  </div>'
     


  var model = '<!-- Modal Structure -->\
  <div id="askmodel" class="modal" style="border-radius: 25px;">\
    <div style="margin-top: -4%;">\
      <p>'+ mdlContent + '</p>\
    </div>\
  </div>'



  var elem = document.getElementById('askmodel');
  if (elem) { elem.parentNode.removeChild(elem); }
  
  
    $(document.body).append(model);
  
    $(document).ready(function () {
      $('.modal').modal();
    }); 
    
  
    $('#askmodel').modal('open');


}

// Close Ask Model
function askNO() {
  $('#askmodel').modal('close');
}


// ==============================================================
// ---------- Login User Validation -----------------------------
// ==============================================================

function getUseruuid() {
  firebase.auth().onAuthStateChanged(function (user) {

    // Is user login or not
    if (user) {
      displayOutput('User login !!') 
      return user.uid;      
    } else {
      // User is signed out.
      displayOutput('User logout !!') 
      return 'NA' 
    }
  }, function (error) {
    displayOutput(error);
    return 'NA'
  });
}

// Store Data for one session
function localStorageData(key,value) {

  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    
    sessionStorage.setItem(key, value);
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
  }

}

// Get Login User Status
function getLoginUserStatus() {

  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    return sessionStorage.getItem('ISUSER');
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
    return false
  }

}

// Get Login User Status
function getLoginUserData() {

  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    let userData = {}
    userData['ISUSER'] = sessionStorage.getItem('ISUSER');
    userData['UUID'] = sessionStorage.getItem('UUID');
    userData['NAME'] = sessionStorage.getItem('NAME');
    userData['EMAIL'] = sessionStorage.getItem('EMAIL');
    userData['MOBILE'] = sessionStorage.getItem('MOBILE');
    userData['ROLE'] = sessionStorage.getItem('ROLE');


    return userData;
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
    return false
  }

}