import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { FaThumbsUp, FaReply, FaComment } from 'react-icons/fa';

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replyMode, setReplyMode] = useState({});
  const [commentText, setCommentText] = useState({});
  const [commentMode, setCommentMode] = useState({});

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
            responses: [],
            comments: [],
            likedBy: doc.data().likedBy || [] // Initialize likedBy if not defined
          };

          const responsesSnapshot = await getDocs(collection(doc.ref, 'responses'));
          responsesSnapshot.forEach(responseDoc => {
            question.responses.push({
              id: responseDoc.id,
              ...responseDoc.data()
            });
          });

          const commentsSnapshot = await getDocs(collection(doc.ref, 'comments'));
          commentsSnapshot.forEach(commentDoc => {
            question.comments.push({
              id: commentDoc.id,
              ...commentDoc.data()
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
          responses: [],
          comments: [],
          likedBy: doc.data().likedBy || [] // Initialize likedBy if not defined
        };

        const responsesSnapshot = await getDocs(collection(doc.ref, 'responses'));
        responsesSnapshot.forEach(responseDoc => {
          question.responses.push({
            id: responseDoc.id,
            ...responseDoc.data()
          });
        });

        const commentsSnapshot = await getDocs(collection(doc.ref, 'comments'));
        commentsSnapshot.forEach(commentDoc => {
          question.comments.push({
            id: commentDoc.id,
            ...commentDoc.data()
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
    setReplyMode(prevState => ({ ...prevState, [questionId]: !prevState[questionId] }));
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

      setReplyText(prevState => ({ ...prevState, [questionId]: '' }));
      setReplyMode(prevState => ({ ...prevState, [questionId]: false }));
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleLikeQuestion = async (questionId) => {
    try {
      const questionRef = doc(db, 'questions', questionId);
      const question = questions.find(q => q.id === questionId);
      const likedBy = question.likedBy.includes(currentUser.id)
        ? question.likedBy.filter(userId => userId !== currentUser.id)
        : [...question.likedBy, currentUser.id];
      
      await updateDoc(questionRef, { likedBy });
      fetchQuestions();
    } catch (error) {
      console.error('Error liking question:', error);
    }
  };

  const handleComment = (questionId) => {
    setCommentMode(prevState => ({ ...prevState, [questionId]: !prevState[questionId] }));
  };

  const handleSubmitComment = async (questionId) => {
    if (!commentText[questionId]) return;

    try {
      const questionRef = doc(db, 'questions', questionId);
      await addDoc(collection(questionRef, 'comments'), {
        text: commentText[questionId],
        author: currentUser.displayName,
        timestamp: new Date(),
      });

      setCommentText(prevState => ({ ...prevState, [questionId]: '' }));
      setCommentMode(prevState => ({ ...prevState, [questionId]: false }));
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting comment:', error);
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
            <h4>Commentaires:</h4>
            <ul>
              {question.comments.map(comment => (
                <li key={comment.id}>
                  <p>{comment.text}</p>
                  <p>Auteur: {comment.author}</p>
                </li>
              ))}
            </ul>
            <div>
              <button onClick={() => handleReply(question.id)}><FaReply /> Répondre</button>
              <button onClick={() => handleLikeQuestion(question.id)}>
                <FaThumbsUp /> Aimer {question.likedBy.length > 0 && <span>({question.likedBy.length})</span>}
              </button>
              <button onClick={() => handleComment(question.id)}><FaComment /> Commenter</button>
            </div>
            {replyMode[question.id] && (
              <div>
                <textarea
                  value={replyText[question.id] || ''}
                  onChange={(e) => setReplyText(prevState => ({ ...prevState, [question.id]: e.target.value }))}
                />
                <button onClick={() => handleSubmitReply(question.id)}>Envoyer</button>
              </div>
            )}
            {commentMode[question.id] && (
              <div>
                <textarea
                  value={commentText[question.id] || ''}
                  onChange={(e) => setCommentText(prevState => ({ ...prevState, [question.id]: e.target.value }))}
                />
                <button onClick={() => handleSubmitComment(question.id)}>Envoyer</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;
