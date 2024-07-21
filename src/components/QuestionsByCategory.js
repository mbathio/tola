// QuestionsByCategory.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionsByCategory } from '../services/firebase';

const QuestionsByCategory = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions = await getQuestionsByCategory(categoryId);
      setQuestions(fetchedQuestions);
    };

    fetchQuestions();
  }, [categoryId]);

  return (
    <div className="questions">
      {questions.map(question => (
        <div key={question.id} className="question">
          <h3>{question.title}</h3>
          <p>{question.content}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionsByCategory;
