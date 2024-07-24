import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import '../App.css'; // Import your global CSS

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userQuestions, setUserQuestions] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [updatedContent, setUpdatedContent] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = querySnapshot.docs.reduce((acc, doc) => {
          const category = doc.data();
          acc[doc.id] = category.name;
          return acc;
        }, {});
        setCategoriesMap(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        if (user) {
          const userQuestionsRef = collection(db, 'questions');
          const q = query(userQuestionsRef, where('authorId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const userQuestionsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUserQuestions(userQuestionsData);
        }
      } catch (error) {
        console.error('Error fetching user questions: ', error);
      }
    };

    fetchUserQuestions();
  }, [user]);

  const handleEditClick = (question) => {
    setEditingQuestion(question);
    setUpdatedContent(question.content);
  };

  const handleUpdateQuestion = async () => {
    if (editingQuestion) {
      const questionDocRef = doc(db, 'questions', editingQuestion.id);
      try {
        await updateDoc(questionDocRef, {
          content: updatedContent
        });
        const updatedQuestions = userQuestions.map(q =>
          q.id === editingQuestion.id ? { ...q, content: updatedContent } : q
        );
        setUserQuestions(updatedQuestions);
        setEditingQuestion(null);
        setUpdatedContent('');
      } catch (error) {
        console.error('Error updating question:', error);
      }
    }
  };

  const handleLike = async (question) => {
    const questionDocRef = doc(db, 'questions', question.id);
    try {
      if (!question.likedBy.includes(user.uid)) {
        await updateDoc(questionDocRef, {
          likedBy: [...question.likedBy, user.uid],
          dislikedBy: question.dislikedBy.filter(uid => uid !== user.uid)
        });
        const updatedQuestions = userQuestions.map(q =>
          q.id === question.id
            ? { ...q, likedBy: [...q.likedBy, user.uid], dislikedBy: q.dislikedBy.filter(uid => uid !== user.uid) }
            : q
        );
        setUserQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error('Error liking question:', error);
    }
  };

  const handleDislike = async (question) => {
    const questionDocRef = doc(db, 'questions', question.id);
    try {
      if (!question.dislikedBy.includes(user.uid)) {
        await updateDoc(questionDocRef, {
          dislikedBy: [...question.dislikedBy, user.uid],
          likedBy: question.likedBy.filter(uid => uid !== user.uid)
        });
        const updatedQuestions = userQuestions.map(q =>
          q.id === question.id
            ? { ...q, dislikedBy: [...q.dislikedBy, user.uid], likedBy: q.likedBy.filter(uid => uid !== user.uid) }
            : q
        );
        setUserQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error('Error disliking question:', error);
    }
  };

  if (!user) {
    return <div>Vous n'êtes pas connecté.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profil de {user.email}</h2>
      <p>Nom: {user.displayName}</p>
      <p>Email: {user.email}</p>

      <h3>Vos Questions:</h3>
      <ul className="questions-list">
        {userQuestions.map(question => (
          <li key={question.id} className="question-item">
            <div className="question-header">
              <h4>{question.title}</h4>
              <p><strong>Catégorie:</strong> {categoriesMap[question.category]}</p>
              <p><strong>Date de création:</strong> {new Date(question.createdAt.toDate()).toLocaleDateString()}</p>
            </div>
            <p>{question.content}</p>

            {editingQuestion && editingQuestion.id === question.id ? (
              <div className="edit-section">
                <textarea
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                />
                <button onClick={handleUpdateQuestion}>Mettre à jour</button>
                <button onClick={() => setEditingQuestion(null)}>Annuler</button>
              </div>
            ) : (
              <button onClick={() => handleEditClick(question)}>Modifier</button>
            )}

            <div className="responses-section">
              <h5>Réponses:</h5>
              {question.responses && question.responses.length > 0 ? (
                <ul>
                  {question.responses.map((response, index) => (
                    <li key={index}>
                      <p>{response.content}</p>
                      <p><strong>Posté le:</strong> {new Date(response.createdAt.toDate()).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucune réponse pour cette question.</p>
              )}
            </div>

            <p><strong>Likes:</strong> {question.likedBy ? question.likedBy.length : 0}</p>
            <button onClick={() => handleLike(question)}>J'aime</button>
            <p><strong>Dislikes:</strong> {question.dislikedBy ? question.dislikedBy.length : 0}</p>
            <button onClick={() => handleDislike(question)}>Je n'aime pas</button>

            <div className="comments-section">
              <h5>Commentaires:</h5>
              {question.comments && question.comments.length > 0 ? (
                <ul>
                  {question.comments.map((comment, index) => (
                    <li key={index}>
                      <p>{comment.content}</p>
                      <p><strong>Posté le:</strong> {new Date(comment.createdAt.toDate()).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucun commentaire pour cette question.</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <button className="sign-out-btn" onClick={() => auth.signOut()}>Déconnexion</button>
    </div>
  );
};

export default Profile;
