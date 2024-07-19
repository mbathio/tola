import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const CategoryPage = () => {
  const { slug } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'questions'), where('category', '==', slug));
        const querySnapshot = await getDocs(q);
        const questionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions: ", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Questions dans la catégorie: {slug}</h2>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            <h3>{question.title}</h3>
            <p>{question.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;