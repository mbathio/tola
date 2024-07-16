import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth.js';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import Signup from './components/Signup.js';
import Login from './components/Login.js';
import Home from './components/Home.js';
import CreateQuestion from './components/CreateQuestion.js';
import QuestionList from './components/QuestionList.js';
import AppMenu from './components/AppMenu.js';

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

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Router>
    <AppMenu />
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create" element={<CreateQuestion />} />
      <Route path="/questions" element={<QuestionList />} />
    </Routes>
  </Router>
);
};

export default App;