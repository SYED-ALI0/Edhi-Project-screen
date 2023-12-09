import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCM6pESG4IODwYWE6AcYIaXXhIAAJjF6hk",
  authDomain: "edhi-project.firebaseapp.com",
  projectId: "edhi-project",
  storageBucket: "edhi-project.appspot.com",
  messagingSenderId: "127140236694",
  appId: "1:127140236694:web:bdee3a6e5faf1d406ba1b7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
