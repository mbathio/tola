import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // Fetch question and its answers from Firestore
    const fetchQuestionAndAnswers = async () => {
      try {
        // Fetch question
        const questionDoc = await db.collection('questions').doc(id).get();
        setQuestion({ id: questionDoc.id, ...questionDoc.data() });

        // Fetch answers
        const answersSnapshot = await db.collection('answers').where('questionId', '==', id).get();
        const answersList = answersSnapshot.docs.map(doc => ({
          id: doc.id,
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
            {answers.map(answer => (
              <li key={answer.answersid}>{answer.content}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default QuestionDetail;
