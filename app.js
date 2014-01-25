var phonebook = new Phonebook();

function replace(){
	var e = getElementById('file');
	phonebook.readFile(e,true);
	search();
}

function import(){
	var e = getElementById('file');
	phonebook.readFile(e);
	search();
}

function search(){
	var text = document.getElementById('search');
	phonebook.search(text);
}
