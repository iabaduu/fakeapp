// Definisce un nome univoco per la cache della nostra app.
// Cambia questo nome se aggiorni i file nella cache per forzare l'aggiornamento.
const CACHE_NAME = 'pdf-archive-cache-v1';

// Elenco dei file fondamentali dell'app da salvare nella cache.
// Questi file costituiscono "l'involucro" dell'app.
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
    // NON includere le icone o i PDF qui, verranno gestiti diversamente.
];

// Evento 'install': viene eseguito quando il service worker viene installato per la prima volta.
self.addEventListener('install', event => {
    // Aspetta che l'operazione di caching sia completata prima di considerare l'installazione finita.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aperta');
                // Aggiunge tutti i file dell'involucro dell'app alla cache.
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento 'fetch': viene eseguito ogni volta che la pagina richiede una risorsa (es. un'immagine, un file css, o la pagina stessa).
self.addEventListener('fetch', event => {
    event.respondWith(
        // Cerca la risorsa richiesta nella cache.
        caches.match(event.request)
            .then(response => {
                // Se la risorsa è trovata nella cache, la restituisce.
                if (response) {
                    return response;
                }
                // Altrimenti, prova a recuperarla dalla rete.
                return fetch(event.request);
            })
    );
});

// Evento 'activate': viene eseguito dopo l'installazione e serve per pulire le vecchie cache.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Se una cache non è nella whitelist (cioè è vecchia), viene eliminata.
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
