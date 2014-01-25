/*--  init  --*/
var phonebook=[];

/*--  dom  --*/
	/*-- edit --*/

function displayAlert(text){
	var alert = document.getElementById('alert');
	alert.style.display = "block";
	alert.innerHTML = text;
	window.setTimeout(function(){alert.style.display = "none"}, 3000);
}

function newHtml(){
	var html ='<input type="text" id="edit-name"/>';
	html +='<input type="text" id="edit-surname"/>';
	html +='<input type="text" id="edit-number"/>';
	html +='<div id="new-cancel" onclick="newCancel();">Cancel</div>'
	document.getElementById("new-record").innerHTML = html;
	var n = document.getElementById('new');
	n.setAttribute("onclick", "newRecord();");
	n.innerHTML= "Save";
}

function newCancel() {
	document.getElementById("new-record").innerHTML = "";
	document.getElementById('new').setAttribute("onclick", "newHtml();");
}

function editHtml(i){
	var nameHtml = document.querySelector("#r"+i+" > .name");
	var surnameHtml = document.querySelector("#r"+i+" > .surname");
	var numberHtml = document.querySelector("#r"+i+" > .number");
	var editHtml = document.querySelector("#r"+i+"> .edit");
	var deleteHtml = document.querySelector("#r"+i+"> .delete");
	nameHtml.innerHTML='<input type="text" id="edit-name" value="'+phonebook[i].name+'" />';
	surnameHtml.innerHTML='<input type="text" id="edit-surname" value="'+phonebook[i].surname+'" />';
	numberHtml.innerHTML='<input type="text" id="edit-number" value="'+phonebook[i].number+'" />';
	editHtml.setAttribute("onclick",'editRecord('+i+');');
	editHtml.innerHTML = "Save";
	deleteHtml.setAttribute("onclick","cancelEdit("+i+");");
	deleteHtml.innerHTML = "Cancel";

}

function cancelEdit(i){
	var record = document.getElementById('r'+i);
	var html = '<div class="name">name:'+phonebook[i].name+'</div>';
	html += '<div class="surname">surname:'+phonebook[i].surname+'</div>';
	html += '<div class="number">number:'+phonebook[i].number+'</div>';
	html += '<div class="edit" onclick="editHtml('+i+')">Edit</div><div class="delete" onclick="removeRecord('+i+')">Delete</div>'
	record.innerHTML = html;
}

function toHtml(obj){
	var html = '';
	for (var i = 0; i < obj.length; i++) {
		html += '<div id="r'+obj[i].id+'" class="record">';
		html += '<div class="name">name:'+obj[i].name+'</div>';
		html += '<div class="surname">surname:'+obj[i].surname+'</div>';
		html += '<div class="number">number:'+obj[i].number+'</div>';
		html += '<div class="edit" onclick="editHtml('+obj[i].id+')">Edit</div><div class="delete" onclick="removeRecord('+obj[i].id+')">Delete</div>'
		html += '</div>';
	}
	if(html == ""){
		html = "No results" 
	}
	document.getElementById('result').innerHTML = html;
}

	/*-- interaction  --*/

window.addEventListener("beforeunload", function (e) {
	if (typeof(Storage) !== 'undefined') {
			var save = localStorage.getItem('save');
	}
	if (save != 'true'){
		var confirmationMessage = "You are exit without a backup! Your data may be lost.";
		(e || window.event).returnValue = confirmationMessage;
		return confirmationMessage;
	}
});

function download() {
	if (phonebook.length){
		var json = JSON.stringify(phonebook);
		var a = document.querySelector('#save > a');
		a.setAttribute('href', 'data:text/plain;charset=utf-8,'+ encodeURIComponent(json));
		a.click();
		localStorage.setItem('save', "true");
	}else{
		displayAlert("No data");
	}
}


function readFile(replace) {
	var input = document.getElementById('file');
	if (!input.files.length) {
		displayAlert('Please select a file!');
		return;
	}
	if(replace){
		phonebook = [];
	}

	var file = input.files[0];
	input.value = "";
	var reader = new FileReader();
	reader.onloadend = function(e) {
		if (e.target.readyState == FileReader.DONE) {
			var json = e.target.result;
			try{
				var pb = JSON.parse(json);
			}catch(e){
				displayAlert("File is not valid");
				return;
			}
			var l = pb.length;
			var k = 0;
			for (var i = 0; i < l; i++) {
				if (isDuplicate(pb[i])){
					k++
					continue;
				}
				if (!pb[i].hasOwnProperty('name') || !checkName(pb[i].name)){
					k++;
					continue;
				}
				if (!pb[i].hasOwnProperty('surname') || !checkName(pb[i].surname) ){
					k++;
					continue;
				}	
				if (!pb[i].hasOwnProperty('number') || !checkNumber(pb[i].number)){
					k++;
					continue;
				}
				phonebook.push(pb[i]);
			}
			if (k > 0){
				displayAlert("Error: Phonebook loaded, but "+k+" record/s have been ignored because they are not valid");
			}
			else {
				displayAlert("Phonebook loaded successfully!");
			}
			search();
		}
	}
	reader.readAsBinaryString(file);
}

