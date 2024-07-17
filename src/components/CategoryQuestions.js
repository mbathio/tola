import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const CategoryQuestions = () => {
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const categoryDoc = await getDocs(collection(db, 'categories', categoryId));
        if (!categoryDoc.empty) {
          categoryDoc.forEach(doc => {
            setCategoryName(doc.data().name);
          });
        } else {
          console.log('No such category!');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  useEffect(() => {
    const fetchQuestionsByCategory = async () => {
      try {
        const questionsCollection = collection(db, 'questions');
        const q = query(questionsCollection, where('category', '==', categoryId));
        const questionsSnapshot = await getDocs(q);
        const questionsList = questionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsList);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  
    if (categoryId) {
      fetchQuestionsByCategory();
    }
  }, [categoryId]);

  return (
    <div>
      <h1>Questions de la catégorie {categoryName}</h1>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            <h3>{question.title}</h3>
            <p>{question.content}</p>
            {/* Ajoutez d'autres détails de la question selon votre structure de données */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryQuestions;
