import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  categoriesList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  categoryCard: {
    position: 'relative',
    width: '15%',
    height: '200px',
    margin: theme.spacing(1),
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryName: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  questionsList: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  questionCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  answerCard: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
  },
  answerForm: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  answerInput: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: theme.spacing(1),
    borderRadius: '5px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
}));

const CategoriesList = () => {
  const classes = useStyles();
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (categoryId) {
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
      }
    };

    fetchQuestions();
  }, [categoryId]);

  const handleAnswerSubmit = async (questionId) => {
    try {
      const answer = {
        content: newAnswer,
        likes: [],
      };
      const questionRef = collection(db, 'questions', questionId, 'answers');
      await addDoc(questionRef, answer);
      setNewAnswer('');  // Clear the input after submission
      // Fetch updated questions to display the new answer
      const q = query(collection(db, 'questions'), where('category', '==', categoryId));
      const querySnapshot = await getDocs(q);
      const updatedQuestionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(updatedQuestionsList);
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  return (
    <div>
      <div className={classes.categoriesList}>
        {categories.map(category => (
          <Link key={category.id} to={`/categories/${category.id}`} className={classes.categoryCard}>
            <img src={category.image} alt={category.name} className={classes.categoryImage} />
            <div className={classes.categoryName}>{category.name}</div>
          </Link>
        ))}
      </div>
      {categoryId && (
        <div className={classes.questionsList}>
          {questions.map(question => (
            <div key={question.id} className={classes.questionCard}>
              <h3>{question.title}</h3>
              <p>{question.content}</p>
              <p><strong>Likes:</strong> {question.likes ? question.likes.length : 0}</p>
              <div>
                {question.answers && question.answers.map((answer, index) => (
                  <div key={index} className={classes.answerCard}>
                    <p>{answer.content}</p>
                    <p><strong>Likes:</strong> {answer.likes ? answer.likes.length : 0}</p>
                  </div>
                ))}
              </div>
              <form className={classes.answerForm} onSubmit={(e) => { e.preventDefault(); handleAnswerSubmit(question.id); }}>
                <textarea
                  className={classes.answerInput}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Votre réponse..."
                  required
                />
                <button type="submit" className={classes.submitButton}>Soumettre</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
