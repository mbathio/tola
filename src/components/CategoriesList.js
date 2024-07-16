// CategoriesList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase'; // Importez db depuis firebase.js

import CategoryCard from './CategoryCard'; // Assurez-vous de ne pas ajouter .js à la fin

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = db.collection('categories'); // Utilisez db pour accéder à la collection 'categories'
      const categoriesSnapshot = await categoriesCollection.get();
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories-list">
      <h1>Catégories</h1>
      <div className="categories-grid">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
