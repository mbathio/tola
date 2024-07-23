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
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
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
  commentContainer: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderLeft: '2px solid #ddd',
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
          <Typography variant="h5" component="h2">
            {category}
          </Typography>
          {questionsByCategory[category].map((question) => (
            <Paper key={question.id} className={classes.listItem}>
              <Typography variant="h6" className={classes.listItemText}>
                {question.title}
              </Typography>
              <Typography variant="body1" className={classes.listItemDetails}>
                {question.content}
              </Typography>
              <Typography variant="caption" className={classes.listItemDetails}>
                Posté le {formatTimestamp(question.createdAt)}
              </Typography>
              <div className="question-actions">
                <IconButton onClick={() => handleLikeQuestion(question.id)}>
                  <FaThumbsUp />
                </IconButton>
                <span>{question.likedBy.length}</span>
                <IconButton onClick={() => handleDislikeQuestion(question.id)}>
                  <FaThumbsDown />
                </IconButton>
                <span>{question.dislikedBy.length}</span>
                {currentUser && (
                  <>
                    <Button onClick={() => handleReply(question.id)}>
                      <FaReply /> Répondre
                    </Button>
                    {replyMode[question.id] && (
                      <div className="reply-form">
                        <TextField
                          multiline
                          rows={3}
                          variant="outlined"
                          fullWidth
                          value={replyText[question.id] || ''}
                          onChange={(e) => setReplyText((prevState) => ({ ...prevState, [question.id]: e.target.value }))}
                          placeholder="Écrire une réponse..."
                        />
                        <Button onClick={() => handleSubmitReply(question.id)}>Envoyer</Button>
                      </div>
                    )}
                    <Button onClick={() => handleComment(question.id)}>
                      Commenter
                    </Button>
                    {commentMode[question.id] && (
                      <div className={classes.commentContainer}>
                        <TextField
                          multiline
                          rows={3}
                          variant="outlined"
                          fullWidth
                          value={commentText[question.id] || ''}
                          onChange={(e) => setCommentText((prevState) => ({ ...prevState, [question.id]: e.target.value }))}
                          placeholder="Écrire un commentaire..."
                        />
                        <Button onClick={() => handleSubmitComment(question.id)}>Envoyer</Button>
                      </div>
                    )}
                    <div className={classes.responseContainer}>
                      {question.responses.map((response) => (
                        <Paper key={response.id} className={classes.listItem}>
                          <Typography variant="body2">
                            {response.text}
                          </Typography>
                          <Typography variant="caption">
                            Posté par {response.author} le {formatTimestamp(response.timestamp)}
                          </Typography>
                        </Paper>
                      ))}
                    </div>
                    <div className={classes.commentContainer}>
                      {question.comments.map((comment) => (
                        <Paper key={comment.id} className={classes.listItem}>
                          <Typography variant="body2">
                            {comment.text}
                          </Typography>
                          <Typography variant="caption">
                            Posté par {comment.author} le {formatTimestamp(comment.timestamp)}
                          </Typography>
                        </Paper>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Paper>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
