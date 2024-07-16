import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import CategoryCard from './CategoryCard.js'; // Ajoutez .js à la fin
import firebase from '../firebase/firebase.js'; // Ajoutez .js à la fin

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = firebase.firestore().collection('categories');
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