/*--  PhoneBook  --*/
function search(){
	var search = document.getElementById('search').value.trim() + "£";
	search = search.replace(/surname:/i,"£2");
	search = search.replace(/name:/i,"£1");
	search = search.replace(/number:/i,"£3");		
	var l = phonebook.length;
	var result = [];
	for (var i = 0; i < l; i++){
		var case1=/£1/.test(search);
		var case2=/£2/.test(search);
		var case3=/£3/.test(search);
		if (case1 || case2 || case3){
			var match1 = false;
			var match2 = false;
			var match3 = false;
			if(case1){
				var r = search.match(/£1(.*?) *£/)[1].trim();
				var regexp = new RegExp(r,"i");
				if(regexp.test(phonebook[i].name)){
					match1 = true;
				}
			}
			if(case2) {
				var r = search.match(/£2(.*?) *£/)[1].trim();
				var regexp = new RegExp(r,"i");
				if(regexp.test(phonebook[i].surname)){
					match2 = true;
				}
			}
			if(case3) {
				var r = search.match(/£3(.*?) *£/)[1].trim();
				var regexp = new RegExp(r,"i");
				if(regexp.test(phonebook[i].number)){
					match3 = true;
				}
			}
			if((case1 == match1)&&(case2 == match2)&&(case3 == match3)){
				var temp = {
					"name" : phonebook[i].name,
					"surname" : phonebook[i].surname,
					"number" : phonebook[i].number,
					"id" : i
				}
				result.push(temp);
			}
		} else {
			var regexp = search.slice(0,-1).split(" ");
			var text = phonebook[i].name + " " + phonebook[i].surname + " " + phonebook[i].number;
			var match = true;
			for (var j = 0; j < regexp.length; j++) {
				regexp[j] = new RegExp(regexp[j], "i");
				if(!regexp[j].test(text)){
					match = false;
					break;
				}
			}	
			if(match){
				var temp = {
					"name" : phonebook[i].name,
					"surname" : phonebook[i].surname,
					"number" : phonebook[i].number,
					"id" : i
				}
				result.push(temp);						
			}
		}	
	}
	toHtml(result);
}

function checkName(name){
	var regexp = /^[\w ]+$/;
	return regexp.test(name);
}

function checkNumber(n){
	var regexp = /^\+\d{1,3} \d+ \d{6,}$/;
	return regexp.test(n);
}

function isDuplicate(e){
	bool = false;
	for (var i = 0; i < phonebook.length; i++) {
		if(phonebook[i].name == e.name && phonebook[i].surname == e.surname && phonebook[i].number == e.number){
			bool = true;
			break;
		} 
	}
	return bool;
}

function removeRecord(i,silent){
	silent = silent || false;
	phonebook.splice(i,1);
	if (typeof(Storage) !== 'undefined') {
		localStorage.setItem('save', 'false');
	}
	if(!silent){
		displayAlert("Record delete");
	}
}

function editRecord(i){
	var name = document.querySelector('#r'+i+' #edit-name').value.trim();
	var surname = document.querySelector('#r'+i+' #edit-surname').value.trim();
	var number = document.querySelector('#r'+i+' #edit-number').value.trim();
	if(checkName(name) && checkName(surname) && checkNumber(number)){
		var e = {
			"name" : name,
			"surname" : surname,
			"number" : number
		};
		if(isDuplicate(e)){
			displayAlert("This record already exists");
		} else {
			phonebook[i].name = name;
			phonebook[i].surname = surname;
			phonebook[i].number = number;
			cancelEdit(i);
			displayAlert("Record update");
		}
	} else {
		displayAlert("One or more field are not valid");
	}

}
function newRecord(){
	var name = document.getElementById('edit-name').value.trim();
	var surname = document.getElementById('edit-surname').value.trim();
	var number = document.getElementById('edit-number').value.trim();
	if(checkName(name) && checkName(surname) && checkNumber(number)){
		var e = {
			"name" : name,
			"surname" : surname,
			"number" : number
		};
		if(isDuplicate(e)){
			displayAlert("This record already exists");
		} else {
			phonebook.push(e);
			displayAlert("New record added");
			document.getElementById("new-record").innerHTML = "";
			document.getElementById('new').setAttribute("onclick", "newHtml();");
			search();
		}
	} else {
		displayAlert("One or more field are not valid");
	}
}

function removeRecord(i,silent){
	silent = silent || false;
	phonebook.splice(i,1);
	if (typeof(Storage) !== 'undefined') {
		localStorage.setItem('save', 'false');
	}
	if(!silent){
		document.getElementById('r'+i).remove();
		displayAlert("Record delete");
	}
	search();
}