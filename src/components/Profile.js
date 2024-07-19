import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../App.css'; // Import your global CSS

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userQuestions, setUserQuestions] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({}); // Ajout d'un état pour les catégories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = querySnapshot.docs.reduce((acc, doc) => {
          const category = doc.data();
          acc[doc.id] = category.name; // Stocke le nom de la catégorie avec son ID
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

  if (!user) {
    return <div>Vous n'êtes pas connecté.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profil de {user.email}</h2>
      <p>Nom: {user.displayName}</p>
      <p>Email: {user.email}</p>

      <h3>Vos Questions:</h3>
      <ul>
        {userQuestions.map(question => (
          <li key={question.id} className="question-item">
            <h4>{question.title}</h4>
            <p>{question.content}</p> {/* Contenu de la question */}
            <p><strong>Catégorie:</strong> {categoriesMap[question.category]}</p> {/* Nom de la catégorie */}
            <p><strong>Date de création:</strong> {new Date(question.createdAt.toDate()).toLocaleDateString()}</p> {/* Date de création */}
            
            {/* Réponses */}
            <div className="responses-section">
              <h5>Réponses:</h5>
              {question.responses && question.responses.length > 0 ? (
                <ul>
                  {question.responses.map((response, index) => (
                    <li key={index}>
                      <p>{response.content}</p> {/* Contenu de la réponse */}
                      <p><strong>Posté le:</strong> {new Date(response.createdAt.toDate()).toLocaleDateString()}</p> {/* Date de création */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucune réponse pour cette question.</p>
              )}
            </div>

            {/* Likes */}
            <p><strong>Likes:</strong> {question.likes ? question.likes.length : 0}</p> {/* Nombre de likes */}
            
            {/* Commentaires */}
            <div className="comments-section">
              <h5>Commentaires:</h5>
              {question.comments && question.comments.length > 0 ? (
                <ul>
                  {question.comments.map((comment, index) => (
                    <li key={index}>
                      <p>{comment.content}</p> {/* Contenu du commentaire */}
                      <p><strong>Posté le:</strong> {new Date(comment.createdAt.toDate()).toLocaleDateString()}</p> {/* Date de création */}
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

      <button onClick={() => auth.signOut()}>Déconnexion</button>
    </div>
  );
};

export default Profile;
