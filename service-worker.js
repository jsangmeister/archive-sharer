// Install and activate events
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Intercept POST requests to /share-target
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (
    event.request.method === 'POST' &&
    url.pathname === '/archive-sharer/share'
  ) {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const sharedUrl = formData.get('url');
        const url = new URL(sharedUrl);
        url.searchParams.forEach((_, key) => {
          url.searchParams.delete(key);
        });
        // Redirect to archive.ph with the shared URL
        const target = `https://archive.ph/newest/${url.toString()}`;
        return Response.redirect(target, 303);
      })()
    );
    return;
  }
  // Default: just pass through
  event.respondWith(fetch(event.request));
});
