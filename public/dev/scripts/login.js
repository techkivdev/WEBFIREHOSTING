// *******************************************************************************
// SCRIPT : login.js
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

// Global Variables
let userData = {}
var userDataPath = coll_base_path + 'USER/ALLUSER'
var uuid = ''
var allDocCmpData = {}

// Startup Call
startupcalls()


// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(auth);

// Firebase Auth Configuration
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';

      authDetails()
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '#',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);



// ===========================================================
// Collect user details after sign in complete 
// ===========================================================
function authDetails() {
  firebase.auth().onAuthStateChanged(function (user) {

    // Is user login or not
    if (user) {

      displayOutput('User login !!')

      //document.getElementById("main_profile_section").style.display = 'block';
      document.getElementById("login_header_section").style.display = 'none';
      document.getElementById("spinner").style.display = 'block';

      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      uuid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;

      user.getIdToken().then(function (accessToken) {

        // User Data        
        userData['NAME'] = displayName
        userData['EMAIL'] = email
        userData['UUID'] = uuid
        userData['PHOTOURL'] = photoURL
        userData['ROLE'] = 'USER'
        userData['MOBILE'] = ''
        userData['BIO'] = ''
        userData['NICKNAME'] = ''        

        // Update User Details into Database
        updateUserDetails(uuid, userData)
      });
    } else {
      // User is signed out.

      displayOutput('User logout !!')
      localStorageData('ISUSER',false)
      document.getElementById("main_profile_section").style.display = 'none';
      document.getElementById("login_header_section").style.display = 'block';
      document.getElementById("spinner").style.display = 'none';

    }
  }, function (error) {
    displayOutput(error);
  });
};


// =============================================================
// Sign Out User 
// =============================================================
function signout() {
  auth.signOut().then(function () {
    // Sign-out successful.
    displayOutput('Signout Sucess..')
    toastMsg('Logout Done !!')
    
    localStorageData('ISUSER',false)

  }).catch(function (error) {
    // An error happened.
  });

}

// ==============================================================
// Update User Details into Database
// ==============================================================
function updateUserDetails(uuid, userdata) {

  // Check User Doc Exist or Not
  let ref = db.collection(userDataPath).doc(uuid);
  let getDoc = ref.get()
    .then(doc => {

      if (!doc.exists) {
        displayOutput('No such document!');
        displayOutput('Create New User Doc.');

        // ----- Remove later --------
        // Add a new document in collection
        db.collection(coll_base_path).doc('USER').set({
          name: 'user'
        });

        // Create new user data doc
        db.collection(userDataPath).doc(uuid).set(userdata).then(function () {
          displayOutput("User Data Updated !!");

          toastMsg('Your profile created !!')

          // Update HTML Page
          updateHTMLPage()

        });


      } else {
        displayOutput('User Data already present.');

        userData = doc.data()

        updateHTMLPage()

      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);
    });




}

// Update Session Data
function updateSessionData() {
  // Update Session Data
  localStorageData('ISUSER',true)
  localStorageData('UUID',userData['UUID'])
  localStorageData('NAME',userData['NAME'])
  localStorageData('EMAIL',userData['EMAIL'])
  localStorageData('MOBILE',userData['MOBILE'])
  localStorageData('ROLE',userData['ROLE']) 
  
  displayOutput('Session Data Updated ...')
}


// ==============================================================
// Update Complete HTML Page
// ==============================================================
function updateHTMLPage() {
  displayOutput('Update HTML Page ..')

  displayOutput(userData)

  updateSessionData()

  collectBookingDetails()

  // Create User Content
  let user_content = '<h5>' + userData['NAME'] + '</h5>\
                       <h5>' + userData['EMAIL'] + '</h5>\
                       <h5>' + userData['MOBILE'] + '</h5>'

  $("#user_content").html(user_content)

  document.getElementById("user_profile_image").src = userData['PHOTOURL']

  // Profile Details
  document.getElementById("user_name").value = userData['NAME']
  document.getElementById("user_email").value = userData['EMAIL']
  document.getElementById("user_mobile").value = userData['MOBILE']


  document.getElementById("spinner").style.display = 'none';
  document.getElementById("main_profile_section").style.display = 'block';


  // Update Admin Options

  if (userData['ROLE'] != 'USER') {
    let adminOptions = '<br>\
  <h5>Admin Options</h5>\
    <div class="collection">\
        <a href="#!" class="collection-item">User Managment</a>\
        <a href="managedetails.html" class="collection-item">Booking Managment</a>\
        <a href="project_settings.html" class="collection-item">Content Managment</a> </div>\
  </div>'


    $("#admin_options").html(adminOptions)
  }



}


// ==================================================================
// Start up Calls 
// ==================================================================
function startupcalls() {

  $(document).ready(function () {
    $('.tabs').tabs();
  });

  $(document).ready(function () {
    M.updateTextFields();
  });

}


// ==================================================================
// Update and Save Profile Data
// ==================================================================
function saveprofiledata() {
  displayOutput('Save Profile Data ...')

  displayOutput(userData)

  var mobileno = document.getElementById("user_mobile").value;
  displayOutput('Mobile Number : ' + mobileno)

  // Check mobile number validation
  var mbcnt = mobileno.length;
  if (mbcnt != 10) {
    validation = false
    toastMsg('Your mobile number is not correct !!')
  } else {
    validation = true
  }



  if (validation) {
    userData['MOBILE'] = mobileno

    db.collection(userDataPath).doc(uuid).update({
      MOBILE: mobileno
    }).then(function () {
      displayOutput("Mobile details Updated ..");

      toastMsg('Mobile details updated !!')

      // Update Session Data Also
      localStorageData('MOBILE',mobileno)


    });

  }

}


// =================================================================
// Collect Bookings Details
// =================================================================
function collectBookingDetails() {

  var userBookingPath = coll_base_path + 'USER/ALLUSER/' + uuid + '/BOOKINGS'

  var totaldocCount = 0;

  db.collection(userBookingPath).get().then((querySnapshot) => {
    displayOutput("SIZE : " + querySnapshot.size);

    if (querySnapshot.size == 0) {
      // ------ No Details Present -------------  
      displayOutput('No Record Found !!')
      
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

          // Update HTML Page
          updateBookingHTMLPage()
        }

      });

    }

  });

}

function updateBookingHTMLPage() {
  displayOutput('Update Booking Page ..')

  var allCardDetails = ''

  for (eachid in allDocCmpData) {
    var eachData = allDocCmpData[eachid]
    allCardDetails += createCard(eachid, eachData)
    //displayOutput(eachData)
  }

  // Update HTML Page
  $("#user_bookings").html(allCardDetails);


}

// Create card details
function createCard(id, data) {

  // Create Details
  let details = ''

  details += '<div class="left-align">\
  <p>'+ data['FROM'] + '  ->  ' + data['DESTINATION'] + '</p>\
  <p>'+ data['STARTDATE'] + '  ->  ' + data['ENDDATE'] + '</p>\
  \
  </div>'


  var cardDetails = '<div class="col s12 m4">\
  <div class="card">\
    <div class="card-content">\
      <span class="card-title"><b>'+ data['DESTINATION'] + '</b></span>' + details
    + '<br><a onclick="openViewDialog(\'' + id + '\')" class="waves-effect waves-light btn blue">View</a></div> </div></div>'

  return cardDetails

}

function openViewDialog(id) {
  displayOutput(id)
}