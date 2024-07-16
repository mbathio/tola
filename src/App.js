import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app'; // Assurez-vous d'importer Firebase correctement
import 'firebase/auth'; // Importez le module d'authentification Firebase si nécessaire
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import CreateQuestion from './components/CreateQuestion';
import QuestionList from './components/QuestionList';

// Initialisez Firebase avec votre configuration
const firebaseConfig = {
  // Vos configurations Firebase
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Récupérez l'objet d'authentification Firebase
const auth = firebase.auth();

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateQuestion />} />
        <Route path="/questions" element={<QuestionList />} />
      </Routes>
    </Router>
  );
};

export default App;
