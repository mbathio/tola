import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase'; // Assurez-vous que le chemin est correct
import { collection, getDocs } from 'firebase/firestore';

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fonction pour récupérer les questions depuis Firestore
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questions'));
        const questionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching questions: ', error);
      }
    };

    fetchQuestions();
  }, []); // Le tableau vide assure que useEffect s'exécute une seule fois au montage

  return (
    <div>
      <h2>Liste des questions</h2>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            <h3>{question.title}</h3>
            <p>Catégorie: {question.category}</p>
            <h4>Réponses:</h4>
            <ul>
              {question.responses?.map(response => (
                <li key={response.id}>
                  <p>{response.text}</p>
                  <p>Auteur: {response.author}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;
