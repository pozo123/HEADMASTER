var rama_bd_personal = "personal";
var id_dropdownMenu = "dropdownMenu";

$(document).ready(function() {

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            $("#navComunidad").removeClass("hidden");
            $("#loginEmail").addClass("hidden");
            $("#loginPassword").addClass("hidden");
            $("#loginAceptar").addClass("hidden");
            $("#cerrar").removeClass("hidden");

            firebase.database().ref(rama_bd_personal + "/" + user.uid + "/areas").once('value').then(function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    if(childSnapshot.val()){
                        var area = childSnapshot.key;
                        var a = document.createElement('a');
                        a.className = "dropdown-item";
                        a.href = "" + area + ".html";
                        var t = document.createTextNode(area);
                        a.appendChild(t);
                        var div = document.getElementById(id_dropdownMenu);
                        div.appendChild(a);
                    }
                });
            });

        } else {
            $("#cerrar").addClass("hidden");
        }
    }); 
    

});

$("#forgot").click(function () { 
    var auth = firebase.auth();
    firebase.auth().useDeviceLanguage();
    var emailAddress = document.getElementById("loginEmail").value;
    
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
});

$("#loginAceptar").click(function () { 

    var userEmail = document.getElementById("loginEmail").value;
    var userPass = document.getElementById("loginPassword").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        //Abre modal con reset password
        window.alert("Error: " + errorMessage);
    });

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            $("#navComunidad").removeClass("hidden");
            $("#loginEmail").addClass("hidden");
            $("#loginPassword").addClass("hidden");
            $("#loginAceptar").addClass("hidden");
            $("#cerrar").removeClass("hidden");

        } else {
            $("#cerrar").add("hidden");
        }
    }); 
});

$("#cerrar").click((function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

      location.reload();

}));
