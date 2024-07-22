import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Typography } from '@mui/material';

const CategoryQuestionsPage = () => {
  const { categoryId } = useParams(); // Récupération du paramètre de la catégorie depuis l'URL
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Requête pour récupérer les questions dont la catégorie correspond à l'identifiant
        const q = query(collection(db, 'questions'), where('category', '==', categoryId));
        const querySnapshot = await getDocs(q);
        const questionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(questionsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des questions : ', error);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  return (
    <div className="category-questions-container">
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.id}>
            <Typography variant="h6">{question.title}</Typography>
            <p>{question.content}</p>
          </div>
        ))
      ) : (
        <Typography variant="h6">Aucune question trouvée pour cette catégorie.</Typography>
      )}
    </div>
  );
};

export default CategoryQuestionsPage;
