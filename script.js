//some sample data
const todoData = [
   { activity: "Be Good" },
];

//the database reference
let db;

//initializes the database
function initDatabase() {

	//create a unified variable for the browser variant
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

		//if a variant wasn't found, let the user know
	if (!window.indexedDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}

   //attempt to open the database
	let request = window.indexedDB.open("todos", 1);
	request.onerror = function(event) {
		console.log(event);
	};

   //map db to the opening of a database
	request.onsuccess = function(event) { 
		db = request.result;
		console.log("success: " + db);
	};

   //if no database, create one and fill it with data
	request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("todo", {keyPath: "id", autoIncrement:true});
      
      for (var i in todoData) {
         objectStore.add(todoData[i]);
      }
   }
}

//adds a record as entered in the form
function add() {
	//get a reference to the fields in html
	let activity = document.querySelector("#input-box").value;

	//alert(id + name + email + age);
   
   //create a transaction and attempt to add data
	var request = db.transaction(["todo"], "readwrite")
	.objectStore("todo")
	.add({ activity: activity });

   //when successfully added to the database
	request.onsuccess = function(event) {
		alert(`${activity} has been added to your database.`);
	};

   //when not successfully added to the database
	request.onerror = function(event) {
	alert(`Unable to add data\r\n${activity} is already in your database! `);
	}

	readAll();

    document.querySelector("#input-box").value = "";

}

 function readAll() {
     clearList();
     
    var objectStore = db.transaction("todo").objectStore("todo");
    
    //creates a cursor which iterates through each record
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;
       
       if (cursor) {
          console.log("To Do: " + cursor.value.activity);
          addEntry(cursor.value.activity, cursor.value.id);
          cursor.continue();
       }
       
       else {
          console.log("No more entries!");
       }
    };
 }

function addEntry(activity, id) {
     // Your existing code unmodified...
    var iDiv = document.createElement('div');
    iDiv.className = 'entry';
    iDiv.innerHTML = activity + `<button class='x' onclick='remove(${id})'>X</button>`;
    document.querySelector("#entries").appendChild(iDiv);
 }
 function clearList() {
     document.querySelector("#entries").innerHTML = "";
 }

//deletes a record by id
function remove(item) {
// 	let x = document.querySelector(".x").value;
//    var request = db.transaction(["todo"], "readwrite")
//    .objectStore("todo")
//    .delete(x);
    var request = db.transaction(["todo"], "readwrite").objectStore("todo").delete(item);
    readAll();

}

initDatabase();