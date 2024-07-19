import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  questionList: {
    padding: theme.spacing(2),
  },
  questionItem: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(1),
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}));

const CategoryQuestions = () => {
  const classes = useStyles();
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = query(collection(db, 'questions'), where('category', '==', categoryId));
        const querySnapshot = await getDocs(q);
        const questionsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsList);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  return (
    <div className={classes.questionList}>
      {questions.map(question => (
        <div key={question.id} className={classes.questionItem}>
          <h3>{question.title}</h3>
          <p>{question.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryQuestions;
