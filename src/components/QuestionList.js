import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { FaThumbsUp, FaReply, FaComment } from 'react-icons/fa';
import { Paper, Typography, Button, TextField, IconButton } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import '../App.css';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  listItem: {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  listItemText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  listItemDetails: {
    fontSize: '0.8rem',
    color: '#666',
  },
  responseContainer: {
    marginTop: '10px',
    paddingLeft: '20px',
    borderLeft: '2px solid #ddd',
  },
  commentContainer: {
    marginTop: '10px',
    paddingLeft: '20px',
    borderLeft: '2px solid #ddd',
  },
}));

function QuestionList() {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
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
            comments: [],
            likedBy: doc.data().likedBy || [],
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
      console.error('Error fetching questions: ', error);
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
      console.error('Error submitting reply:', error);
    }
  };

  const handleLikeQuestion = async (questionId) => {
    try {
      const questionRef = doc(db, 'questions', questionId);
      const question = questions.find((q) => q.id === questionId);
      const likedBy = question.likedBy.includes(currentUser.id)
        ? question.likedBy.filter((userId) => userId !== currentUser.id)
        : [...question.likedBy, currentUser.id];

      await updateDoc(questionRef, { likedBy });
      fetchQuestions();
    } catch (error) {
      console.error('Error liking question:', error);
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
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="question-list-container">
      {questions.map((question) => (
        <Paper key={question.id} elevation={3} className="question-paper">
          <Typography variant="h5" gutterBottom className={classes.listItemText}>
            <Link to={`/questions/${question.id}`}>{question.title}</Link>
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom className={classes.listItemDetails}>
            Catégorie: {question.category}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {question.content}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Auteur: {question.author}
          </Typography>
          <div>
            <IconButton
              aria-label="like"
              onClick={() => handleLikeQuestion(question.id)}
              color={question.likedBy.includes(currentUser?.id) ? 'primary' : 'default'}
            >
              <FaThumbsUp />
            </IconButton>
            {question.likedBy.length}
            <IconButton aria-label="reply" onClick={() => handleReply(question.id)}>
              <FaReply />
            </IconButton>
            {question.responses.length}
            <IconButton aria-label="comment" onClick={() => handleComment(question.id)}>
              <FaComment />
            </IconButton>
            {question.comments.length}
          </div>
          {replyMode[question.id] && (
            <div>
              <TextField
                label="Répondre"
                multiline
                rows={4}
                value={replyText[question.id] || ''}
                onChange={(e) => setReplyText((prevState) => ({ ...prevState, [question.id]: e.target.value }))}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={() => handleSubmitReply(question.id)}>
                Soumettre
              </Button>
            </div>
          )}
          {question.responses.map((response) => (
            <div key={response.id} className={classes.responseContainer}>
              <Typography variant="body2" color="textSecondary">
                {response.author} a répondu :
              </Typography>
              <Typography variant="body1">{response.text}</Typography>
              {response.timestamp && (
                <Typography variant="body2" color="textSecondary">
                  Posté le: {response.timestamp.toDate().toLocaleString()}
                </Typography>
              )}
            </div>
          ))}
          {commentMode[question.id] && (
            <div>
              <TextField
                label="Commenter"
                multiline
                rows={2}
                value={commentText[question.id] || ''}
                onChange={(e) => setCommentText((prevState) => ({ ...prevState, [question.id]: e.target.value }))}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={() => handleSubmitComment(question.id)}>
                Soumettre
              </Button>
            </div>
          )}
          {question.comments.map((comment) => (
            <div key={comment.id} className={classes.commentContainer}>
              <Typography variant="body2" color="textSecondary">
                {comment.author} a commenté :
              </Typography>
              <Typography variant="body1">{comment.text}</Typography>
              {comment.timestamp && (
                <Typography variant="body2" color="textSecondary">
                  Posté le: {comment.timestamp.toDate().toLocaleString()}
                </Typography>
              )}
            </div>
          ))}
        </Paper>
      ))}
    </div>
  );
}

export default QuestionList;
