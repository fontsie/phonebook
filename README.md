Phonebook
=========

Exercise: telephone directory web application for XPeppers.

My app is entirely written in javascript, there is nothing to configure, but take care to run it in a browser that supports html5 with js active.

Files
----

-	phonebook.js -> contains the heart of the application;
-	app.js -> contains functions for DOM interactions;
-	index.html -> html structure;
-	style.css -> css rules;

You do not need anything else.

Features
--------

-	load:	
	You can upload a json file with your personal phonebook. You can choose between *replace* or *import*. The first one will erase all data, which will be replaced by the newest one. The second one will add the new data to those already present.
	If your browser support Local Storage the data will be load at the start from there.

-	search:
	You can search a phonebook's record. You will get the result while you're tiping. You can write words in any order. For example, let's say the record that we're looking for is "Pietro Di Bello": it will match with "Pietro Di Bello", but also with "Di Bello Pietro", or "Di Pietro Bello", and so on...
	You can also write only a part of a word: "D Pie ll"; or without spaces: "PietroDiBello", but in this particular case you'll have to write the words in this specific order.
	There are 3 tags for a specific search, "name:" for a search by name, "surname:" for surname and "number:" for number. You can use any tags you want, in the order you want (surname: Fei name: Christian). 
			
-	add/edit/delete:
	With the specific buttons you can modify your phonebook. All changes will be saved in the Local Storage.

-	backup:
	You can download a json file with all records at any time. If you made changes and then try to close the browser whitout a backup, you will be asked a confirm.