import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenue sur Tola</h1>
      
      <div>
        <h2>Questions Récentes</h2>
        {/* Liste des questions récentes */}
        <ul>
          <li><Link to="/questions/1">Question 1</Link></li>
          <li><Link to="/questions/2">Question 2</Link></li>
          <li><Link to="/questions/3">Question 3</Link></li>
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
