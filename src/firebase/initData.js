// src/firebase/initData.js
import { db } from './firebase'; // Assurez-vous que ce chemin est correct
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const initialCategories = [
  { name: "Technologie" },
  { name: "Science" },
  { name: "Mathématiques" },
  { name: "Histoire" }
];

const initialUsers = [
  { uid: "user1", email: "user1@example.com", displayName: "User One", createdAt: Timestamp.fromDate(new Date()), role: "user" },
  { uid: "admin1", email: "admin1@example.com", displayName: "Admin One", createdAt: Timestamp.fromDate(new Date()), role: "admin" }
];

const initializeData = async () => {
  try {
    const categoryPromises = initialCategories.map(category => 
      addDoc(collection(db, 'categories'), category)
    );
    const userPromises = initialUsers.map(user => 
      addDoc(collection(db, 'users'), user)
    );

    await Promise.all([...categoryPromises, ...userPromises]);
    console.log("Données initialisées avec succès");
  } catch (e) {
    console.error("Erreur lors de l'initialisation des données: ", e);
  }
}

initializeData();
