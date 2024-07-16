import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.js';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const q = category 
      ? query(collection(db, 'questions'), where('category', '==', category), orderBy('createdAt', 'desc'))
      : query(collection(db, 'questions'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const questionsData = [];
      querySnapshot.forEach((doc) => {
        questionsData.push({ ...doc.data(), id: doc.id });
      });
      setQuestions(questionsData);
    });

    return () => unsubscribe();
  }, [category]);

  return (
    <div>
      <h1>Liste des Questions</h1>
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="">Toutes les catégories</option>
        <option value="Technologie">Technologie</option>
        <option value="Science">Science</option>
        <option value="Mathématiques">Mathématiques</option>
        <option value="Histoire">Histoire</option>
      </select>
      {questions.map((question) => (
        <div key={question.questionId}>
          <h2>{question.title}</h2>
          <p>{question.content}</p>
          <p><strong>Catégorie:</strong> {question.category}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
