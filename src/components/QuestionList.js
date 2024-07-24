import React, { useEffect, useState } from 'react';
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
    padding: '20px',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.divider}`,
  },
  listItem: {
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
    },
  },
  listItemText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: theme.palette.text.primary,
  },
  listItemDetails: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    marginBottom: '8px',
  },
  responseContainer: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.grey[100],
    borderRadius: '4px',
  },
  commentContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
    borderRadius: '4px',
  },
  iconButton: {
    margin: theme.spacing(0.5),
  },
  button: {
    marginTop: theme.spacing(1),
    textTransform: 'none',
  },
}));

const QuestionList = () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replyMode, setReplyMode] = useState({});
  const [commentText, setCommentText] = useState({});
  const [commentMode, setCommentMode] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          displayName: user.displayName,
          role: 'user',
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categoriesData[doc.id] = data.name;
      });
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories : ', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'questions'));
      const questionsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const question = {
            id: doc.id,
            ...doc.data(),
            responses: [],
            comments: [],
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

          const commentsSnapshot = await getDocs(collection(doc.ref, 'comments'));
          commentsSnapshot.forEach((commentDoc) => {
            question.comments.push({
              id: commentDoc.id,
              ...commentDoc.data(),
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
    fetchCategories();
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

  const handleComment = (questionId) => {
    setCommentMode((prevState) => ({ ...prevState, [questionId]: !prevState[questionId] }));
  };

  const handleSubmitComment = async (questionId) => {
    if (!commentText[questionId]) return;

    try {
      const questionRef = doc(db, 'questions', questionId);
      await addDoc(collection(questionRef, 'comments'), {
        text: commentText[questionId],
        author: currentUser.displayName,
        timestamp: new Date(),
      });

      setCommentText((prevState) => ({ ...prevState, [questionId]: '' }));
      setCommentMode((prevState) => ({ ...prevState, [questionId]: false }));
      fetchQuestions();
    } catch (error) {
      console.error('Erreur lors de la soumission du commentaire :', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp ? new Date(timestamp.seconds * 1000).toLocaleString() : 'Date non disponible';
  };

  const questionsByCategory = questions.reduce((acc, question) => {
    const category = categories[question.category] || 'Autre';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {});

  return (
    <div className="questions-container">
      {Object.keys(questionsByCategory).map((category) => (
        <div key={category} className={classes.root}>
          <Typography variant="h4" gutterBottom>
            {category}
          </Typography>
          {questionsByCategory[category].map((question) => (
            <Paper key={question.id} className={classes.listItem}>
              <Typography variant="h6" className={classes.listItemText}>
                {question.title}
              </Typography>
              <Typography className={classes.listItemDetails}>
                {question.content}
              </Typography>
              <Typography variant="body2" className={classes.listItemDetails}>
                Posté par {question.author} le {formatTimestamp(question.timestamp)}
              </Typography>
              <div className="actions">
                <IconButton
                  className={classes.iconButton}
                  onClick={() => handleLikeQuestion(question.id)}
                >
                  <FaThumbsUp />
                  {question.likedBy.length}
                </IconButton>
                <IconButton
                  className={classes.iconButton}
                  onClick={() => handleDislikeQuestion(question.id)}
                >
                  <FaThumbsDown />
                  {question.dislikedBy.length}
                </IconButton>
                <IconButton
                  className={classes.iconButton}
                  onClick={() => handleReply(question.id)}
                >
                  <FaReply />
                </IconButton>
              </div>
              {replyMode[question.id] && (
                <div className={classes.responseContainer}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Répondez à la question..."
                    value={replyText[question.id] || ''}
                    onChange={(e) =>
                      setReplyText((prevState) => ({
                        ...prevState,
                        [question.id]: e.target.value,
                      }))
                    }
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmitReply(question.id)}
                    className={classes.button}
                  >
                    Répondre
                  </Button>
                </div>
              )}
              {question.responses.map((response) => (
                <div key={response.id} className={classes.commentContainer}>
                  <Typography variant="body1">
                    {response.text}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Posté par {response.author} le {formatTimestamp(response.timestamp)}
                  </Typography>
                </div>
              ))}
              {commentMode[question.id] && (
                <div className={classes.commentContainer}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Ajoutez un commentaire..."
                    value={commentText[question.id] || ''}
                    onChange={(e) =>
                      setCommentText((prevState) => ({
                        ...prevState,
                        [question.id]: e.target.value,
                      }))
                    }
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleSubmitComment(question.id)}
                    className={classes.button}
                  >
                    Commenter
                  </Button>
                </div>
              )}
              {question.comments.map((comment) => (
                <div key={comment.id} className={classes.commentContainer}>
                  <Typography variant="body1">
                    {comment.text}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Posté par {comment.author} le {formatTimestamp(comment.timestamp)}
                  </Typography>
                </div>
              ))}
            </Paper>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
