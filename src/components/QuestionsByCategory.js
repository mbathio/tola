import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionsByCategory } from '../services/firebase';
import { Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../App.css';

const CategoryQuestionsPage = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions = await getQuestionsByCategory(categoryId);
      setQuestions(fetchedQuestions);
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
