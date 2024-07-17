import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuestionList from './QuestionList'; // Assurez-vous que QuestionList est correctement importé

const CategoryPage = () => {
  const { slug } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Ici vous devriez faire la requête pour récupérer les questions de la catégorie
    // Utilisez Firebase ou votre base de données pour cela
    // Exemple de code à remplir
    const fetchQuestionsByCategory = async () => {
      // Implémentez la logique de récupération des questions par catégorie
      // Par exemple, utiliser Firebase Firestore
      // Assurez-vous d'adapter cette partie en fonction de votre configuration Firebase
      try {
        // Exemple avec Firebase Firestore
        const querySnapshot = await db.collection('questions')
          .where('category', '==', slug)
          .get();

        const fetchedQuestions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions by category: ", error);
      }
    };

    fetchQuestionsByCategory();
  }, [slug]);

  return (
    <div className="category-page">
      <h2>Questions de la catégorie : {slug}</h2>
      <QuestionList questions={questions} />
    </div>
  );
};

export default CategoryPage;
