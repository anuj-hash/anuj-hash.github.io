import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey:  "AIzaSyDo5MhlsozdHmrlTjUOO59gNSWEP83wJEw",
  authDomain: "ludo-game-8587b.firebaseapp.com",
  databaseURL:"https://ludo-game-8587b-default-rtdb.firebaseio.com",
  projectId:"ludo-game-8587b",
  storageBucket: "ludo-game-8587b.firebasestorage.app",
  messagingSenderId:"169803789770",
  appId: "1:169803789770:web:597758f22fbfd62cdfcb33"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
