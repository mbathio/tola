// Categories.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = ({ categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}/questions`);
  };

  return (
    <div className="categories">
      {categories.map(category => (
        <div key={category.id} className="category" onClick={() => handleCategoryClick(category.id)}>
          <h2>{category.name}</h2>
          <img src={category.image} alt={category.name} />
        </div>
      ))}
    </div>
  );
};

export default Categories;
