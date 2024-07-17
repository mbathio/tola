import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app'; // Importez firebase/compat/app pour la version v9 de Firebase
import 'firebase/compat/firestore'; // Im

const ResponsesList = () => {
  const { questionId } = useParams(); // Si vous utilisez React Router pour récupérer l'ID de la question
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const responsesCollection = firebase.firestore().collection('questions').doc(questionId).collection('responses');
        const responsesSnapshot = await responsesCollection.get();
        const responsesList = responsesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResponses(responsesList);
      } catch (error) {
        console.error("Error fetching responses: ", error);
      }
    };

    fetchResponses();
  }, [questionId]);

  return (
    <div>
      <h1>Réponses à la Question</h1>
      <ul>
        {responses.map(response => (
          <li key={response.id}>
            <h2>{response.title}</h2>
            <p>{response.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResponsesList;
