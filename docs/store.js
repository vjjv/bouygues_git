// app.js

// IndexedDB setup
const dbName = "CacheDB";
const storeName = "CacheStore";

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject("Database error: " + event.target.errorCode);
        };
    });
}

// Store POST response in IndexedDB
function storeResponse(url, data) {
    openDatabase().then((db) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.put({ url: url, data: data });
    });
}

// Retrieve cached response from IndexedDB
function getCachedResponse(url) {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.get(url);

            request.onsuccess = (event) => {
                resolve(event.target.result ? event.target.result.data : null);
            };

            request.onerror = (event) => {
                reject("Error fetching data from IndexedDB.");
            };
        });
    });
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

