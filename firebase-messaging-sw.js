// firebase-messaging-sw.js
// Service worker — this is what lets a push notification show up even when
// the Study Console tab (or the whole browser) is closed. It runs in the
// background, separate from the page itself.
//
// IMPORTANT: this file must be served from the SAME origin as your site,
// at the ROOT (e.g. https://you.github.io/study-console/firebase-messaging-sw.js),
// not inside a subfolder — that's a Firebase requirement for its default
// registration scope.
//
// You must fill in FIREBASE_CONFIG below with your own project's config
// (Firebase console → Project settings → General → "Your apps"). It's the
// same object you'll paste into index.html.

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCtedToE5zSYNv3ykiEwFA5n1SLNRg4XJA',
  authDomain: 'study-console-ebd66.firebaseapp.com',
  projectId: 'study-console-ebd66',
  storageBucket: 'study-console-ebd66.firebasestorage.app',
  messagingSenderId: '119132570072',
  appId: '1:119132570072:web:ffce8b026e98bad849b2ad',
};

firebase.initializeApp(FIREBASE_CONFIG);
const messaging = firebase.messaging();

// Fires when a push arrives while no Study Console tab has focus.
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'Study Console reminder';
  const body = (payload.notification && payload.notification.body) || 'You have a task reminder.';

  self.registration.showNotification(title, {
    body,
    icon: 'https://em-content.zobj.net/source/apple/391/bell_1f514.png',
    badge: 'https://em-content.zobj.net/source/apple/391/bell_1f514.png',
    tag: (payload.data && payload.data.reminderId) || 'study-console-reminder',
    data: payload.data || {},
  });
});

// Clicking the notification focuses (or opens) the site.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
