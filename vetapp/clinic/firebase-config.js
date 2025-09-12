import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Cấu hình Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyCzl3cQf0zAp-ZrSm4uUL3jneYA8kexdpY",
    authDomain: "clinic-annhonpet.firebaseapp.com",
    databaseURL: "https://clinic-annhopet-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "clinic-annhonpet",
    storageBucket: "clinic-annhonpet.firebasestorage.app",
    messagingSenderId: "151015786781",
    appId: "1:151015786781:web:6a9a64cde3c4d5af8c39f4"
};

// Khởi tạo và export các đối tượng app, db, auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };