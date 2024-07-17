// src/components/CategoriesList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Correctement importé
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  categoriesList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  categoryCard: {
    position: 'relative',
    width: '22%', // Ajustez la largeur pour qu'il y ait 4 catégories par ligne
    height: '200px',
    margin: theme.spacing(1),
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none', // Pour retirer la décoration de lien
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryName: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    textAlign: 'center',
    padding: theme.spacing(1),
  },
}));

const CategoriesList = () => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={classes.categoriesList}>
      {categories.map(category => (
        <Link key={category.id} to={`/categories/${category.id}`} className={classes.categoryCard}>
          <img src={category.image} alt={category.name} className={classes.categoryImage} />
          <div className={classes.categoryName}>{category.name}</div>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesList;
