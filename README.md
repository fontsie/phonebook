Phonebook
=========

Exercise: telephone directory web application for XPeppers.

I write my app only with javascript, there is nothing to configure, but take care to run it in a browser that supports html5 with js active.

Files
----

-	phonebook.js -> contains the heart of application;
-	app.js -> contains functions for DOM interactions;
-	index.html -> html structure;
-	style.css -> css rules;

You do not need anything else.

Features
--------

-	load:	
	You can upload a json file with your personal phonebook. You can choose between *replace* or *import*. The first will erase all data and replace them with new ones. The second will add the new data to those already present.
	If your browser support Local Storage the data will be load at the start from there.

-	search:
	You can search a phonebook's record. The result will show while you're tiping. You can write the words to filter in any order. For example, the record that we are looking for is "Pietro Di Bello", this match with "Pietro Di Bello", but also with "Di Bello Pietro", or "Di Pietro Bello" ecc.
	You can also write only a part of the word: "D Pie ll". Or without spaces "PietroDiBello", in this case the order is important (NameSurnameNumber).
	There are 3 tags for a specific research, "name:" for a search by name, "surname:" for surname and "number:" for number. Yuo can write more of one tag, and in the order you want. 
			
-	add/edit/delete
	With the specific buttons you can modify your phonebook. All changes will be saved in the Local Storage.

-	backup
	Anytime you can download a json file with all records. If you've made changes and try to close the browser whitout a backup you will be asked a confirm.