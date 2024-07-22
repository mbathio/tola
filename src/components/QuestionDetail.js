// src/components/QuestionDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Paper, Typography } from '@mui/material';

const QuestionDetail = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionRef = doc(db, 'questions', questionId);
        const questionSnap = await getDoc(questionRef);
        if (questionSnap.exists()) {
          setQuestion(questionSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching question: ', error);
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (!question) {
    return <div>Chargement...</div>;
  }

  return (
    <Paper elevation={3} className="question-detail-container">
      <Typography variant="h4" gutterBottom>
        {question.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {question.content}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Catégorie: {question.category}
      </Typography>
      {/* Affichage des réponses et des commentaires */}
      <div>
        <Typography variant="h6" gutterBottom>
          Réponses:
        </Typography>
        <ul>
          {question.responses && question.responses.map((response, index) => (
            <li key={index}>
              <Typography variant="body1">
                {response.text}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Auteur: {response.author}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Typography variant="h6" gutterBottom>
          Commentaires:
        </Typography>
        <ul>
          {question.comments && question.comments.map((comment, index) => (
            <li key={index}>
              <Typography variant="body2" color="textSecondary">
                Auteur: {comment.author}
              </Typography>
              <Typography variant="body1">
                {comment.text}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Auteur: {comment.author}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </Paper>
  );
};

export default QuestionDetail;
