// src/components/Home.js
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import QuestionList from './QuestionList';
import SideMenu from './SideMenu'; // Importez SideMenu

const categories = [
  { name: 'Informatique et télécommunications', slug: 'tech' },
  { name: 'Génie Électrique', slug: 'electrical' },
  { name: 'Génie Mécanique', slug: 'mechanical' },
  { name: 'Génie Civil', slug: 'civil' },
  { name: 'Génie Chimique et Biologique', slug: 'chemical-biological' },
  { name: 'Management et Sciences Économiques', slug: 'management-economics' },
  { name: 'Mathématiques et Physique', slug: 'math-physics' },
  { name: 'Vie Étudiante', slug: 'student-life' },
  { name: 'Carrière et Développement Personnel', slug: 'career-development' },
  { name: 'Innovation et Recherche', slug: 'innovation-research' },
  { name: 'Autres', slug: 'other' }
];

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
      <SideMenu /> {/* Ajoutez SideMenu ici */}
      <div className="main-content">
        <h1>Bienvenue sur Tola</h1>
        <div>
          <h2>Questions Récentes</h2>
          <QuestionList />
          <ul>
            {questions.map(question => (
              <li key={question.id}>
                <Link to={`/questions/${question.id}`}>{question.title}</Link>
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
          <h2>Rechercher une Question</h2>
          <form>
            <input type="text" placeholder="Rechercher une question..." />
            <button type="submit">Rechercher</button>
          </form>
        </div>
        <div>
          <h2>Messages Importants</h2>
          <p>Consultez nos dernières mises à jour !</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
