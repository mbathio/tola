import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Typography, Checkbox, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px',
    padding: '10px',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  categoryList: {
    marginBottom: '20px',
  },
}));

const CategorySelection = () => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = querySnapshot.docs.map(doc => doc.data().name);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(setUser);

    return () => unsubscribe();
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories(prev => 
      checked ? [...prev, value] : prev.filter(cat => cat !== value)
    );
  };

  const handleSubmit = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { selectedCategories });
        // Rediriger vers la page des questions ou afficher un message de succès
      } catch (error) {
        console.error('Erreur lors de la mise à jour des catégories :', error);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Sélectionnez vos catégories d'intérêt
      </Typography>
      <div className={classes.categoryList}>
        {categories.map(category => (
          <div key={category}>
            <Checkbox
              value={category}
              onChange={handleCategoryChange}
              checked={selectedCategories.includes(category)}
            />
            <Typography variant="body1">{category}</Typography>
          </div>
        ))}
      </div>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Enregistrer les catégories
      </Button>
    </div>
  );
};

export default CategorySelection;
