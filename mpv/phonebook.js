var phonebook=[];
function displayAlert(text){
	var alert = document.getElementById('alert');
	alert.style.display = "block";
	alert.innerHTML = text;
	window.setTimeout(function(){alert.style.display = "none"}, 3000);
}

function readFile() {
	var input = document.getElementById('file');
	if (!input.files.length) {
		displayAlert('Please select a file!');
		return;
	}

	var file = input.files[0];
	input.value = "";
	var reader = new FileReader();
	reader.onloadend = function(e) {
		if (e.target.readyState == FileReader.DONE) {
			var json = e.target.result;
			try{
				phonebook = JSON.parse(json);
			}catch(e){
				displayAlert("File is not valid");
				return;
			}
			var l = phonebook.length;
			var k = [];
			for (var i = 0; i < l; i++) {
				if (!phonebook[i].hasOwnProperty('name') || !checkName(phonebook[i].name)){
					k.push(i);
					continue;
				}
				if (!phonebook[i].hasOwnProperty('surname') || !checkName(phonebook[i].surname) ){
						k.push(i);
						continue;
				}	
				if (!phonebook[i].hasOwnProperty('number') || !checkNumber(phonebook[i].number)){
					k.push(i);
					continue;
				}
			}
			if(k.length>0){
				for (var i = k.length - 1; i >= 0; i--) {
					removeRecord(k[i]);
				}
				displayAlert("Error: Phonebook loaded, but "+k.length+" record/s have been ignored because they are not valid");
			}
			else {
				displayAlert("Phonebook loaded successfully!");
			}
		}
	}
	reader.readAsBinaryString(file);
}

function checkName(name){
	var regexp = /^[\w ]+$/;
	return regexp.test(name);
}

function checkNumber(n){
	var regexp = /^\+\d{1,3} \d+ \d{6,}$/;
	return regexp.test(n);
}

function removeRecord(i){
	phonebook.splice(i,1);
	if (typeof(Storage) !== 'undefined') {
		localStorage.setItem('save', 'false');
	}
}