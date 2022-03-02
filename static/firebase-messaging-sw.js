
importScripts(
  'https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/8.0.1/firebase-messaging.js'
)
firebase.initializeApp({"apiKey":"AIzaSyBzmm6sp4VFkKaUTtP9ALEK3pCbat31UiI","authDomain":"websdl.firebaseapp.com","databaseURL":"https:\u002F\u002Fwebsdl-default-rtdb.firebaseio.com","projectId":"websdl","storageBucket":"websdl.appspot.com","messagingSenderId":"820308151770","appId":"1:820308151770:web:5a02592c25e9f1eac504e3","measurementId":"G-ZJD9YYSDW1","fcmPublicVapidKey":"BDkwidfGGWaGd2Eme2ksAtM0oVmbWu6ps6OlOkvB4W_baqpyUhXyyOo9H5YpO3M82aak5_XqJQrx9EZAcafUCdY"})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()
