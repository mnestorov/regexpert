const CACHE_NAME = 'regex-pattern-generator-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/templates/head.hbs',
    '/assets/favicon.ico',
    '/assets/css/app.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/material-darker.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js',
    'https://cdn.jsdelivr.net/npm/handlebars/dist/handlebars.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/clike/clike.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/javascript/javascript.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/python/python.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/ruby/ruby.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/go/go.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/swift/swift.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/perl/perl.min.js',
    '/assets/js/app.js'
];

self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
