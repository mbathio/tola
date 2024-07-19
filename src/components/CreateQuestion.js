import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import '../App.css'; // Importation du fichier App.css pour les styles

const CreateQuestion = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [user, loading, error] = useAuthState(getAuth());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newQuestion = {
        title,
        content,
        category,
        createdAt: new Date(),
        authorId: user ? user.uid : null // Ajouter l'ID de l'utilisateur comme auteur de la question
      };
      await addDoc(collection(db, 'questions'), newQuestion);
      setTitle('');
      setContent('');
      setCategory('');
      alert('Question créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de la question : ', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Vous devez être connecté pour créer une question. <a href="/login">Se connecter</a></p>;
  }

  return (
    <form className="create-question-form" onSubmit={handleSubmit}>
      <div>
        <label>Titre :</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contenu :</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      <div>
        <label>Catégorie :</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Créer la Question</button>
    </form>
  );
};

export default CreateQuestion;
