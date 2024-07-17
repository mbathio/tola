import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase'; // Seul db est nécessaire ici

const QuestionDetail = () => {
  const { id } = useParams(); // Récupère l'id de la route
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        // Fetch question
        const questionDoc = await db.collection('questions').doc(id).get(); // Utilise id ici
        setQuestion({ id: questionDoc.id, ...questionDoc.data() });

        // Fetch answers
        const answersSnapshot = await db.collection('answers').where('questionId', '==', id).get(); // Utilise id ici
        const answersList = answersSnapshot.docs.map(doc => ({
          id: doc.id, // Utilisez doc.id pour l'identifiant unique de la réponse
          ...doc.data()
        }));
        setAnswers(answersList);
      } catch (error) {
        console.error("Error fetching question or answers: ", error);
      }
    };

    fetchQuestionAndAnswers();
  }, [id]);

  return (
    <div>
      {question && (
        <>
          <h1>{question.title}</h1>
          <p>{question.content}</p>
          <h2>Réponses</h2>
          <ul>
            {answers.map(answers => (
              <li key={answers.id}>{answers.content}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default QuestionDetail;
