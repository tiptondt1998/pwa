request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('Transaction', { autoIncrement: true });
  };

request.onsuccess = function(event) {   
    db = event.target.result;
    if (navigator.onLine) {
    }
  };
  
  request.onerror = function(event) {
    console.log(event.target.errorCode);
  };
function saveRecord(record) {
    const transaction = db.transaction(['Transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('budget');
    transactionObjectStore.add(record);
  }
  function uploadTransaction() {
    const transaction = db.transaction(['Transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('Transaction');
    const getAll = transactionObjectStore.getAll();
  }
  // upon a successful .getAll() execution, run this function
getAll.onsuccess = function() {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch('../../routes/api.js', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['Transaction'], 'readwrite');
          // access the new_pizza object store
          const transactionObjectStore = transaction.objectStore('Transaction');
          // clear all items in your store
          pizzaObjectStore.clear();

          alert('All saved transactions has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  module.exports = idb;