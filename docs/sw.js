// sw.js


// Handle fetch events in Service Worker
self.addEventListener("fetch", (event) => {
    if (event.request.method === "POST") {
        event.respondWith(
            fetch(event.request).then((response) => {
                const clonedResponse = response.clone();
                clonedResponse.json().then(data => {
                    storeResponse(event.request.url, data);
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