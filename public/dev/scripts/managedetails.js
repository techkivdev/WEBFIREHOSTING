// *******************************************************************************
// SCRIPT : requestform.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = basePrivatePath

if (is_production_mode) {
  coll_base_path = baseProductionPrivatePath
}

// -------- Link Page with Collection and Documents -----
var coll_lang = 'CORE';
var coll_name = 'LIST_DATA';
var document_ID = 'NA';
var filter = 'NA';
var extra = 'NA';

var userDataPath = coll_base_path + 'USER/ALLUSER'

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

  displayOutput(document_ID + ' , ' + filter + ' , ' + extra)


}

// *************************************************
// Read Data form Database and create HTML Page
// *************************************************
function readCompleateCollection() {

  showPleaseWait();

  var quotesPath = coll_base_path + 'COMMON/QUOTES'

  var totaldocCount = 0;

  db.collection(quotesPath).get().then((querySnapshot) => {
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
        displayOutput(doc.id);

        allDocCmpData[doc.id] = doc.data()

        // Check Document count
        docCount++;
        if (totaldocCount == docCount) {
          hidePleaseWait();

          // Update HTML Page
          updateHTMLPage()
        }

      });

    }

  });

} // EOF

// ************************************************
// Validate Admin role first
// ************************************************
function validateAdminRoles() {

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

            // Only for ADMIN and DEV
            if (userData['ROLE'] != 'USER') {
              // Validation Done
              displayOutput('Validation Passed !!')

              readCompleateCollection()
            } else {
              validationFailed()
            }




          }
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

// Validation Failed
function validationFailed() {
  displayOutput('Validation Failed !!')
  hidePleaseWait();

  document.getElementById("col_section_1").style.display = 'none';
}




// ******************************************************
// --------------- START UP CODE -----------------------
// Call Function when page loaded
// ******************************************************

startUpCalls();

// Get Parameters details
getParams();

// ******************************************************
// ADMIN Validation and then 
// Read All Documents from Collection
validateAdminRoles()


// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage() {

  displayOutput('Update HTML Page ..')

  var allCardDetails = ''

  for (eachid in allDocCmpData) {
    var eachData = allDocCmpData[eachid]
    allCardDetails += createCard(eachid, eachData)
    //displayOutput(eachData)
  }

  // Update HTML Page
  $("#all_details").html(allCardDetails);

}


// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

// Create card details
function createCard(id, data) {

  // Create Details
  let details = ''

  details += '<div class="left-align">\
  <p>'+ data['FROM'] + '  ->  ' + data['DESTINATION'] + '</p>\
  <p>'+ data['STARTDATE'] + '  ->  ' + data['ENDDATE'] + '</p>\
  <p>'+ data['DATEOPTION'] + '</p>\
  </div>'


  var cardDetails = '<div class="col s12 m4">\
  <div class="card blue-grey lighten-5">\
    <div class="card-content">\
      <span class="card-title"><b>'+ data['DESTINATION'] + '</b></span>' + details
    + '<br><a onclick="openAdminDialog(\'' + id + '\')" class="waves-effect waves-light btn blue">Manage</a></div> </div></div>'

  return cardDetails

}

// Admin Dialog Box
function openAdminDialog(id) {
  displayOutput('Admin Dialog  : ' + id)

  createModel(id, allDocCmpData[id])

}

// Create Model
function createModel(id, data) {

  let mdlhdr = 'Manage Quote'

  // Create Details
  let quotesContent = ''

  quotesContent += '<div class="left-align">\
  <p>'+ data['FROM'] + '  ->  ' + data['DESTINATION'] + '</p>\
  <p>'+ data['STARTDATE'] + '  ->  ' + data['ENDDATE'] + '</p>\
  <p>'+ data['DATEOPTION'] + '</p>\
  </div>'


  quotesContent += '<div class="right-align">\
  <b>User Details</b>\
  <p>'+ data['NAME'] + '</p>\
  <p>'+ data['MOBILENO'] + '</p>\
  <p>'+ data['EMAILID'] + '</p>\
  </div>'


  let mdlContnt = ''

  mdlContnt = '<div class="row">\
  <div class="col s6">\
    <ul class="tabs tabs-fixed-width tab-demo z-depth-1">\
      <li class="tab col s3"><a class="active" href="#quote">Quote</a></li>\
      <li class="tab col s3"><a href="#admin">Admin</a></li></ul>\
  </div>\
  <div id="quote" class="col s12">'+ quotesContent + '</div>\
  <div id="admin" class="col s12">Test 2</div>\
  </div>'




  var model = '<!-- Modal Structure -->\
<div id="adminmodel" class="modal modal-fixed-footer">\
  <div class="modal-content">\
    <h4>'+ mdlhdr + '</h4>\
    <p>'+ mdlContnt + '</p>\
  </div>\
  <div class="modal-footer">\
    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
  </div>\
</div>'


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function () {
    $('.tabs').tabs();
  });

  $('#adminmodel').modal('open');






}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  displayOutput('Startup Calls')

  $(document).ready(function () {
    $('.modal').modal();
  });

}

