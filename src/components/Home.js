import React from 'react';
import { Link } from 'react-router-dom';
import QuestionList from './QuestionList';
import SideMenu from './SideMenu';
import '../App.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="main-content">
        <h1>Bienvenue sur Tola</h1>
        <div>
          <h2>Questions Récentes</h2>
          <QuestionList />
          <ul className="question-list">
            {/* Remplacez cette liste par des questions statiques ou un autre contenu */}
            <li className="question-card">
              <Link to={`/questions/sample`} className="question-link">
                <h3>Titre de Question Exemple</h3>
                <p>Description de la question exemple.</p>
              </Link>
            </li>
            {/* Ajoutez d'autres éléments ici si nécessaire */}
          </ul>
          {/* Retiré le chargement dynamique et le message de fin */}
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
