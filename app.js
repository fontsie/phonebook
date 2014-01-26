var phonebook = new Phonebook();

function dontWorry(bool){
	if (typeof(Storage) !== 'undefined') {
		localStorage.setItem('save', bool);
	}
}

function replacePhonebook(){
	var e = document.getElementById('file');
	phonebook.clear();
	phonebook.readFile(e,search);
	dontWorry("true");
}

function importPhonebook(){
	var e = document.getElementById('file');
	phonebook.readFile(e,search);
	dontWorry("false");
}

function search(){
	var text = document.getElementById('search').value;
	var result = phonebook.search(text);
	toHtml(result);
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

function download(){
	var json = phonebook.toString();
	if (json){
		var a = document.querySelector('#save > a');
		a.setAttribute('href', 'data:text/plain;charset=utf-8,'+ encodeURIComponent(json));
		a.click();
		dontWorry("true");
	}else{
		phonebook.displayAlert("No data");
	}
}

function newHtml(){
	var html ='name:<input type="text" id="edit-name"/>';
	html +='surname:<input type="text" id="edit-surname"/>';
	html +='number:<input type="text" id="edit-number"/>';
	html +='<div id="new-cancel" onclick="newCancel();">Cancel</div>'
	document.getElementById("new-record").innerHTML = html;
	var n = document.getElementById('new');
	n.setAttribute("onclick", "newRecord();");
	n.innerHTML= "Save";
}

function newRecord(){
	var name = document.getElementById('edit-name').value.trim();
	var surname = document.getElementById('edit-surname').value.trim();
	var number = document.getElementById('edit-number').value.trim();
	if(phonebook.newRecord(name,surname,number)){
		document.getElementById("new-record").innerHTML = "";
		document.getElementById('new').setAttribute("onclick", "newHtml();");
		phonebook.displayAlert("New record added!")
		dontWorry("false");
		newCancel();
		search();
	} else {
		phonebook.displayAlert("One or more field are not valid");
	}
}

function newCancel(){
	var n = document.getElementById('new');
	document.getElementById("new-record").innerHTML = "";
	n.setAttribute("onclick", "newHtml();");
	n.innerHTML = "New";
}

function editHtml(i){
	var nameHtml = document.querySelector("#r"+i+" > .name");
	var surnameHtml = document.querySelector("#r"+i+" > .surname");
	var numberHtml = document.querySelector("#r"+i+" > .number");
	var editHtml = document.querySelector("#r"+i+"> .edit");
	var deleteHtml = document.querySelector("#r"+i+"> .delete");
	nameHtml.innerHTML='<input type="text" id="edit-name" value="'+phonebook.records[i].name+'" />';
	surnameHtml.innerHTML='<input type="text" id="edit-surname" value="'+phonebook.records[i].surname+'" />';
	numberHtml.innerHTML='<input type="text" id="edit-number" value="'+phonebook.records[i].number+'" />';
	editHtml.setAttribute("onclick",'editRecord('+i+');');
	editHtml.innerHTML = "Save";
	deleteHtml.setAttribute("onclick","cancelEdit("+i+");");
	deleteHtml.innerHTML = "Cancel";
}

function editRecord(i){
	var name = document.querySelector('#r'+i+' #edit-name').value.trim();
	var surname = document.querySelector('#r'+i+' #edit-surname').value.trim();
	var number = document.querySelector('#r'+i+' #edit-number').value.trim();
	var res = phonebook.editRecord(i,name,surname,number);
	if(res){
		if(res == 1){
			phonebook.displayAlert("This record already exists");
		} else {
			phonebook.displayAlert("Record update!");
			dontWorry("false");
			cancelEdit(i);
		}
	} else {
		phonebook.displayAlert("One or more field are not valid");
	}
}

function cancelEdit(i){
	var record = document.getElementById('r'+i);
	var html = '<div class="name">name:'+phonebook.records[i].name+'</div>';
	html += '<div class="surname">surname:'+phonebook.records[i].surname+'</div>';
	html += '<div class="number">number:'+phonebook.records[i].number+'</div>';
	html += '<div class="edit" onclick="editHtml('+i+')">Edit</div><div class="delete" onclick="removeRecord('+i+')">Delete</div>'
	record.innerHTML = html;
}

function removeRecord(i){
	phonebook.removeRecord(i);
	if (typeof(Storage) !== 'undefined') {
		dontWorry('false');
	}
	phonebook.displayAlert("Record delete");
	search();
}