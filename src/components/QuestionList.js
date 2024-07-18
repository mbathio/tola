import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
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
    fontSize: '1rem', // Diminuer la taille de la police du titre
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  listItemDetails: {
    fontSize: '0.8rem', // Diminuer la taille de la police des détails
    color: '#666',
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
    const fetchCurrentUser = () => {
      // Mock implementation, replace with actual user fetch logic
      const currentUserData = {
        id: 'admin1',
        displayName: 'Admin One',
        role: 'admin', // Replace with actual user role logic
      };
      setCurrentUser(currentUserData);
    };

    fetchCurrentUser();
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
      fetchQuestions(); // Corrected call to fetchQuestions
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
      fetchQuestions(); // Corrected call to fetchQuestions
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
      fetchQuestions(); // Corrected call to fetchQuestions
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="question-list-container">
      {questions.map((question) => (
        <Paper key={question.id} elevation={3} className="question-paper">
          <Typography variant="h5" gutterBottom className={classes.listItemText}>
            {question.title}
          </Typography>
          <Typography variant="body1" className={classes.listItemDetails}>
            Catégorie: {question.category}
          </Typography>
          <Typography variant="h6" gutterBottom className={classes.listItemText}>
            Réponses:
          </Typography>
          <ul className="response-list">
            {question.responses.map((response) => (
              <li key={response.id}>
                <Typography variant="body1" gutterBottom className={classes.listItemDetails}>
                  {response.text}
                </Typography>
                <Typography variant="body2" className={classes.listItemDetails}>
                  Auteur: {response.author}
                </Typography>
              </li>
            ))}
          </ul>
          <Typography variant="h6" gutterBottom className={classes.listItemText}>
            Commentaires:
          </Typography>
          <ul className="comment-list">
            {question.comments.map((comment) => (
              <li key={comment.id}>
                <Typography variant="body1" gutterBottom className={classes.listItemDetails}>
                  {comment.text}
                </Typography>
                <Typography variant="body2" className={classes.listItemDetails}>
                  Auteur: {comment.author}
                </Typography>
              </li>
            ))}
          </ul>
          <div className="button-group">
            <IconButton onClick={() => handleReply(question.id)}>
              <FaReply /> Répondre
            </IconButton>
            <IconButton onClick={() => handleLikeQuestion(question.id)}>
              <FaThumbsUp /> Aimer {question.likedBy.length > 0 && <span>({question.likedBy.length})</span>}
            </IconButton>
            <IconButton onClick={() => handleComment(question.id)}>
              <FaComment /> Commenter
            </IconButton>
          </div>
          {replyMode[question.id] && (
            <div className="reply-form">
              <TextField
                label="Réponse"
                multiline
                rows={2}
                value={replyText[question.id] || ''}
                onChange={(e) => setReplyText((prevState) => ({ ...prevState, [question.id]: e.target.value }))}
                fullWidth
              />
              <Button variant="contained" onClick={() => handleSubmitReply(question.id)}>
                Envoyer
              </Button>
            </div>
          )}
          {commentMode[question.id] && (
            <div className="comment-form">
              <TextField
                label="Commentaire"
                multiline
                rows={2}
                value={commentText[question.id] || ''}
                onChange={(e) => setCommentText((prevState) => ({ ...prevState, [question.id]: e.target.value }))}
                fullWidth
              />
              <Button variant="contained" onClick={() => handleSubmitComment(question.id)}>
                Envoyer
              </Button>
            </div>
          )}
        </Paper>
      ))}
    </div>
  );
}

export default QuestionList;
