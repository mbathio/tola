import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisez useNavigate au lieu de useHistory
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import '../App.css'; // Importez votre fichier CSS global

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Récupérer les informations de l'utilisateur depuis Firestore
      const usersCollection = collection(db, 'users');
      const userDocs = await getDocs(usersCollection);
      const userDoc = userDocs.docs.find(doc => doc.data().email === email);

      if (userDoc) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          alert('Bienvenue Admin!');
        } else {
          alert('Connexion réussie!');
        }
        // Rediriger l'utilisateur vers son profil
        navigate('/profile');
      } else {
        alert('Utilisateur non trouvé dans Firestore.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
      <p>Pas encore de compte? <a href="/signup">Inscrivez-vous ici</a></p>
    </div>
  );
};

export default Login;
