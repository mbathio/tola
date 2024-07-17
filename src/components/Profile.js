// src/components/Profile.js
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';

const Profile = () => {
  const [user] = useAuthState(auth);

  if (!user) {
    // Si l'utilisateur n'est pas connecté, vous pouvez gérer cela ici (peut-être rediriger vers la page de connexion)
    return <div>Vous n'êtes pas connecté.</div>;
  }

  return (
    <div>
      <h2>Profil de {user.email}</h2>
      <p>Nom: {user.displayName}</p>
      <p>Email: {user.email}</p>
      {/* Vous pouvez ajouter d'autres informations utilisateur ici */}
      <button onClick={() => auth.signOut()}>Déconnexion</button>
    </div>
  );
};

export default Profile;
