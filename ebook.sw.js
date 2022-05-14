self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('video-store').then(function(cache) {
     return cache.addAll([
       '/'
       ,'/index.html'
       ,'/ebook.set.html'
       ,'/ebook.set.js'
       ,'/jszip.min.js'
       ,'/ebook.en.json'
       ,'/ebook.ru.json'
       ,'/ebook.set.en.json'
       ,'/ebook.set.ru.json'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
