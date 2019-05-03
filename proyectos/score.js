var rama_bd_inges = "proyectos/inges";

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        userUID = user.uid;
        var flag = true;
        firebase.database().ref(rama_bd_inges).orderByChild('uid').equalTo(user.uid).once("child_added", function (snapshot) {
                if(flag === true){

                var user_bd = snapshot.val();

                var usuarioNombre = document.getElementById('usuarioConectado');
                usuarioNombre.innerHTML = user_bd.nickname;
                
                if(user_bd.permisos.alta_colaborador === true)
                    $('#tabAltaColaborador').removeClass('hidden');
                else
                    $('#tabAltaColaborador').addClass('hidden');

                if(user_bd.permisos.alta_obra === true)
                    $('#tabAltaObra').removeClass('hidden');
                else
                    $('#tabAltaObra').addClass('hidden');

                if(user_bd.permisos.alta_cliente === true)
                    $('#tabAltaCliente').removeClass('hidden');
                else
                    $('#tabAltaCliente').addClass('hidden');

                if(user_bd.permisos.alta_exc_reqs === true)
                    $('#tabAltaReqsExcs').removeClass('hidden');
                else
                    $('#tabAltaReqsExcs').addClass('hidden');

                if(user_bd.permisos.alta_generos_tipos === true)
                    $('#tabAltaTiposGens').removeClass('hidden');
                else
                    $('#tabAltaTiposGens').addClass('hidden');


                if(user_bd.permisos.reporte === true)
                    $('#tabReporte').removeClass('hidden');
                else
                    $('#tabReporte').addClass('hidden');
                if(user_bd.permisos.reporte_presupuestos === true)
                    $('#tabReportePpto').removeClass('hidden');
                else
                    $('#tabReportePpto').addClass('hidden');

                    if(user_bd.permisos.perfil === true)
                    $('#tabPerfil').removeClass('hidden');
                else
                    $('#tabPerfil').addClass('hidden');
                
                if(user_bd.permisos.activar === true)
                    $('#tabActivar').removeClass('hidden');
                else
                    $('#tabActivar').addClass('hidden');

                if(user_bd.permisos.pagos === true)
                    $('#tabPagos').removeClass('hidden');
                else
                    $('#tabPagos').addClass('hidden');

                if(user_bd.credenciales === 2 || user_bd.credenciales === 1 || user_bd.credenciales === 0)
                    $('#tabPermisos').removeClass('hidden');
                else
                    $('#tabPermisos').addClass('hidden');
                    // agregar botón maestro
                if(user_bd.credenciales === 2 || user_bd.credenciales === 1 || user_bd.credenciales === 0)
                    $('#pageSubmenuCierre').removeClass('hidden');
                else
                    $('#pageSubmenuCierre').addClass('hidden');

                if(user_bd.credenciales === 0)
                    $('#pageSubmenuActRegs').removeClass('hidden');
                else
                    $('#pageSubmenuActRegs').addClass('hidden');
                    
                flag = false;
            }
            });
    } else {
        alert("Inicia sesión para entrar a comunidad");
        window.location.reload("index.html");
        window.location.assign("index.html");
    }
});