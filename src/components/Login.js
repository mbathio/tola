import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import '../App.css'; // Importez votre fichier CSS global

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Tentative de connexion avec : ', email, password);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Utilisateur authentifié avec UID : ', user.uid);

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Données utilisateur récupérées : ', userData);

        if (isAdminLogin && userData.role === 'admin') {
          console.log('Connexion réussie en tant qu\'admin');
          navigate('/adminpanel');
        } else if (!isAdminLogin && userData.role === 'user') {
          console.log('Connexion réussie en tant qu\'utilisateur');
          navigate('/profile');
        } else {
          setError('Accès refusé. Vérifiez votre type de connexion.');
        }
      } else {
        setError('Utilisateur non trouvé.');
      }
    } catch (error) {
      console.error('Erreur de connexion :', error);

      if (error.code === 'auth/invalid-email') {
        setError('Adresse e-mail invalide.');
      } else if (error.code === 'auth/user-not-found') {
        setError('Utilisateur non trouvé.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect.');
      } else {
        setError(`Erreur de connexion : ${error.message}`);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {!showForm ? (
        <div className="role-selection">
          <button onClick={() => { setIsAdminLogin(true); setShowForm(true); }}>Connexion Admin</button>
          <button onClick={() => { setIsAdminLogin(false); setShowForm(true); }}>Connexion Utilisateur</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Se connecter</button>
        </form>
      )}
      <p>Pas encore de compte ? <a href="/signup">Inscrivez-vous ici</a></p>
    </div>
  );
};

export default Login;
