import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const CategoryQuestions = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log(`Fetching questions for category: ${categoryId}`);
        const q = query(collection(db, 'questions'), where('categoryId', '==', categoryId));
        const querySnapshot = await getDocs(q);
        const questionsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(`Fetched questions:`, questionsList);
        setQuestions(questionsList);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Questions for Category: {categoryId}</h2>
      {questions.length > 0 ? (
        <ul>
          {questions.map(question => (
            <li key={question.id}>{question.title}</li>
          ))}
        </ul>
      ) : (
        <p>No questions found for this category.</p>
      )}
    </div>
  );
};

export default CategoryQuestions;
