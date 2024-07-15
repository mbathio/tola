// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import CreateQuestion from './components/CreateQuestion';
import QuestionList from './components/QuestionList';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebase';

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateQuestion />} />
        <Route path="/questions" element={<QuestionList />} />
      </Routes>
    </Router>
  );
};

export default App;
