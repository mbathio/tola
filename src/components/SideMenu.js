import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Informatique et télécommunications', slug: 'tech' },
  { name: 'Génie Électrique', slug: 'electrical' },
  { name: 'Génie Mécanique', slug: 'mechanical' },
  { name: 'Génie Civil', slug: 'civil' },
  { name: 'Génie Chimique et Biologique', slug: 'chemical-biological' },
  { name: 'Management et Sciences Économiques', slug: 'management-economics' },
  { name: 'Vie Étudiante', slug: 'student-life' },
  { name: 'Carrière et Développement Personnel', slug: 'career-development' },
];

const SideMenu = () => {
  return (
    <div className="side-menu">
      <h2>Explorer par Catégorie</h2>
      <ul>
        {categories.map(category => (
          <li key={category.slug}>
            <Link to={`/category/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
