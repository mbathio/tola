import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import '../App.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Utiliser useNavigate pour React Router v6

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        role: 'user',
        categories: selectedCategories,
        createdAt: new Date()
      });
      alert('Inscription réussie!');
      navigate('/categories'); // Utiliser navigate pour la redirection
    } catch (error) {
      setError(error.message);
      console.error("Erreur lors de l'inscription : ", error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Nom d'utilisateur:</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Catégories:</label>
          {categories.map(category => (
            <div key={category.id}>
              <input
                type="checkbox"
                value={category.id}
                onChange={(e) => {
                  const { value, checked } = e.target;
                  setSelectedCategories(prevState =>
                    checked ? [...prevState, value] : prevState.filter(id => id !== value)
                  );
                }}
              />
              {category.name}
            </div>
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Signup;
