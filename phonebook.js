function Phonebook(){
	var record = [];
}

Phonebook.prototype.readFile = function(element,replace) {
	var input = element;
	if (!input.files.length) {
		displayAlert('Please select a file!');
		return;
	}
	if(replace){
		this.record = [];
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
				this.record.push(pb[i]);
			}
			if (k > 0){
				displayAlert("Error: Phonebook loaded, but "+k+" record/s have been ignored because they are not valid");
			}
			else {
				displayAlert("Phonebook loaded successfully!");
			}
			//search();
		}
	}
	reader.readAsBinaryString(file);
}

Phonebook.prototype.search = function(text) {
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
	//toHtml(result);
	return result;
}
};