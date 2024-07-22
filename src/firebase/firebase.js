// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCCpdUVCCz3HRumnu_vlN5cEBTelHFYBiA",
  authDomain: "tola-14414.firebaseapp.com",
  projectId: "tola-14414",
  storageBucket: "tola-14414.appspot.com",
  messagingSenderId: "18599793851",
  appId: "1:18599793851:web:9b7d9d407a4ca7d7bc459e",
  measurementId: "G-JZYFWV7T0J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Déclaration de db
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth };

// Fonction pour obtenir les questions par catégorie
export const getQuestionsByCategory = async (categoryId) => {
  try {
    // Référence à la collection "questions"
    const questionsRef = collection(db, 'questions');

    // Créez une requête avec la catégorie fournie
    const q = query(questionsRef, where('category', '==', categoryId));

    // Exécutez la requête
    const querySnapshot = await getDocs(q);

    // Retournez les données des documents récupérés
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching questions: ', error);
    return [];
  }
};
