import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Paper, Typography } from '@mui/material';
import '../App.css';

const CategoryQuestionsPage = () => {
  const { categoryId } = useParams(); // Utilise useParams pour récupérer l'ID de la catégorie depuis l'URL
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, 'questions');
        const q = query(questionsRef, where('category', '==', categoryId));
        const querySnapshot = await getDocs(q);
        const questionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching questions: ', error);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  return (
    <div className="category-questions-page">
      <Typography variant="h4" gutterBottom>
        Questions dans la catégorie: {categoryId}
      </Typography>
      {questions.length > 0 ? (
        questions.map(question => (
          <Paper key={question.id} elevation={3} className="question-paper">
            <Typography variant="h5" gutterBottom>
              <Link to={`/questions/${question.id}`}>{question.title}</Link>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {question.content}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Auteur: {question.author}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="body1">
          Aucune question trouvée dans cette catégorie.
        </Typography>
      )}
    </div>
  );
};

export default CategoryQuestionsPage;
