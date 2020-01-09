//Este archivo contiene solo funciones genericas

/*
===============================================================================
=============== Funciones referentes a imagenes del storage ===================
===============================================================================
*/

// Función para obtener los url de todas las imagenes guardadas en una ruta
function getAllFirebaseStorageGeneric(ruta){
  var storageRef = firebase.storage().ref(ruta);
  var images_url = [];
  var promise = new Promise(function(resolve, reject) {
    if(flagDownloadAdicionales){
      resolve(images_url);
    } else {
      // Now we get the references of these images
      storageRef.listAll().then(function(result) {
          //console.log(result);
          var total = result.items.length;
          var cont = 0;
          var indice = 0;
          var aux_array;
          result.items.forEach(function(imageRef) {
            getDownloadURLSyncGeneric(imageRef, images_url, indice).then(function(){
              //console.log(images_url);
              cont += 1;
              if(cont == total){
                resolve(images_url);
              }
            }).catch(function(error) {
              reject(Error("Download fail"));
            });
            indice+=1;
          });
      }).catch(function(error) {
        reject(Error("Folder fail"));
      });
    }
  });
  return promise;
}

// Funcion para agregar en orden las urls al arreglo de imagenes
// (Los arreglos son pasados por referencia de memoria)
function getDownloadURLSyncGeneric(image_ref, aux_array, aux_index){
  var promise = new Promise(function (resolve, reject){
    image_ref.getDownloadURL().then(function(url){
      aux_array[aux_index] = url;
      resolve();
    }).catch(function(error){
      reject(Error("Get download url fail"));
    });
  });
  return promise;
}

// Funcion para transformar un arrayBuffer a base64
function arrayBufferToBase64Generic( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

// Función para descargar una imagen del storage a partir de una url de descarga
function downloadImageGeneric(download_url){
  //console.log("Donwload image");
  var promise = new Promise(function(resolve, reject) {
    // Now we get the references of these images
    var xhr_response = new XMLHttpRequest();
    xhr_response.responseType = 'blob';
    xhr_response.onload = function(event) {
      var blob = xhr_response.response;
      blob.arrayBuffer().then(function(respuesta){
        var image_url = 'data:image/jpeg;base64,' + arrayBufferToBase64Generic(respuesta);
        resolve(image_url);
      }).catch(function(error) {
        reject(Error("Download fail"));
      });
    }
    xhr_response.open('GET', download_url);
    xhr_response.send();
  });
  return promise;
}

// Función para descargar una imagen del storage a partir de una url de descarga
// y guardarla en un arreglo en el indice correspondiente
function downloadImageSyncGeneric(download_url, output_array, index){
  var promise = new Promise(function(resolve, reject){
    downloadImageGeneric(download_url).then(function(image_url){
      output_array[index] = image_url;
      resolve();
    }).catch(function(error){
      reject(Error("Download fail"));
    });
  });
  return promise;
}

// Función para descargar todas las imágenes de un array con sus respectivas url
// Al editar esta función y todas las involucradas, tener cuidado con la
// sincronía y el uso de las promesas
function downloadAllImagesGeneric(download_array){
  var total = download_array.length;
  var promise = new Promise(function(resolve, reject) {
    if(flagDownloadAdicionales){ // Si ya se descargaron las imagenes y no hay cambios, no volver a descargarlas
      resolve();
    } else { // Descargar imagnenes de firebase storage
      download_images_url=[];
      var cont = 0;
      for (var i=0; i<download_array.length; i++){
        downloadImageSyncGeneric(download_array[i], download_images_url, i).then(function (){
          cont+=1;
          if(cont == total){ // Descargas completas
            resolve();
          }
        }).catch(function(error){
          reject(Error("Download fail"));
        });
      }
    }
  });
  return promise;
}

// Función para cargar todas las imagenes de un array al storage en la ruta dada
function uploadAllImagesGeneric(ruta, fotos_seleccionadas){
  var storageRef = firebase.storage().ref(ruta);
  var images_url = [];
  var promise = new Promise(function(resolve, reject) {
    var name_array;
    var metadata;
    var cont = 0;
    var name_foto='';
    for(var i=0; i<fotos_seleccionadas.length; i++){
      name_array = fotos_seleccionadas[i].name.split(".");
      metadata = {contentType: 'image/'+ name_array[name_array.length-1],};
      name_foto = i<10?'0'+i+'_'+fotos_seleccionadas[i].name: i+'_'+fotos_seleccionadas[i].name;
      var uploadTask = storageRef.child(name_foto).put(fotos_seleccionadas[i], metadata);
      uploadTask.on('state_changed', function(snapshot){
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
      }, function(error) {
        // Handle unsuccessful uploads
        console.log('Error al cargar la imagen');
        reject(Error("Upload fail"));
      }, function() {
        // Handle successful uploads on complete
        cont+=1;
        if(cont==fotos_seleccionadas.length){
          resolve(images_url);
        }
      });
    }
  });
  return promise;
}

/*
===============================================================================
=========== Funciones referentes a consultas a la base de datos ===============
===============================================================================
*/

function cargaListaTrabajadoresGeneric(){
  aux_json = {};
  firebase.database().ref(rama_bd_datos_referencia + "/puestos").on('value',function(snapshot){
      puestos_json = snapshot.val();
      snapshot.forEach(function(snapChild){ //Contar todos los subprocesos de la misma categoría para ese proceso
        puesto = snapChild.val();
        aux_json[snapChild.key] = puesto.puesto;
      })
  });
  return aux_json;
}

// Metodo para cargar las obras activas en un ddl generico
// id_objeto = ddl de la obra
function ddlObrasActivasGeneric (id_objeto){
  $('#' + id_objeto).empty();
  var select = document.getElementById(id_objeto);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var obra;
  firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
      obra = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = obra.nombre;
      select.appendChild(option);
  });
}

// Metodo para llenar ddl de atenciones de una obra (depende del cliente registrado)
// id_objeto = ddl de las atenciones
function llenaDdlAtnGeneric(id_objeto, obra){
  firebase.database().ref(rama_bd_obras + "/obras/" + obra +"/id_cliente").on('value',function(snapshot){
    var cliente_id = snapshot.val();
    $('#' + id_objeto).empty();
    var select = document.getElementById(id_objeto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var atencion;
    firebase.database().ref(rama_bd_clientes + "/contactos/"+ cliente_id).on('child_added',function(snapshot){
      atencion = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = atencion.prefijo + " " + atencion.nombre_completo;
      select.appendChild(option);
    });
  });
}

/*
===============================================================================
============ Funciones referentes al manejo de elementos html =================
===============================================================================
*/

// Función para extrer los elementos seleccionados de un select
function extraeListaGeneric(select, json_padre){
  var aux = select.selected();
  var json_resp={};
  for(var i=0; i<aux.length; i++){
    json_resp[aux[i]] = json_padre[aux[i]];
  }
  return json_resp;
}
