// src/components/CategoryPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px',
    padding: '10px',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  listItem: {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: theme.palette.background.default,
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
}));

const CategoryPage = () => {
  const classes = useStyles();
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
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
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Questions pour la catégorie : {categoryId}
      </Typography>
      {questions.length > 0 ? (
        questions.map((question) => (
          <Paper key={question.id} elevation={3} className={classes.listItem}>
            <Typography variant="h5" gutterBottom>
              {question.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {question.content}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Auteur: {question.author}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="h6" color="textSecondary">
          Aucune question trouvée pour cette catégorie.
        </Typography>
      )}
    </div>
  );
};

export default CategoryPage;
