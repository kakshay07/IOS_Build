self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : 'No payload';
  console.log(data, 'notification Payload');
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon : data.icon,
      data:{
        url : data.url
      }
    })
  );
});

self.addEventListener('install' , (event)=>{
  console.log('Install event');
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      let clientFound = false;

      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        const targetUrlParsed = new URL(targetUrl);

        if (clientUrl.href === targetUrl || clientUrl.origin === targetUrlParsed.origin) {
          // Focus the existing client
          client.focus();
          clientFound = true;
          // Reload the focused client
          client.navigate(targetUrl); 
          return; // Exit the loop if we found and focused the client
        }
      }

      // If no existing client was found, open a new window
      if (!clientFound) {
        clients.openWindow(targetUrl);
      }
    })
  );
});
