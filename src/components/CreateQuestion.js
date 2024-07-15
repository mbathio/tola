// src/components/CreateQuestion.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const CreateQuestion = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'questions'), {
        title,
        content,
        category,
        createdAt: new Date(),
      });
      setTitle('');
      setContent('');
      setCategory('');
      alert('Question créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de la question : ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Créer la Question</button>
    </form>
  );
};

export default CreateQuestion;
