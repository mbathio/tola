// src/components/CategoryPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, doc, addDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { Paper, Typography, Button, TextField, IconButton } from '@mui/material';
import { FaThumbsUp, FaThumbsDown, FaReply } from 'react-icons/fa';
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

const CategoryPage = () => {
  const classes = useStyles();
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [replyMode, setReplyMode] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = query(collection(db, 'questions'), where('category', '==', categoryId));
        const querySnapshot = await getDocs(q);
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

    fetchQuestions();
  }, [categoryId]);

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

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Questions pour la catégorie : {categoryId}
      </Typography>
      {questions.length > 0 ? (
        questions.map((question) => (
          <Paper key={question.id} elevation={3} className={classes.listItem}>
            <Typography variant="h5" className={classes.listItemText}>
              {question.title}
            </Typography>
            <Typography variant="body1">
              {question.content}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Auteur: {question.author}
            </Typography>
            <div>
              <IconButton onClick={() => handleLikeQuestion(question.id)}>
                <FaThumbsUp />
              </IconButton>
              <Typography variant="body2" display="inline">
                {question.likedBy.length - question.dislikedBy.length}
              </Typography>
              <IconButton onClick={() => handleDislikeQuestion(question.id)}>
                <FaThumbsDown />
              </IconButton>
              <Button onClick={() => handleReply(question.id)} startIcon={<FaReply />}>
                Répondre
              </Button>
              {replyMode[question.id] && (
                <div className={classes.responseContainer}>
                  <TextField
                    label="Réponse"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    value={replyText[question.id] || ''}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [question.id]: e.target.value }))}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmitReply(question.id)}
                  >
                    Soumettre
                  </Button>
                </div>
              )}
              {question.responses.map((response) => (
                <Paper key={response.id} elevation={1} className={classes.listItem}>
                  <Typography variant="body2">
                    {response.text}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Répondant: {response.author}
                  </Typography>
                </Paper>
              ))}
            </div>
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
