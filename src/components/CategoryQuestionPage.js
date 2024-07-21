import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const CategoryQuestionsPage = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = query(collection(db, 'questions'), where('category', '==', categoryId));
        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Une erreur est survenue lors du chargement des questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Questions pour la catégorie</h1>
      {questions.length > 0 ? (
        <ul>
          {questions.map(question => (
            <li key={question.id}>{question.title}</li>
          ))}
        </ul>
      ) : (
        <p>Aucune question trouvée pour cette catégorie.</p>
      )}
    </div>
  );
};

export default CategoryQuestionsPage;
