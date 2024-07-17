import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';

const Home = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions from Firestore
    const fetchQuestions = async () => {
      try {
        const questionsSnapshot = await db.collection('questions').get();
        const questionsList = questionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsList);
      } catch (error) {
        console.error("Error fetching questions: ", error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
      <h1>Bienvenue sur Tola</h1>
      
      <div>
        <h2>Questions Récentes</h2>
        {/* Liste des questions récentes */}
        <ul>
          {questions.map(question => (
            <li key={question.id}>
              <Link to={`/questions/${question.id}`}>{question.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2>Explorer par Catégorie</h2>
        {/* Suggestions de catégories */}
        <ul>
          <li><Link to="/category/tech">Technologie</Link></li>
          <li><Link to="/category/science">Science</Link></li>
          <li><Link to="/category/art">Art</Link></li>
        </ul>
      </div>

      <div>
        <h2>Rechercher une Question</h2>
        {/* Champ de recherche */}
        <form>
          <input type="text" placeholder="Rechercher une question..." />
          <button type="submit">Rechercher</button>
        </form>
      </div>

      <div>
        <h2>Messages Importants</h2>
        {/* Messages ou notifications */}
        <p>Consultez nos dernières mises à jour !</p>
      </div>
    </div>
  );
};

export default Home;
