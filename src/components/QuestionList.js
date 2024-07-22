// src/components/QuestionList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { FaThumbsUp, FaThumbsDown, FaReply } from 'react-icons/fa';
import { Paper, Typography, Button, TextField, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import '../App.css';

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
  listItemText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: theme.palette.text.primary,
  },
  listItemDetails: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
  responseContainer: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    borderLeft: '2px solid #ddd',
  },
}));

const QuestionList = () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replyMode, setReplyMode] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          displayName: user.displayName,
          role: 'user', // Vous pouvez ajouter une logique pour récupérer le rôle de l'utilisateur depuis la base de données
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'questions'));
      const questionsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const question = {
            id: doc.id,
            ...doc.data(),
            responses: [],
            likedBy: doc.data().likedBy || [],
            dislikedBy: doc.data().dislikedBy || [],
          };

          const responsesSnapshot = await getDocs(collection(doc.ref, 'responses'));
          responsesSnapshot.forEach((responseDoc) => {
            question.responses.push({
              id: responseDoc.id,
              ...responseDoc.data(),
            });
          });

          return question;
        })
      );

      setQuestions(questionsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des questions : ', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleReply = (questionId) => {
    setReplyMode((prevState) => ({ ...prevState, [questionId]: !prevState[questionId] }));
  };

  const handleSubmitReply = async (questionId) => {
    if (!replyText[questionId]) return;

    try {
      const questionRef = doc(db, 'questions', questionId);
      await addDoc(collection(questionRef, 'responses'), {
        text: replyText[questionId],
        author: currentUser.displayName,
        timestamp: new Date(),
      });

      setReplyText((prevState) => ({ ...prevState, [questionId]: '' }));
      setReplyMode((prevState) => ({ ...prevState, [questionId]: false }));
      fetchQuestions();
    } catch (error) {
      console.error('Erreur lors de la soumission de la réponse :', error);
    }
  };

  const handleLikeQuestion = async (questionId) => {
    if (!currentUser) return;

    try {
      const questionRef = doc(db, 'questions', questionId);
      const question = questions.find((q) => q.id === questionId);
      const likedBy = question.likedBy.includes(currentUser.id)
        ? question.likedBy.filter((userId) => userId !== currentUser.id)
        : [...question.likedBy, currentUser.id];

      await updateDoc(questionRef, { likedBy });
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId ? { ...q, likedBy } : q
        )
      );
    } catch (error) {
      console.error('Erreur lors du like de la question :', error);
    }
  };

  const handleDislikeQuestion = async (questionId) => {
    if (!currentUser) return;

    try {
      const questionRef = doc(db, 'questions', questionId);
      const question = questions.find((q) => q.id === questionId);
      const dislikedBy = question.dislikedBy.includes(currentUser.id)
        ? question.dislikedBy.filter((userId) => userId !== currentUser.id)
        : [...question.dislikedBy, currentUser.id];

      await updateDoc(questionRef, { dislikedBy });
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId ? { ...q, dislikedBy } : q
        )
      );
    } catch (error) {
      console.error('Erreur lors du dislike de la question :', error);
    }
  };

  const categories = [...new Set(questions.map((q) => q.category))];

  return (
    <div className="question-list-container">
      {categories.map((category) => (
        <div key={category}>
          <Typography variant="h4" gutterBottom>
            <Link to={`/category/${category}`}>{category}</Link>
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
