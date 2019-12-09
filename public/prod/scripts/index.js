// *******************************************************************************
// SCRIPT : index.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************


// ---------- Main Variables ---------
var coll_base_path = basePath
var coll_base_path_P = baseProductionPrivatePath

if (check_dev_publish_content) {
  coll_base_path = baseProductionPath
  coll_base_path_P = baseProductionPrivatePath
}

// -------- Link Page with Collection and Documents -----
var coll_lang = 'CORE';
var coll_name = 'HOME_DATA';
var user_role = 'DEV';
var document_ID = 'DOC0';

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
  if (params.size > 0) {
    coll_lang = params['lang_name'];
    coll_name = params['coll_name'];
    user_role = params['role'];
    document_ID = params['docID'];
  }

  displayOutput(coll_lang + ' , ' + coll_name + ' , ' + user_role + ' , ' + document_ID)


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

// Read Only one Document Data
function readDocumentData(docID) {

  showPleaseWait()

  let getDoc = db.collection(coll_base_path + coll_lang + '/' + coll_name).doc(docID).get()
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

  checkLoginData()

  displayOutput('DB : ' +coll_base_path)
 
  showPleaseWait()

  await db.collection(coll_base_path + coll_lang + '/' + coll_name).doc(docID).get()
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

      hidePleaseWait()
    });


  // ------------- Read MAIN Document --------------
  await db.collection(coll_base_path + coll_lang + '/' + coll_name).doc('MAIN').get()
    .then(doc => {
      if (!doc.exists) {
        displayOutput('No such document!');

        hidePleaseWait()

      } else {
        displayOutput('MAIN - Document data Read Done.');
        allDocCmpData['MAIN'] = doc.data()

        updateMappingDetails(docID)

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

startUpCalls();

// Get Parameters details
getParams();

// Read All Documents from Collection
//readCompleateCollection();

// Read only one Document Data
//readDocumentData(document_ID);

// Async Mode
//readDocumentDataAsync(document_ID)
checkUserDetailsAndSTART()



// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage() {

  displayOutput(allDocCmpData)
  displayOutput(mainDocMapDetails)
  displayOutput(docMapDetails)

  displayOutput('Update Header Images ...')

  // Update Header Images
  document.getElementById('hdr_img_1').src = getImageUrl(getInfoDetailsC("HDR IMG1"))
  $("#hdr_img_1_bc").html(getImageDesc(getInfoDetailsC("HDR IMG1")).split('#')[0]);
  $("#hdr_img_1_sc").html(getImageDesc(getInfoDetailsC("HDR IMG1")).split('#')[1]);

  document.getElementById('hdr_img_2').src = getImageUrl(getInfoDetailsC("HDR IMG2"))
  $("#hdr_img_2_bc").html(getImageDesc(getInfoDetailsC("HDR IMG2")).split('#')[0]);
  $("#hdr_img_2_sc").html(getImageDesc(getInfoDetailsC("HDR IMG2")).split('#')[1]);

  document.getElementById('hdr_img_3').src = getImageUrl(getInfoDetailsC("HDR IMG3"))
  $("#hdr_img_3_bc").html(getImageDesc(getInfoDetailsC("HDR IMG3")).split('#')[0]);
  $("#hdr_img_3_sc").html(getImageDesc(getInfoDetailsC("HDR IMG3")).split('#')[1]);

  // Update Flash Content
  let flash_cnt = getHashDataList(getInfoDetailsC("Top Header"))
  // Create HTML Content
  let img = '<i class="fab '+flash_cnt['FLASH_ICON_1']+'" style="font-size: 50px;"></i>'
  $("#flash_img_1").html(img)
  let content = '<h5>'+flash_cnt['FLASH_BOLD_HDR_1']+'</h5>' + flash_cnt['FLASH_CONTENT_1']
  $("#flash_cnt_1").html(content)

  img = '<i class="fab '+flash_cnt['FLASH_ICON_2']+'" style="font-size: 50px;"></i>'
  $("#flash_img_2").html(img)
  content = '<h5>'+flash_cnt['FLASH_BOLD_HDR_2']+'</h5>' + flash_cnt['FLASH_CONTENT_2']
  $("#flash_cnt_2").html(content)

  displayOutput('Header Updated ..')




  // Update Normal List Content
  updateNormalListContent()

  // HTML Modification functions
  updateListRefDetails()

  


}

// *******************************************************
// --------------- Mapping Functions ---------------------
// Generate Map function from Collection Options
// Paste complete code here
// Format code using shift+alt+F

// <<<<<<<<<<<<<<<<<< CODE SECTION START >>>>>>>>>>>>>>>>>>>>>>>>>>>>

//**************** Mapping Function ***************************
// Update Mapping Data Sets details
function updateMappingDetails(docID) {
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
docMapDetails["top_header"] = allDocCmpData[docID]["INFO0"]
docMapDetails["top_destination"] = docID + "#INFO10"
docMapDetails["top_packages"] = docID + "#INFO11"
docMapDetails["app_config"] = allDocCmpData[docID]["INFO12"]
docMapDetails["catg_list"] = allDocCmpData[docID]["INFO2"]
docMapDetails["offer_list"] = allDocCmpData[docID]["INFO3"]
docMapDetails["footer"] = allDocCmpData[docID]["INFO4"]
docMapDetails["config"] = allDocCmpData[docID]["INFO5"]

// MAP Development and Production Image correctly .....
if(check_dev_publish_content) {

// IMAGES Production Information

docMapDetails["hdr_img1"] = docID + "#INFO14"
docMapDetails["hdr_img2"] = docID + "#INFO16"
docMapDetails["hdr_img3"] = docID + "#INFO7"
docMapDetails["footer_image"] = docID + "#INFO9"

} else {
// IMAGES Information

docMapDetails["hdr_img1"] = docID + "#INFO13"
docMapDetails["hdr_img2"] = docID + "#INFO15"
docMapDetails["hdr_img3"] = docID + "#INFO6"
docMapDetails["footer_image"] = docID + "#INFO8"

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

// Update List Ref Details
function updateListRefDetails() {

  // Collect List Ref Details and Display Into HTML
  displayOutput('Update List view ...')
  getListRefDetails(getInfoDetailsC('Top Destination'), 'col_section_1')
  getListRefDetails(getInfoDetailsC('Top Packages'), 'col_section_2')  

}

// Update Normal List Content
function updateNormalListContent() {

  displayOutput('Read Other details ..')

  let app_config = getHashDataList(getInfoDetailsC("App Config"))
  displayOutput(app_config)

  let catg_list = getHashDataList(getInfoDetailsC("Catg List"))
  displayOutput(catg_list)

  let offer_list = getHashDataList(getInfoDetailsC("Offer List"))
  displayOutput(offer_list)

  let footer_details = getHashDataList(getInfoDetailsC("Footer"))
  displayOutput(footer_details)

  let config = getHashDataList(getInfoDetailsC("Config"))
  displayOutput(config)


  // ------------------------------------
  // Update Catg List
  // ------------------------------------
  createScrollCardLytFromMapListData('catg_list_sec',catg_list,'S',true)

  createScrollCardLytFromMapListData('offr_list_sec',offer_list,'M',true)




}


// --------- Update Model Content ------------------------------- 
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
    return [true,true,'center','center']
    
  case "PACKAGES":
    return [true,true,'center','center']

  default:
    return [true,true,'center','center']
}

  
    
}

// Create Model Content
function getModelCompleteContent(mdl_coll, all_doc_info_list, doc_data) {

  var html_div_line = ''
  // Change According to the Model ID 
  switch (mdl_coll) {
    case "DESTINATIONS":

      var header = doc_data[all_doc_info_list[0]]
      var content = doc_data[all_doc_info_list[1]]
      var content_1 = doc_data[all_doc_info_list[2]]

      html_div_line = '<b>' + header

      break;

    case "PACKAGES":

      var header = doc_data[all_doc_info_list[0]]
      var sub_header = doc_data[all_doc_info_list[1]]
      var ratings = doc_data[all_doc_info_list[2]]
      var price = doc_data[all_doc_info_list[3]]
      var cut_price = doc_data[all_doc_info_list[4]] 

      let tags_line = getAppendHTMLLines(sub_header,
        '<div class="small chip">',
        '</div>')

  html_div_line = '<div><p style="font-size: 20px;">'+ header +'</p>\
  <p class="card-text" style="font-size: 10px;">'+ tags_line +'</p>\
  <p><small class="text-muted">' +  getRatingHTMLCode(ratings)  + '\
      </small>\
  <br>\
  <span class="right">'
  
    if(cut_price != '0') {html_div_line += '<small style="text-decoration: line-through; class="text-muted">(&#x20b9;'+ cut_price +')</small>'}

    html_div_line += '<small style="font-size: 20px;">&#x20b9;'+ price +'</small></span>\
        <br>\
  </p></div>';

      break;

    default:
      displayOutput("No Document found");
      html_div_line = ''
  }

  return html_div_line

}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function(){
    $('.slider').slider();
  });

  $(document).ready(function(){
    $('.fixed-action-btn').floatingActionButton();
  });

}


