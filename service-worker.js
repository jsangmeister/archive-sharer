// Install and activate events
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method === 'POST') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const sharedUrl = formData.get('url');
      const url = new URL(sharedUrl);
      url.search = ''; // Query entfernen
      const target = `https://archive.ph/newest/${url.toString()}`;
      return Response.redirect(`index.html?url=${encodeURIComponent(target)}`, 303);
    })());
    return;
  }
  event.respondWith(fetch(event.request));
});
