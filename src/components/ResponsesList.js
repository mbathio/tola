// src/components/ResponsesList.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase.js'; // Assurez-vous que le chemin vers votre fichier firebase.js est correct

const ResponsesList = () => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const responseCollection = collection(db, 'answers'); // Utilisation de la collection 'responses' de votre base de données
      const querySnapshot = await getDocs(responseCollection);
      const fetchedResponses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResponses(fetchedResponses);
    };

    fetchResponses();
  }, []);

  return (
    <div>
      <h2>Liste des Réponses</h2>
      <ul>
        {responses.map(response => (
          <li key={response.id}>
            <strong>{response.title}</strong>: {response.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResponsesList;
