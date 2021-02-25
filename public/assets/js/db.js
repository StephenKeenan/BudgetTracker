// needs to connect to indexdb
// needs to set up store for pending
// on success, check nagivator to see if online; if yes, then run function checkdatabase; function save recrod
// checkdatabase function

let db; 
// We request a database instance.
 const request = indexedDB.open("budgetDatabase", 1);
  
 request.onupgradeneeded = event => {
     let db = event.target.result
     db.createObjectStore("pending", {autoIncrement: true})
 };

 // This returns a result that we can then manipulate.
 request.onsuccess = event => {
   // console.log(request.result);
   db = event.target.result;
   if (navigator.onLine){
       checkDatabase()
   }
 };

 function saveRecord(record){
     const transaction = db.transaction(["pending"], "readwrite");
     const store = transaction.objectStore("pending");
     store.add(record)
 };

 function checkDatabase(){
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
    getAll.onsuccess = () => {
        if (getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                }
              })
              .then(response => {    
                return response.json();
              })
              .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear()
              })
        }
    }
 };

 window.addEventListener("online", checkDatabase)

 //review week 17 class activities