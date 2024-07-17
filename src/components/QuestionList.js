import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { FaThumbsUp, FaReply, FaComment } from 'react-icons/fa';

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = () => {
      // Mock implementation, replace with actual user fetch logic
      const currentUserData = {
        id: 'admin1',
        displayName: 'Admin One',
        role: 'admin'
      };
      setCurrentUser(currentUserData);
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questions'));
        const questionsData = await Promise.all(querySnapshot.docs.map(async doc => {
          const question = {
            id: doc.id,
            ...doc.data(),
            responses: []
          };

          const responsesSnapshot = await getDocs(collection(doc.ref, 'responses'));
          responsesSnapshot.forEach(responseDoc => {
            question.responses.push({
              id: responseDoc.id,
              ...responseDoc.data()
            });
          });

          return question;
        }));

        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching questions: ', error);
      }
    };

    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'questions'));
      const questionsData = await Promise.all(querySnapshot.docs.map(async doc => {
        const question = {
          id: doc.id,
          ...doc.data(),
          responses: []
        };

        const responsesSnapshot = await getDocs(collection(doc.ref, 'responses'));
        responsesSnapshot.forEach(responseDoc => {
          question.responses.push({
            id: responseDoc.id,
            ...responseDoc.data()
          });
        });

        return question;
      }));

      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching questions: ', error);
    }
  };

  const handleReply = (questionId) => {
    console.log('Replying to question with id:', questionId);
    // Implement reply logic here
  };

  const handleLikeQuestion = async (questionId) => {
    try {
      const questionRef = doc(db, 'questions', questionId);
      await updateDoc(questionRef, {
        likedBy: [...questions.find(q => q.id === questionId).likedBy, currentUser.id]
      });
      // Refresh data after update
      fetchQuestions();
    } catch (error) {
      console.error('Error liking question:', error);
    }
  };

  return (
    <div>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            <h3>{question.title}</h3>
            <p>Catégorie: {question.category}</p>
            <h4>Réponses:</h4>
            <ul>
              {question.responses.map(response => (
                <li key={response.id}>
                  <p>{response.text}</p>
                  <p>Auteur: {response.author}</p>
                </li>
              ))}
            </ul>
            <div>
              <button onClick={() => handleReply(question.id)}><FaReply /> Répondre</button>
              <button onClick={() => handleLikeQuestion(question.id)}><FaThumbsUp /> Aimer</button>
              <button><FaComment /> Commenter</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;
