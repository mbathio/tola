import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../App.css'; // Import your global CSS

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userQuestions, setUserQuestions] = useState([]);
  
  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const userQuestionsRef = collection(db, 'questions');
        const q = query(userQuestionsRef, where('authorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userQuestionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserQuestions(userQuestionsData);
      } catch (error) {
        console.error('Error fetching user questions: ', error);
      }
    };

    if (user) {
      fetchUserQuestions();
    }
  }, [user]);

  if (!user) {
    // If user is not logged in, handle accordingly (possibly redirect to login page)
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
          <li key={question.id}>
            <h4>{question.title}</h4>
            <p>{question.description}</p>
            {/* Display other details of the question based on your data structure */}
          </li>
        ))}
      </ul>

      {/* You can add more user information or actions here */}
      <button onClick={() => auth.signOut()}>Déconnexion</button>
    </div>
  );
};

export default Profile;