// =====================================================
// ----- Local Storage ----------
// =====================================================

function checkUserDetailsAndSTART() {

  var userDataPath = coll_base_path_P + 'USER/ALLUSER'

  firebase.auth().onAuthStateChanged(function (user) {

    // Is user login or not
    if (user) {
      displayOutput('User login !!')
      let uuid = user.uid;

      // Check User Doc Exist or Not
      let ref = db.collection(userDataPath).doc(uuid);
      let getDoc = ref.get()
        .then(doc => {

          if (!doc.exists) {
            displayOutput('No such document!');
            validationFailed()

          } else {
            displayOutput('User Data already present.');
            let userData = doc.data()

            // Update Session Data
            localStorageData('ISUSER',true)
            localStorageData('UUID',userData['UUID'])
            localStorageData('NAME',userData['NAME'])
            localStorageData('EMAIL',userData['EMAIL'])
            localStorageData('MOBILE',userData['MOBILE'])
            localStorageData('ROLE',userData['ROLE']) 
            
            displayOutput('Session Data Updated ...')

            // Check is User have DEV access or Not
            if(is_production_mode) {

               // ----------- Publish Option -----------------------------------------
                  // Update Publish Database option for TESTER
                  if(userData['ROLE'] == 'ADMIN' || userData['ROLE'] == 'DEV') {
                    displayOutput('Change Publish Mode from Production to Development.')
                    check_dev_publish_content = false              
                    coll_base_path = basePath                   
                    $('#role_message').html('KivTech Development Publish')
                    
                  }
                  // --------------------------------------------------------------------
                  
                  readDocumentDataAsync(document_ID)

                  document.getElementById("main_container").style.display = 'block';
                  document.getElementById("header_content").style.display = 'block';


            } else {
              // Only DEV role have entry to access development url.
            if(userData['ROLE'] == 'DEV') {           

                  // ----------- Publish Option -----------------------------------------
                  // Update Publish Database option for TESTER
                  if(userData['ROLE'] == 'ADMIN' || userData['ROLE'] == 'DEV') {
                    displayOutput('Change Publish Mode from Production to Development.')
                    check_dev_publish_content = false              
                    coll_base_path = basePath                    
                    $('#role_message').html('KivTech Development Publish,DEV MODE')
                    
                  }
                  // --------------------------------------------------------------------
                  
                  readDocumentDataAsync(document_ID)

                  document.getElementById("main_container").style.display = 'block';
                  document.getElementById("header_content").style.display = 'block';

          } else {
            // Show No Content
            viewModel('Message','Sorry , No Content available !!') 

          }

          } }

        })
        .catch(err => {
          displayOutput('Error getting document', err);
          validationFailed()

        });


    } else {
      // User is signed out.
      displayOutput('User logout !!')
      validationFailed()

    }
  }, function (error) {
    displayOutput(error);
    validationFailed()

  });

}

function validationFailed() {
  displayOutput('Validation Failed !!')

  localStorageData('ISUSER',false)

  if(is_production_mode) {
  readDocumentDataAsync(document_ID)
  } else {
    viewModel('Message','Sorry , No Content available !!')
  }

  document.getElementById("main_container").style.display = 'block';
  document.getElementById("header_content").style.display = 'block';
}

// Check Session Data is Correct or Not
function checkLoginData(){

   // Check Session Data
   let status = getLoginUserStatus()
   displayOutput('Check Session Data ...')
   displayOutput(status)
   if(status == 'true') {
     let userLoginData = getLoginUserData()
     displayOutput(userLoginData)
   }

}

// Open Request Form
function openRequestForm() {
  displayOutput('Open Request Form.')

  localStorageData('ISPKG',false)

  location.href = 'requestform.html?detail1=NA&detail2=NA&detail3=NA'
}


// ******************************************************
// ------------------ END -------------------------------
// ******************************************************
