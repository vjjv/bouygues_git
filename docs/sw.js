// sw.js

const dbName = "CacheDB";
const storeName = "CacheStore";

// Open IndexedDB
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' }); // Define keyPath here
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
        
        // Use URL as the unique identifier or create your own id
        store.put({ id: url, data: data }); // Use URL as id for simplicity
    });
}

// Retrieve cached response from IndexedDB
function getCachedResponse(url) {
    return new Promise((resolve, reject) => {
        openDatabase().then((db) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.get(url); // Use URL to get the cached response

            request.onsuccess = (event) => {
                resolve(event.target.result ? event.target.result.data : null);
            };

            request.onerror = (event) => {
                reject("Error fetching data from IndexedDB.");
            };
        });
    });
}

// Handle fetch events in Service Worker
self.addEventListener("fetch", (event) => {
    if (event.request.method === "POST") {
        event.respondWith(
            fetch(event.request).then((response) => {
                const clonedResponse = response.clone();
                
                // Extract JSON data from response
                clonedResponse.json().then(data => {
                    storeResponse(event.request.url, data); // Store the data
                });

                return response; // Return the original response
            })
        );
    } else if (event.request.method === "GET") {
        event.respondWith(
            getCachedResponse(event.request.url).then(cachedData => {
                if (cachedData) {
                    return new Response(JSON.stringify(cachedData), { status: 200 });
                } else {
                    return fetch(event.request).catch(() => {
                        // Fallback to an offline page if needed
                        return caches.match('/offline.html');
                    });
                }
            })
        );
    }
});