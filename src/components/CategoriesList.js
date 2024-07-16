import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import CategoryCard from './CategoryCard'; // Importez le composant CategoryCard
import './CategoriesList.css'; // Créez ce fichier pour ajouter des styles

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
