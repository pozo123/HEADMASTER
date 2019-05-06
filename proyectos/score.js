var rama_bd_personal = "test/personal";

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        userUID = user.uid;
        firebase.database().ref(rama_bd_personal + "/" + userUID).once("value").then(function (snapshot) {

            var user_bd = snapshot.val();

            var usuarioNombre = document.getElementById('usuarioConectado');
            usuarioNombre.innerHTML = user_bd.nickname;
            var creden = user_bd.credenciales;
            console.log(rama_bd_personal);
            if(creden == 3){
                console.log("creden3");
                $('#tabAltaCliente').addClass('hidden');
                $('#tabAltaReqsExcs').removeClass('hidden');
                $('#tabAltaTiposGens').removeClass('hidden');
                $('#tabReporte').removeClass('hidden');
                $('#tabReportePpto').removeClass('hidden');
                $('#tabRegistrosProy').removeClass('hidden');
                $('#tabActivar').addClass('hidden');
                $('#tabPagos').addClass('hidden');
                $('#tabPermisos').addClass('hidden');
                $('#pageSubmenuCierre').addClass('hidden');
                $('#pageSubmenuActRegs').addClass('hidden');
            } else if(creden == 2 || creden == 1 || creden == 0){
                $('#tabAltaCliente').removeClass('hidden');
                $('#tabAltaReqsExcs').removeClass('hidden');
                $('#tabAltaTiposGens').removeClass('hidden');
                $('#tabReporte').removeClass('hidden');
                $('#tabReportePpto').removeClass('hidden');
                $('#tabActivar').removeClass('hidden');
                $('#tabPagos').removeClass('hidden');
                $('#pageSubmenuCierre').removeClass('hidden');
                $('#pageSubmenuActRegs').removeClass('hidden');
                if(creden == 2){
                    $('#tabRegistrosProy').removeClass('hidden');
                    $('#tabPermisos').addClass('hidden');
                } else {
                    $('#tabPermisos').removeClass('hidden');
                    $('#tabRegistrosProy').addClass('hidden');
                }
            } else {
                $('#tabAltaCliente').addClass('hidden');
                $('#tabAltaReqsExcs').addClass('hidden');
                $('#tabAltaTiposGens').addClass('hidden');
                $('#tabReporte').addClass('hidden');
                $('#tabReportePpto').addClass('hidden');
                $('#tabRegistrosProy').addClass('hidden');
                $('#tabActivar').addClass('hidden');
                $('#tabPagos').addClass('hidden');
                $('#tabPermisos').addClass('hidden');
                $('#pageSubmenuCierre').addClass('hidden');
                $('#pageSubmenuActRegs').addClass('hidden');
            }
        });
    } else {
        alert("Inicia sesión para entrar a comunidad");
        window.location.reload("index.html");
        window.location.assign("index.html");
    }
});