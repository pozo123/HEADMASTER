
var id_boton_chido = "botonChidoRegs";
var rama_bd_registros = "test/proyectos/registros";
var rama_bd_obras = "test/obras";

$('#' + id_boton_chido).click(function(){

    /*//Ponerle atributo "activo" a los trabajadores
    firebase.database().ref("test/rrhh/trabajadores").once('value').then(function(snapshot){
        var trabajadores = snapshot.val();
        for(key in trabajadores){
            trabajadores[key]["activo"] = true;
        }
        console.log(trabajadores);
        //firebase.database().ref("test/rrhh/trabajadores").update(trabajadores);
    });*/

 /*   //Sumar horas previas a hoy a los procesos adecuados, generando un registro de SCORE
 //No lo uses, porque con los cambios en la bd ya no jala
    firebase.database().ref("test/obras").once('value').then(function(obrasSnap){
        var horas = [];
        var updates = obrasSnap.val();
        horas["Otros"] = {};
        horas["Otros"]["ie"] = 0;
        horas["Otros"]["ihs"] = 0;
        obrasSnap.forEach(function(oSnap){
            horas[oSnap.key] = {};
            oSnap.child("procesos").forEach(function(pSnap){
                if(pSnap.child("num_subprocesos").val() > 0){
                    horas[oSnap.key][pSnap.key] = [];
                    pSnap.child("subprocesos").forEach(function(sSnap){
                        horas[oSnap.key][pSnap.key][sSnap.key] = {};
                        horas[oSnap.key][pSnap.key][sSnap.key]["ie"] = 0;
                        horas[oSnap.key][pSnap.key][sSnap.key]["ihs"] = 0;
                    });
                } else {
                    horas[oSnap.key][pSnap.key] = {};
                    horas[oSnap.key][pSnap.key]["ie"] = 0;
                    horas[oSnap.key][pSnap.key]["ihs"] = 0;
                }
            });
            horas[oSnap.key]["PC00"] = {};
            horas[oSnap.key]["PC00"]["PC00-MISC"] = {};
            horas[oSnap.key]["PC00"]["PC00-MISC"]["ie"] = 0;
            horas[oSnap.key]["PC00"]["PC00-MISC"]["ihs"] = 0;
        });
        firebase.database().ref("proyectos/obras").once('value').then(function(opSnap){
            var obras = opSnap.val();
            var sinproc = {};
            firebase.database().ref("proyectos/registros").once('value').then(function(registrosSnap){
                //var i = 0;
                registrosSnap.forEach(function(regSnap){
                    var reg = regSnap.val();
                    var esp = reg.esp == "ie" ? "ie" : "ihs";
                    if(reg.obra == "Otros"){
                        horas["Otros"][esp] += parseFloat(reg.horas);
                    } else {
                        var obr = obras[reg.obra];
                        if(obr == undefined){
                            console.log(reg);
                            console.log("UNDEFINED: " + reg.obra)
                        } else {
                            var proc = obr["presupuestos"][reg.presupuesto]["proceso"];
                            if(proc != undefined){
                                var path = proc.split("-");
                                //console.log(i);
                                //i++;
                                if(path.length > 1){
                                    horas[reg.obra][path[0]][proc][esp] += parseFloat(reg.horas);
                                } else {
                                    if(proc == "PC00"){
                                        horas[reg.obra][proc]["PC00-MISC"][esp] += parseFloat(reg.horas);
                                    } else {
                                        if(proc == ""){
                                            console.log(reg);
                                        }
                                        horas[reg.obra][proc][esp] += parseFloat(reg.horas);
                                    }
                                }
                            } else {
                                if(!sinproc[reg.obra]){
                                    sinproc[reg.obra] = {};
                                }
                                if(!sinproc[reg.obra][reg.presupuesto]){
                                    sinproc[reg.obra][reg.presupuesto] = 0;
                                }
                                sinproc[reg.obra][reg.presupuesto] += 1; 
                                //console.log("El ppto " + reg.obra + "/" + reg.presupuesto + " no tiene proceso asignado");
                            }
                        }
                    }
                });
                console.log(sinproc);
                console.log(horas);
                var hoy = getWeek(new Date().getTime());
                for(key in horas){
                    for(pkey in horas[key]){
                        if(horas[key][pkey]["ie"] == undefined){
                            for(skey in horas[key][pkey]){
                                if(horas[key][pkey][skey]["ie"] != ""){
                                    console.log(key + "/" + pkey + "/" + skey + "/ie: " + horas[key][pkey][skey]["ie"]);
                                    updates[key]["procesos"][pkey]["subprocesos"][skey]["SCORE"]["total_trabajado"] = 0;//parseFloat(horas[key][pkey][skey]["ie"]) / 3600000;
                                    updates[key]["procesos"][pkey]["subprocesos"][skey]["SCORE"]["inges"]["ddwrspraE4P4JSc0DsjfGHG29qO2"]["horas_trabajadas"] = 0;//parseFloat(horas[key][pkey][skey]["ie"]) / 3600000;
                                    var newreg = {
                                        checkin: new Date().getTime(),
                                        esp: "ie",
                                        horas: horas[key][pkey][skey]["ie"],
                                        inge: "ddwrspraE4P4JSc0DsjfGHG29qO2",
                                        obra: key,
                                        proceso: skey,
                                        status: true,
                                    }
                                    firebase.database().ref("test/proyectos/registros" + "/" + hoy[1] + "/" + hoy[0]).push(newreg);
                                }
                                if(horas[key][pkey][skey]["ihs"] != ""){
                                    console.log(key + "/" + pkey + "/" + skey + "/ihs: " + horas[key][pkey][skey]["ihs"]);
                                    updates[key]["procesos"][pkey]["subprocesos"][skey]["SCORE"]["total_trabajado"] = 0;//parseFloat(horas[key][pkey][skey]["ihs"]) / 3600000;
                                    updates[key]["procesos"][pkey]["subprocesos"][skey]["SCORE"]["inges"]["ddwrspraE4P4JSc0DsjfGHG29qO2"]["horas_trabajadas"] = 0;//parseFloat(horas[key][pkey][skey]["ihs"]) / 3600000;
                                    var newreg = {
                                        checkin: new Date().getTime(),
                                        esp: "ihs",
                                        horas: horas[key][pkey][skey]["ihs"],
                                        inge: "ddwrspraE4P4JSc0DsjfGHG29qO2",
                                        obra: key,
                                        proceso: skey,
                                        status: true,
                                    }
                                    firebase.database().ref("test/proyectos/registros" + "/" + hoy[1] + "/" + hoy[0]).push(newreg);
                                }
                            }
                        } else {
                            if(pkey == "PC00"){
                                if(horas[key][pkey]["PC00-MISC"]["ie"] != ""){
                                    console.log(key + "/" + pkey + "/ie/PC00-MISC: " + horas[key][pkey]["PC00-MISC"]["ie"]);
                                    updates[key]["procesos"][pkey]["subprocesos"]["PC00-MISC"]["SCORE"]["total_trabajado"] += parseFloat(horas[key][pkey]["PC00-MISC"]["ie"]) / 3600000;
                                    updates[key]["procesos"][pkey]["subprocesos"]["PC00-MISC"]["SCORE"]["inges"]["ddwrspraE4P4JSc0DsjfGHG29qO2"]["horas_trabajadas"] += parseFloat(horas[key][pkey]["PC00-MISC"]["ie"]) / 3600000;
                                    var newreg = {
                                        checkin: new Date().getTime(),
                                        esp: "ie",
                                        horas: horas[key][pkey]["PC00-MISC"]["ie"],
                                        inge: "ddwrspraE4P4JSc0DsjfGHG29qO2",
                                        obra: key,
                                        proceso: "PC00-MISC",
                                        status: true,
                                    }
                                    firebase.database().ref("test/proyectos/registros" + "/" + hoy[1] + "/" + hoy[0]).push(newreg);
                                }
                                if(horas[key][pkey]["PC00-MISC"]["ihs"] != ""){
                                    console.log(key + "/" + pkey + "/ihs/PC00-MISC: " + horas[key][pkey]["PC00-MISC"]["ihs"]);
                                    updates[key]["procesos"][pkey]["subprocesos"]["PC00-MISC"]["SCORE"]["total_trabajado"] += parseFloat(horas[key][pkey]["PC00-MISC"]["ihs"]) / 3600000;
                                    updates[key]["procesos"][pkey]["subprocesos"]["PC00-MISC"]["SCORE"]["inges"]["ddwrspraE4P4JSc0DsjfGHG29qO2"]["horas_trabajadas"] += parseFloat(horas[key][pkey]["PC00-MISC"]["ihs"]) / 3600000;
                                    var newreg = {
                                        checkin: new Date().getTime(),
                                        esp: "ihs",
                                        horas: horas[key][pkey]["PC00-MISC"]["ihs"],
                                        inge: "ddwrspraE4P4JSc0DsjfGHG29qO2",
                                        obra: key,
                                        proceso: "PC00-MISC",
                                        status: true,
                                    }
                                    firebase.database().ref("test/proyectos/registros" + "/" + hoy[1] + "/" + hoy[0]).push(newreg);
                                }
                            } else {
                                if(horas[key][pkey]["ie"] != ""){
                                    console.log(key + "/" + pkey + "/ie: " + horas[key][pkey]["ie"]);
                                    updates[key]["procesos"][pkey]["SCORE"]["total_trabajado"] += parseFloat(horas[key][pkey]["ie"]) / 3600000;
                                    updates[key]["procesos"][pkey]["SCORE"]["inges"]["ddwrspraE4P4JSc0DsjfGHG29qO2"]["horas_trabajadas"] += parseFloat(horas[key][pkey]["ie"]) / 3600000;
                                    var newreg = {
                                        checkin: new Date().getTime(),
                                        esp: "ie",
                                        horas: horas[key][pkey]["ie"],
                                        inge: "ddwrspraE4P4JSc0DsjfGHG29qO2",
                                        obra: key,
                                        proceso: pkey,
                                        status: true,
                                    }
                                    firebase.database().ref("test/proyectos/registros" + "/" + hoy[1] + "/" + hoy[0]).push(newreg);
                                }
                                if(horas[key][pkey]["ihs"] != ""){
                                    console.log(key + "/" + pkey + "/ihs: " + horas[key][pkey]["ihs"]);
                                    updates[key]["procesos"][pkey]["SCORE"]["total_trabajado"] += parseFloat(horas[key][pkey]["ihs"]) / 3600000;
                                    updates[key]["procesos"][pkey]["SCORE"]["inges"]["ddwrspraE4P4JSc0DsjfGHG29qO2"]["horas_trabajadas"] += parseFloat(horas[key][pkey]["ihs"]) / 3600000;
                                    var newreg = {
                                        checkin: new Date().getTime(),
                                        esp: "ihs",
                                        horas: horas[key][pkey]["ihs"],
                                        inge: "ddwrspraE4P4JSc0DsjfGHG29qO2",
                                        obra: key,
                                        proceso: pkey,
                                        status: true,
                                    }
                                    firebase.database().ref("test/proyectos/registros" + "/" + hoy[1] + "/" + hoy[0]).push(newreg);
                                }
                            }
                        }
                    }
                }
                console.log(updates);
                //firebase.database().ref("test/obras").update(updates);
                //horas[reg.obra]["procesos"][path[0]]["subprocesos"][path[1]]["SCORE"]["total_trabajado"] 
            });
        });
    });
*/

    //Agregar atributos SCORE, y cambiar el formato de fechas en todas las obras/procesos/subps
    /*firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        var score = {
            total_prog: 0,
            total_trabajado: 0,
            programado: false,
            inges: "",
        }
        var pc00misc = {
            terminado: false,
            nombre: "Miescelaneos preproyecto",
            alcance: "Miscelaneos preproyecto",
            clave: "PC00-MISC",
            SCORE: score,
            categoria: "MISCELANEO",
            kaizen: kaiz,
            fecha_inicio: 0,
            fecha_final: 0,
            presupuesto: "",
        }
        var updates = snapshot.val();
        snapshot.forEach(function(childSnap){
            updates[childSnap.key]["terminada"] = false;
            updates[childSnap.key]["procesos"]["PC00"]["subprocesos"] = {};
            updates[childSnap.key]["procesos"]["PC00"]["subprocesos"]["PC00-MISC"] = pc00misc;
            childSnap.child("procesos").forEach(function(procSnap){
                console.log(childSnap.key)
                updates[childSnap.key]["procesos"][procSnap.key]["terminado"] = false;
                updates[childSnap.key]["procesos"][procSnap.key]["fecha_inicio"] = procSnap.child("fechas/fecha_inicio_teorica").val();
                updates[childSnap.key]["procesos"][procSnap.key]["fecha_final"] = procSnap.child("fechas/fecha_final_teorica").val();
                updates[childSnap.key]["procesos"][procSnap.key]["fechas"] = null;
                if(procSnap.child("num_subprocesos").val() > 0){
                    procSnap.child("subprocesos").forEach(function(subpSnap){
                        updates[childSnap.key]["procesos"][procSnap.key]["subprocesos"][subpSnap.key]["terminado"] = false;
                        updates[childSnap.key]["procesos"][procSnap.key]["subprocesos"][subpSnap.key]["SCORE"] = score;
                        updates[childSnap.key]["procesos"][procSnap.key]["subprocesos"][subpSnap.key]["fecha_inicio"] = subpSnap.child("fechas/fecha_inicio_teorica").val();
                        updates[childSnap.key]["procesos"][procSnap.key]["subprocesos"][subpSnap.key]["fecha_final"] = subpSnap.child("fechas/fecha_final_teorica").val();
                        updates[childSnap.key]["procesos"][procSnap.key]["subprocesos"][subpSnap.key]["fechas"] = null;
                    });
                } else {
                    updates[childSnap.key]["procesos"][procSnap.key]["SCORE"] = score;
                }
            });
        });
        console.log(updates);
        //firebase.database().ref(rama_bd_obras).update(updates);
    });*/

    /*
    //PRORRATEAR MISCELANEOS
    //FALTA DEFINIR LALA Y LELE
    firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
        snapshot.forEach(function(obra_snap){
            var obra = obra_snap.val();
            var kaizen_total = obra.kaizen;
            var proc_misc = obra.procesos.MISC.kaizen;
            obra_snap.child("procesos").forEach(function(proc_snap){
                var proc = proc_snap.val();
                //lala = .PRODUCCION.COPEO.PREC... o para proporcion con venta?
                var proporcion = parseFloat(proc.kaizen.lala) / parseFloat(kaizen_total.lala);
                var aumento = parseFloat(proc_misc.lala) * proporcion;
                var valor_nuevo = parseFloat(proc.kaizen.lala) + aumento;
                //lele = nueva direccion (ej COSTO_MISC)
                console.log(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/lele: " + valor_nuevo);
                //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/lele").set(valor_nuevo);
                if(proc.num_subprocesos > 0){
                    proc_snap.child("subprocesos").forEach(function(sub_snap){
                        var subp = sub_snap.val();
                        //lala = .PRODUCCION.COPEO.PREC... o para proporcion con venta?
                        var proporcion = parseFloat(proc.kaizen.lala) / parseFloat(kaizen_total.lala);
                        var aumento = parseFloat(proc_misc.lala) * proporcion;
                        var valor_nuevo = parseFloat(proc.kaizen.lala) + aumento;
                        //lele = nueva direccion (ej COSTO_MISC)
                        console.log(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/lele: " + valor_nuevo);
                        //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/lele").set(valor_nuevo);
                    });
                }
            });
        });
    });
    */

    /*
    //AGREGAR PROFIT BRUTO Y NETO A TODAS LAS OBRAS, PROCESO Y SUBPROCESOS
    var profit_kaiz = {
        PROG: {
            BRUTO: 0,
            NETO: 0,
        },
        REAL: {
            BRUTO: 0,
            NETO: 0,
        },
    };
    firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
        snapshot.forEach(function(obra_snap){
            var obra = obra_snap.val();
            console.log(rama_bd_obras_magico + "/" + obra.nombre + "/kaizen/PROFIT");
            //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/kaizen/PROFIT").set(profit_kaiz);
            obra_snap.child("procesos").forEach(function(proc_snap){
                var proc = proc_snap.val();
                console.log(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/PROFIT");
                //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/PROFIT").set(profit_kaiz);
                if(proc.num_subprocesos > 0){
                    proc_snap.child("subprocesos").forEach(function(sub_snap){
                        var subp = sub_snap.val();
                        console.log(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/subprocesos/" + subp.clave + "/kaizen/PROFIT");
                        //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/subprocesos/" + subp.clave + "/kaizen/PROFIT").set(profit_kaiz);
                    });
                }
            });
        });
    });
    */

    /*
    //CAMBIAR REGISTROS "MISCELANEOS" POR "OTROS"
    var i = 0;
    firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            var flag = true;
            if(reg.obra == "Miscelaneo"){
                console.log("Registro " + i + ": " + reg.cu + " actualizado.");
                i++;
                var obj = "Otros";
                firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/obra").set(obj);
            }
        });
    });
    */

    //REGISTROS CON MAS DE 15 HORAS -> 9 HORAS
    /*
    var i = 0;
    firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            if(reg.horas/3600000 > 15){
                i++;
                console.log("Registro " + i + ": " + cu + " acotado.");
                //firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/horas").set(9);
            }
        });
    });
    */

    //RESETEAR TODAS LAS HORAS TRABAJADAS DE LOS PPTOS A 0
    
/*     firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(obra_snap){
            obra_snap.child("presupuestos").forEach(function(presu_snap){//CHECA QUE SI SEA ASI
                var presu = presu_snap.val();
                firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/horas_trabajadas").set(0);
                console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/horas_trabajadas" + " = 0");
                presu_snap.child("colaboradores_asignados/ie").forEach(function(col_snap){
                    var col = col_snap.key;
                    firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ie/" + col + "/horas_trabajadas").set(0);               
                    console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ie/" + col + "/horas_trabajadas" + " = 0");
                });
                presu_snap.child("colaboradores_asignados/ihs").forEach(function(col_snap){
                    var col = col_snap.key;
                    firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ihs/" + col + "/horas_trabajadas").set(0);               
                    console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ihs/" + col + "/horas_trabajadas" + " = 0");
                });
            });
        });
    });
     */
    
    //RESETAR TODAS LAS HORAS TRABAJADAS EN INGES/OBRAS/PPTO A 0
/*     firebase.database().ref(rama_bd_inges).once('value').then(function(snapshot){

        snapshot.forEach(function(inge_snap){
            inge_snap.child("obras").forEach(function(obra_snap){
                obra_snap.forEach(function(presu_snap){
                    if(presu_snap.key != "obra"){
                        firebase.database().ref(rama_bd_inges + "/" + inge_snap.key + "/obras/" + obra_snap.key + "/" + presu_snap.key + "/horas_trabajadas").set(0);
                        console.log("Modificando: " + rama_bd_inges + "/" + inge_snap.key + "/obras/" + obra_snap.key + "/" + presu_snap.key + "/horas_trabajadas");
                    }
                });
            });
        });
    });  */

    //VOLVER A CARGAR LAS HORAS TRABAJADAS A TODOS LOS PPTOS DESDE REGISTROS
    //1 de 2 lugares a actualizar:
    //horas_trabajadas en presu
    
    /* firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){

        var json = {};
        snapshot.forEach(function(obra_snap){
            var json_obra = {};
            obra_snap.child("presupuestos").forEach(function(presu_snap){
                json_obra[presu_snap.val().nombre] = 0;
            });
            json[obra_snap.val().nombre] = json_obra;
        });
        
        firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
            var count = 0;
            snapshot.forEach(function(childSnapshot){
                var regis = childSnapshot.val();
                count++;
                console.log(count);
                console.log(regis.obra);
                if(regis.obra != "Otros"){
                    console.log(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas")
                    firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas").once('value').then(function(snapshot){
                        
                        console.log("hola");
                        var horas_nuevas = 0;
                        var horas = snapshot.val();
                        console.log("horas de db " + horas)
                        if(horas != null){
                            horas_nuevas = horas + regis.horas/3600000;
                        } else {
                            horas_nuevas = regis.horas/3600000;
                        }
                        console.log("horas sumadas " + horas_nuevas)
                        json[regis.obra][regis.presupuesto] = json[regis.obra][regis.presupuesto] + horas_nuevas;
                        var horas_ppto = json[regis.obra][regis.presupuesto];
                        firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas").set(horas_ppto);
                        console.log(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas")
                    });
                    
                }
            });
        });
        
    }); */

    //2 de 2 lugares a actualizar:
    //horas_trabajadas en el colaborador especifico en colaboradores_asignados
/*     firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){

        var json = {};
        snapshot.forEach(function(obra_snap){
            var json_obra = {};
            obra_snap.child("presupuestos").forEach(function(presu_snap){
                var json_ppto = {
                    ie: {},
                    ihs: {},
                };
                presu_snap.child("colaboradores_asignados/ie").forEach(function(snap_ie){
                    if(snap_ie.val().nombre != null){
                        console.log(snap_ie.val());
                        json_ppto.ie[snap_ie.val().nombre] = 0; 
                    }
                });
                presu_snap.child("colaboradores_asignados/ihs").forEach(function(snap_ihs){
                    if(snap_ihs.val().nombre != null){
                        json_ppto.ihs[snap_ihs.val().nombre] = 0; 
                    }
                });
                json_obra[presu_snap.val().nombre] = json_ppto;
            });
            json[obra_snap.val().nombre] = json_obra;
        });
        
        firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
            var count = 0;
            snapshot.forEach(function(childSnapshot){
                var regis = childSnapshot.val();
                if(regis.obra != "Otros"){
                    var esp = "ihs";
                    if(regis.esp == "ie"){
                        esp = "ie";
                    }
                    firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp).orderByChild("nombre").equalTo(regis.inge).once('value').then(function(snapshot){
                        snapshot.forEach(function(snap_inge){
                            var username = snap_inge.key;
                            var horas = snap_inge.val().horas_trabajadas;
                            var horas_nuevas = 0;
                            if(horas != null){
                                horas_nuevas = horas + regis.horas/3600000;
                            } else {
                                horas_nuevas = regis.horas/3600000;
                            }
                            json[regis.obra][regis.presupuesto][esp][regis.inge] += horas_nuevas;
                            var horas_ppto = json[regis.obra][regis.presupuesto][esp][regis.inge];
                            firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp + "/" + username + "/horas_trabajadas").set(horas_ppto);
                        })
                    });
                    
                }
            });
        });
        
    });
 */

        //ELIMINAR REGISTROS NUESTROS
        /*
        var i = 0;
    firebase.database().ref(rama_bd_registros).on('value',function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            var flag = true;
            firebase.database().ref(rama_bd_inges).orderByChild("nombre").equalTo(reg.inge).once('child_added').then(function(ing_snapshot){
                var ing = ing_snapshot.val();
                if(flag === true && ing.credenciales === 0){
                    //firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/esp").set(ing.esp_chamba);
                    var cu = reg.cu;
                    //console.log("Registro " + i + ": " + cu + " eliminado.");
                    firebase.database().ref(rama_bd_registros).child(cu).once('value').then(function(snapshot){
                        var update = {};
                        update[cu] = null;
                        //firebase.database().ref(rama_bd_registros).update(update);
                    });
                    flag = false;
                }
            });
        });
    });
    */
   
});