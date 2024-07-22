import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const QuestionList = () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Récupérez les catégories de l'utilisateur connecté
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDocs(userRef);
          const selectedCategories = userDoc.data().selectedCategories || [];
          
          // Recherchez les questions correspondant aux catégories sélectionnées
          const queries = selectedCategories.map(category => query(
            collection(db, 'questions'),
            where('category', '==', category)
          ));
          const questionsData = [];
          for (const q of queries) {
            const querySnapshot = await getDocs(q);
            querySnapshot.docs.forEach(doc => {
              questionsData.push({ id: doc.id, ...doc.data() });
            });
          }
          setQuestions(questionsData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des questions :', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Liste des Questions
      </Typography>
      {questions.length > 0 ? (
        questions.map(question => (
          <Paper key={question.id} elevation={3} className={classes.listItem}>
            <Typography variant="h5" gutterBottom>
              {question.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {question.content}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Catégorie: {question.category}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="h6" color="textSecondary">
          Aucune question trouvée pour vos catégories sélectionnées.
        </Typography>
      )}
    </div>
  );
};

export default QuestionList;
