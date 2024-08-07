importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


  // Your web app's Firebase configuration
  firebase.initializeApp({
    apiKey: "AIzaSyBIPzIuad25EYpSGYcuWaiUSU4G9t7WR1A",
    authDomain: "shopping-568d2.firebaseapp.com",
    projectId: "shopping-568d2",
    storageBucket: "shopping-568d2.appspot.com",
    messagingSenderId: "678533035799",
    appId: "1:678533035799:web:a3a2e10faffdb34b8be952"
  });


  const messaging = firebase.messaging();


  messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
