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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Récupérer les informations de l'utilisateur depuis Firestore en utilisant l'UID
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (isAdminLogin && userData.role === 'admin') {
          alert('Bienvenue Admin!');
          navigate('/admin'); // Rediriger l'administrateur vers une page dédiée
        } else if (!isAdminLogin && userData.role === 'user') {
          alert('Connexion réussie!');
          navigate('/profile'); // Rediriger l'utilisateur vers son profil
        } else {
          setError('Accès refusé. Vérifiez votre type de connexion.');
        }
      } else {
        setError('Utilisateur non trouvé.');
      }
    } catch (error) {
      setError(`Erreur de connexion: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {!showForm ? (
        <div>
          <button onClick={() => { setIsAdminLogin(true); setShowForm(true); }}>Connexion Admin</button>
          <button onClick={() => { setIsAdminLogin(false); setShowForm(true); }}>Connexion Utilisateur</button>
        </div>
      ) : (
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
      )}
      <p>Pas encore de compte? <a href="/signup">Inscrivez-vous ici</a></p>
    </div>
  );
};

export default Login;
