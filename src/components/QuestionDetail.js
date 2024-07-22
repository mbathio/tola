// Assurez-vous d'importer les dépendances nécessaires et de gérer le routage.
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import EditForm from './EditForm'; // Importer le composant EditForm

const QuestionDetail = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [responses, setResponses] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchQuestion = async () => {
      const docRef = doc(db, 'questions', questionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setQuestion(docSnap.data());
      } else {
        console.log('Aucune question trouvée');
      }
    };

    const fetchResponses = async () => {
      const responsesCollection = collection(db, 'questions', questionId, 'responses');
      const responseDocs = await getDocs(responsesCollection);
      setResponses(responseDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchQuestion();
    fetchResponses();
  }, [questionId]);

  const handleEdit = (documentId, type, data) => {
    setEditMode({ [documentId]: true });
    setEditData({ id: documentId, type, data });
  };

  const handleCloseEdit = () => {
    setEditMode({});
    setEditData({});
  };

  return (
    <div>
      {question && (
        <div>
          <h1>{question.title}</h1>
          <p>{question.content}</p>
          {/* Ajouter un bouton pour éditer la question */}
          <button onClick={() => handleEdit(questionId, 'question', { text: question.content })}>
            Modifier la question
          </button>
          {responses.map(response => (
            <div key={response.id}>
              <p>{response.text}</p>
              {/* Ajouter un bouton pour éditer la réponse */}
              <button onClick={() => handleEdit(response.id, 'response', { text: response.text })}>
                Modifier la réponse
              </button>
            </div>
          ))}
          {Object.keys(editMode).map(documentId => (
            <EditForm
              key={documentId}
              open={editMode[documentId]}
              onClose={handleCloseEdit}
              documentId={editData.id}
              type={editData.type}
              currentData={editData.data}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
