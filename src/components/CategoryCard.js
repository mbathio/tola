import React from 'react';

const CategoryCard = ({ category }) => {
  return (
    <div className="category-card">
      <img src={category.image} alt={category.name} className="category-image" />
      <h2 className="category-name">{category.name}</h2>
    </div>
  );
};

export default CategoryCard;
