function Phonebook(){
	this.records = [];
	this.loadToLocalStorage();
}

Phonebook.prototype.validate = function(el) {
	if (this.isDuplicate(el)){
		return false;
	}
	if (!el.hasOwnProperty('name') || !this.checkName(el.name)){
		return false;
	}
	if (!el.hasOwnProperty('surname') || !this.checkName(el.surname) ){
		return false;
	}	
	if (!el.hasOwnProperty('number') || !this.checkNumber(el.number)){
		return false;
	}
	return true;
}

Phonebook.prototype.readFile = function(element,callback) {
	var input = element;
	if (!input.files.length) {
		this.displayAlert('Please select a file!');
		return;
	}
	var that = this;
	var file = input.files[0];
	input.value = "";
	var reader = new FileReader();
	reader.onloadend = function(e) {
		if (e.target.readyState == FileReader.DONE) {
			var json = e.target.result;
			try{
				var pb = JSON.parse(json);
			}catch(e){
				that.displayAlert("File is not valid");
				return;
			}
			var l = pb.length;
			var k = 0;
			for (var i = 0; i < l; i++) {
				if (!that.validate(pb[i])){
					k++
					continue;
				}
				pb[i].name = pb[i].name.trim();
				pb[i].surname = pb[i].surname.trim();
				pb[i].number = pb[i].number.trim();
				that.records.push(pb[i]);
			}
			if (k > 0){
				that.displayAlert("Error: Phonebook loaded, but "+k+" record/s have been ignored because they are not valid");
			}
			else {
				that.displayAlert("Phonebook loaded successfully!");
			}
			that.saveInLocalStorage();
			callback();
		}
	}
	reader.readAsBinaryString(file);
}

Phonebook.prototype.search = function(text) {
	var search = text.trim() + "£";
	search = search.replace(/surname:/i,"£2");
	search = search.replace(/name:/i,"£1");
	search = search.replace(/number:/i,"£3");		
	var l = this.records.length;
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
				r = r.split("").join(".*?");
				var regexp = new RegExp(r,"i");
				if(regexp.test(this.records[i].name)){
					match1 = true;
				}
			}
			if(case2) {
				var r = search.match(/£2(.*?) *£/)[1].trim();
				r = r.split("").join(".*?");
				var regexp = new RegExp(r,"i");
				if(regexp.test(this.records[i].surname)){
					match2 = true;
				}
			}
			if(case3) {
				var r = search.match(/£3(.*?) *£/)[1].trim();
				r = r.split("").join(".*?");
				var regexp = new RegExp(r,"i");
				if(regexp.test(this.records[i].number)){
					match3 = true;
				}
			}
			if((case1 == match1)&&(case2 == match2)&&(case3 == match3)){
				var temp = {
					"name" : this.records[i].name,
					"surname" : this.records[i].surname,
					"number" : this.records[i].number,
					"id" : i
				}
				result.push(temp);
			}
		} else {
			var regexp = search.slice(0,-1).split(" ");
			var text = this.records[i].name + " " + this.records[i].surname + " " + this.records[i].number;
			var match = true;
			for (var j = 0; j < regexp.length; j++) {
				regexp[j] = regexp[j].split("").join(".*?");
				regexp[j] = new RegExp(regexp[j], "i");
				if(!regexp[j].test(text)){
					match = false;
					break;
				}
			}	
			if(match){
				var temp = {
					"name" : this.records[i].name,
					"surname" : this.records[i].surname,
					"number" : this.records[i].number,
					"id" : i
				}
				result.push(temp);						
			}
		}	
	}
	return result;
}

Phonebook.prototype.displayAlert = function(text){
	try {
		var alert = document.getElementById('alert');
		alert.style.display = "block";
		alert.innerHTML = text;
		window.setTimeout(function(){alert.style.display = "none"}, 3000);
	} catch(e){
		console.log(e+" Element 'alert' doesn't exist");
	}
}

Phonebook.prototype.isDuplicate = function(e){
	bool = false;
	for (var i = 0; i < this.records.length; i++) {
		if(this.records[i].name == e.name && this.records[i].surname == e.surname && this.records[i].number == e.number){
			bool = true;
			break;
		} 
	}
	return bool;
}

Phonebook.prototype.checkName = function(name) {
	var regexp = /^[\w ]+$/;
	return regexp.test(name);
}

Phonebook.prototype.checkNumber = function(n) {
	var regexp = /^\+\d{1,3} \d+ \d{6,}$/;
	return regexp.test(n);
}

Phonebook.prototype.clear = function() {
	this.records=[];
	this.saveInLocalStorage();
	return;
}

Phonebook.prototype.toString = function() {
	if(this.records.length) {
		return JSON.stringify(this.records);
	} else {
		return false;
	}
}

Phonebook.prototype.newRecord = function(name,surname,number) {
	if(this.checkName(name) && this.checkName(surname) && this.checkNumber(number)){
		var e = {
			"name" : name,
			"surname" : surname,
			"number" : number
		};
		if(this.isDuplicate(e)){
			this.displayAlert("This record already exists");
		} else {
			this.records.push(e);
			this.displayAlert("New record added");
			this.saveInLocalStorage();
			return true;
		}
	} else {
		return false;
	}
}

Phonebook.prototype.editRecord = function(i,name,surname,number) {
	if(this.checkName(name) && this.checkName(surname) && this.checkNumber(number)){
		var e = {
			"name" : name,
			"surname" : surname,
			"number" : number
		};
		if(this.isDuplicate(e)){
			return 1;
		} else {
			this.records[i].name = name;
			this.records[i].surname = surname;
			this.records[i].number = number;
			this.saveInLocalStorage();
			return 2;
		}
	} else {
		return false;
	}
}

Phonebook.prototype.removeRecord = function(i) {
	this.records.splice(i,1);
	this.saveInLocalStorage();
}

Phonebook.prototype.saveInLocalStorage = function() {
	if (typeof(Storage) !== 'undefined') {
		var json = this.toString();
		var local = localStorage.getItem('phonebook');
		if (local != json){
			localStorage.setItem('phonebook', json);
		}
	}
}

Phonebook.prototype.loadToLocalStorage = function() {
	if (typeof(Storage) !== 'undefined') {
		var local = JSON.parse(localStorage.getItem('phonebook'));
		if (local){
			var l = local.length;
			for (var i = 0; i < l; i++) {
				if (!this.validate(local[i])){
					continue;
				}
				local[i].name = local[i].name.trim();
				local[i].surname = local[i].surname.trim();
				local[i].number = local[i].number.trim();
				this.records.push(local[i]);
			}
			alert("Phonebook load from localStorage");
		}
	}
}