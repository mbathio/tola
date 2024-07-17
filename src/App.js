import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import 'firebase/compat/firestore';

import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import CreateQuestion from './components/CreateQuestion';
import QuestionList from './components/QuestionList';
import CategoryPage from './components/CategoryPage';
import AppMenu from './components/AppMenu';
import QuestionDetail from './components/QuestionDetail';
import AdminPanel from './components/AdminPanel'; // Importation du composant AdminPanel
import './App.css'; // Assurez-vous d'importer App.css

const firebaseConfig = {
  apiKey: "AIzaSyCCpdUVCCz3HRumnu_vlN5cEBTelHFYBiA",
  authDomain: "tola-14414.firebaseapp.com",
  projectId: "tola-14414",
  storageBucket: "tola-14414.appspot.com",
  messagingSenderId: "18599793851",
  appId: "1:18599793851:web:9b7d9d407a4ca7d7bc459e",
  measurementId: "G-JZYFWV7T0J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const App = () => {
  const [user, loading, error] = useAuthState(auth);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading) {
    // Afficher un indicateur de chargement si l'état d'authentification est en cours de chargement
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppMenu />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={user ? <CreateQuestion /> : <Navigate to="/login" />} />
        <Route path="/questions" element={<QuestionList />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        {role === 'admin' && <Route path="/admin" element={<AdminPanel />} />}
        {/* Redirigez les utilisateurs non connectés vers la page de connexion */}
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
