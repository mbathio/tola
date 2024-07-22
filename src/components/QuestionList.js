import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { FaThumbsUp, FaThumbsDown, FaReply, FaEdit } from 'react-icons/fa';
import { Paper, Typography, Button, TextField, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import '../App.css';
import EditForm from './EditForm'; // Importer le composant EditForm

const useStyles = makeStyles((theme) => ({
  // Vos styles ici
}));

const QuestionList = () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replyMode, setReplyMode] = useState({});
  const [editMode, setEditMode] = useState({}); // État pour la modification
  const [editData, setEditData] = useState({}); // Données pour la modification

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
    // Récupérer les catégories
  };

  const fetchQuestions = async () => {
    // Récupérer les questions
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
    // Gérer le like
  };

  const handleDislikeQuestion = async (questionId) => {
    // Gérer le dislike
  };

  const handleEdit = (questionId, type, data) => {
    setEditMode({ [questionId]: true });
    setEditData({ id: questionId, type, data });
  };

  const handleCloseEdit = () => {
    setEditMode({});
    setEditData({});
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
    <div className="question-list-container">
      {Object.entries(questionsByCategory).map(([category, questions]) => (
        <div key={category}>
          <Typography variant="h4" gutterBottom className={classes.listItemText}>
            <Link to={`/categories/${category}`} className={classes.categoryLink}>
              {category}
            </Link>
          </Typography>
          {questions.map((question) => (
            <Paper key={question.id} elevation={3} className={classes.listItem}>
              <Typography variant="h5" gutterBottom className={classes.listItemText}>
                <Link to={`/questions/${question.id}`}>{question.title}</Link>
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
                <IconButton
                  aria-label="dislike"
                  onClick={() => handleDislikeQuestion(question.id)}
                  color={question.dislikedBy.includes(currentUser?.id) ? 'primary' : 'default'}
                >
                  <FaThumbsDown />
                </IconButton>
                {question.dislikedBy.length}
                <IconButton aria-label="reply" onClick={() => handleReply(question.id)}>
                  <FaReply />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEdit(question.id, 'question', { text: question.content })}
                >
                  <FaEdit />
                </IconButton>
                {replyMode[question.id] && (
                  <div className={classes.responseContainer}>
                    <TextField
                      fullWidth
                      label="Votre réponse"
                      multiline
                      rows={4}
                      value={replyText[question.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [question.id]: e.target.value })}
                      variant="outlined"
                      margin="normal"
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
              </div>
              {question.responses && question.responses.length > 0 && (
                <div>
                  <Typography variant="subtitle1">Réponses :</Typography>
                  {question.responses.map((response) => (
                    <div key={response.id} className={classes.responseContainer}>
                      <Typography variant="body1">{response.text}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Auteur: {response.author}
                      </Typography>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(response.id, 'response', { text: response.text })}
                      >
                        <FaEdit />
                      </IconButton>
                    </div>
                  ))}
                </div>
              )}
            </Paper>
          ))}
        </div>
      ))}
      {Object.keys(editMode).map((questionId) => (
        <EditForm
          key={questionId}
          open={editMode[questionId]}
          onClose={handleCloseEdit}
          documentId={editData.id}
          type={editData.type}
          currentData={editData.data}
        />
      ))}
    </div>
  );
};

export default QuestionList;
