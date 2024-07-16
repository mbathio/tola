// services/db.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Assurez-vous d'importer correctement votre instance de db Firebase

const questions = async (title, content, category) => {
  try {
    const docRef = await addDoc(collection(db, 'questions'), {
      title,
      content,
      category,
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export { questions };
