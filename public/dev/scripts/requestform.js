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

var uuid = 'NA'

var quotesPath = coll_base_path+'COMMON/QUOTES'

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

// Check Session Data is Correct or Not
function checkLoginData(){

  // Check Session Data
  let status = getLoginUserStatus()
  displayOutput('Check Session Data ...')
  displayOutput(status)
  
  if(status == 'true') {
    let userLoginData = getLoginUserData()
    displayOutput(userLoginData)

    uuid = userLoginData['UUID']

    // Profile Details
  document.getElementById("name_txt").value = userLoginData['NAME']
  document.getElementById("mobile_txt").value = userLoginData['MOBILE']
  document.getElementById("email_txt").value = userLoginData['EMAIL']

  }

}

// ******************************************************
// --------------- START UP CODE -----------------------
// Call Function when page loaded
// ******************************************************

startUpCalls();

// Get Parameters details
getParams();

checkLoginData()

// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage() {        
}

// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

function submitDetails() {
  displayOutput('Submit All Details ..')

  // Read All Inputs Details
  var destination = document.getElementById("autocomplete-input-destination").value;
  displayOutput('Destination : ' + destination)
  var departurecity = document.getElementById("autocomplete-input-from").value;
  displayOutput('Departure City : ' + departurecity)
  var startdate = document.getElementById("start_date").value;
  displayOutput('Start Date : ' + startdate)
  var enddate = document.getElementById("end_date").value;
  displayOutput('End Date : ' + enddate)

  let dateOptionsValues = ["","FIXED","FLEXIBLE","ANYTIME"]
  var dateoptions = dateOptionsValues[document.getElementById("date_options").value];
  displayOutput('Date Options : ' + dateoptions)
  


  var name = document.getElementById("name_txt").value;
  displayOutput('Name : ' + name)
  var mobileno = document.getElementById("mobile_txt").value;
  displayOutput('Mobile Number : ' + mobileno)
  var emailid = document.getElementById("email_txt").value;
  displayOutput('Email ID : ' + emailid)

  // Check all Inputs
  var validation = false

  if((destination != '') && 
  (departurecity != '') &&
  (startdate != '') &&
  (enddate != '') &&
  (dateoptions != '') &&
  (name != '') &&
  (mobileno != '') &&
  (emailid != '')) {

    
    // Check mobile number validation
    var mbcnt = mobileno.length;
    if(mbcnt != 10){
      validation = false
      toastMsg('Your mobile number is not correct !!')
    } else {
      validation = true
    }

    // Check email id
    if(emailid.includes('@') && emailid.includes('.com')){
      validation = true
    } else {
      validation = false
      toastMsg('Your Email ID is not correct !!')
    }

  } else {

    validation = false
    toastMsg('Please fill all fields details !!')

  }


  // Update All Details
  if(validation) {
    displayOutput('All Details are OK.')

    let customedata = {}
    customedata['DESTINATION'] =  destination
    customedata['FROM'] = departurecity
    customedata['STARTDATE'] = startdate
    customedata['ENDDATE'] = enddate
    customedata['DATEOPTION'] = dateoptions
    customedata['NAME'] = name
    customedata['MOBILENO'] = mobileno
    customedata['EMAILID'] = emailid

    customedata['ADMINSTAGE'] = 'NEW'
    customedata['ADMINCOMMENT'] = ''

    customedata['USERUUID'] = uuid
    customedata['USERCOMMENT'] = ''

    

    writeDocument(customedata)



  }

  

}

// Write Document to Database
function writeDocument(data) {    

  // Update common doc 
  let comdata = {
    name: 'common'
  };
  
  // Add a new document in collection
  let setDoc = db.collection(coll_base_path).doc('COMMON').set(comdata);
  
  // Add a new document with a generated id.
  let addDoc = db.collection(quotesPath).add(data).then(ref => {
    displayOutput('Added document with ID: ', ref.id);

    updateUserBookingSection(ref.id,data)

    document.getElementById("col_section_1").style.display = 'none';
    document.getElementById("col_section_2").style.display = 'block';
  });

}

// Update User Booking Section
function updateUserBookingSection(bookingid,submitdata) {  

  // Check Session Data
  let status = getLoginUserStatus()
  if(status == 'true') {
    let userLoginData = getLoginUserData()
    
    // Profile Details
    let uuid = userLoginData['UUID']

    var userBookingPath = coll_base_path + 'USER/ALLUSER/' + uuid + '/BOOKINGS'

    let data = {
      BOOKINGID: quotesPath+'/' + bookingid,
      DESTINATION: submitdata['DESTINATION'],
      FROM: submitdata['FROM'],
      STARTDATE: submitdata['STARTDATE'],
      ENDDATE: submitdata['ENDDATE']
    };

    // Add a new document with a generated id.
  let addDoc = db.collection(userBookingPath).add(data).then(ref => {
    displayOutput('Added document with ID: ', ref.id);
    displayOutput('User Booking Added !!')
    
  });
 

  }

}


// ----------- START UP CALLS ----------------
function startUpCalls() {

  displayOutput('Startup Calls')

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function(){
    $('input.autocomplete').autocomplete({
      data: {
        "Apple": null,
        "Microsoft": null,
        "Google": 'https://placehold.it/250x250'
      },
    });
  });


  $(document).ready(function(){
    $('.datepicker').datepicker();
  });

  $(document).ready(function(){
    $('select').formSelect();
  });

}

