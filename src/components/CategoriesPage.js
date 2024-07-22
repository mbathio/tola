import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Paper, Typography } from '@mui/material';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestionsByCategory = async () => {
      try {
        const q = query(collection(db, 'questions'), where('category', '==', categoryName));
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

    fetchQuestionsByCategory();
  }, [categoryName]);

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Questions dans la catégorie : {categoryName}
      </Typography>
      {questions.length > 0 ? (
        questions.map((question) => (
          <Paper key={question.id} elevation={3} style={{ margin: '20px', padding: '10px' }}>
            <Typography variant="h5" gutterBottom>
              {question.title}
            </Typography>
            <Typography variant="body1">{question.content}</Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="h6">Aucune question dans cette catégorie.</Typography>
      )}
    </div>
  );
};

export default CategoryPage;
