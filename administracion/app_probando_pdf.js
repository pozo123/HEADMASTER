function pruebaPdf(){
	console.log("hola");
	// playground requires you to assign document definition to a variable called dd

	var dd = {
		content: [
			{
				text: 'This paragraph uses header style and extends the alignment property',
				style: 'header',
				alignment: 'center'
			},
			{
				text: [
					'This paragraph uses header style and overrides bold value setting it back to false.\n',
					'Header style in this example sets alignment to justify, so this paragraph should be rendered \n',
					'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
					],
				style: 'header',
				bold: false
			}
		],
		styles: {
			header: {
				fontSize: 18,
				bold: true,
				alignment: 'justify'
			}
		}
		
	}

	/*const pdfDocGenerator = pdfMake.createPdf(dd)
    pdfDocGenerator.open();
    pdfDocGenerator.download('hola.pdf');
    pdfDocGenerator.getBuffer(function(buffer){
    	blob = new Blob([buffer]);
    	console.log(blob);
    //console.log(pdfDocGenerator.getStream());

	    var storageRef = firebase.storage().ref("pruebas/getStream");
	    var uploadTask = storageRef.put(blob);
	    
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
	    }, function() {
	        // Handle successful uploads on complete
	        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
	        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
	            console.log('File available at', downloadURL);
	            var updates = {}
	            var data = {
	                url: downloadURL,
	            }
	            updates["/" + rama_bd_personal + "/" + userUID + "/foto"] = data;
	            //firebase.database().ref().update(updates);
	            
	            setTimeout(() => {
	                location.reload();
	            }, 3000);
	        });
	    });
	});*/
}