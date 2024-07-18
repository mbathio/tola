import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import QuestionList from './QuestionList';
import SideMenu from './SideMenu';
import '../App.css';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const lastQuestion = questions.length > 0 ? questions[questions.length - 1] : null;
      let q = query(
        collection(db, 'questions'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      if (lastQuestion) {
        q = query(
          collection(db, 'questions'),
          orderBy('createdAt', 'desc'),
          startAfter(lastQuestion.createdAt),
          limit(5)
        );
      }

      const questionsSnapshot = await getDocs(q);
      const newQuestions = questionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setQuestions(prevQuestions => [...prevQuestions, ...newQuestions]);
      setLoading(false);

      if (questionsSnapshot.empty) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching questions: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };

    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore) {
        fetchQuestions();
      }
    };

    observer.current = new IntersectionObserver(handleObserver, options);
    observer.current.observe(document.querySelector('.infinite-scroll-footer'));

    return () => observer.current.disconnect();
  }, [loading, hasMore]);

  return (
    <div className="home-container">
      <div className="main-content">
        <h1>Bienvenue sur Tola</h1>
        <div>
          <h2>Questions Récentes</h2>
          <QuestionList />
          <ul className="question-list">
            {questions.map(question => (
              <li key={question.id} className="question-card">
                <Link to={`/questions/${question.id}`} className="question-link">
                  <h3>{question.title}</h3>
                  <p>{question.description}</p>
                  {/* Affichez d'autres détails de la question selon votre structure de données */}
                </Link>
              </li>
            ))}
          </ul>
          {loading && <p>Loading...</p>}
          {!loading && !hasMore && <p>Fin des questions.</p>}
        </div>
        <div className="infinite-scroll-footer">
          {/* Cet élément déclenchera le chargement de plus de questions */}
        </div>
        <div>
          <h2>Messages Importants</h2>
          <p>Consultez nos dernières mises à jour !</p>
        </div>
      </div>
      <SideMenu className="side-menu" />
    </div>
  );
};

export default Home;
