import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import CreateQuestion from './components/CreateQuestion';
import QuestionList from './components/QuestionList';
import CategorySelection from './components/CategorySelection'; // Assurez-vous que ce composant existe
import QuestionDetail from './components/QuestionDetail';
import AdminPanel from './components/AdminPanel';
import CategoryPage from './components/CategoryPage'; // Assurez-vous que ce composant existe
import './App.css';

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
const db = getFirestore(app);

const theme = createTheme({
  palette: {
    primary: {
      main: '#00a0dc',
    },
    secondary: {
      main: '#bdbdbd',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#333',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#333',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
    },
    body1: {
      fontSize: '1rem',
      color: '#666',
    },
  },
});

const App = () => {
  const [user, loading, error] = useAuthState(auth);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/create" element={user ? <CreateQuestion /> : <Navigate to="/login" />} />
          <Route path="/questions" element={user ? <QuestionList user={user} /> : <Navigate to="/login" />} />
          <Route path="/categories" element={user ? <CategorySelection user={user} /> : <Navigate to="/login" />} />
          <Route path="/category/:categoryName" element={user ? <CategoryPage /> : <Navigate to="/login" />} />
          {role === 'admin' && <Route path="/adminpanel" element={<AdminPanel />} />}
          <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export { db, auth };

export default App;
