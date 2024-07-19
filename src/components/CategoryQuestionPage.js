// src/components/CategoryQuestionsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const CategoryQuestionsPage = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);

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
      }
    };

    fetchQuestions();
  }, [categoryId]);

  return (
    <div>
      <h1>Questions pour la catégorie</h1>
      <ul>
        {questions.map(question => (
          <li key={question.id}>{question.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryQuestionsPage;
