// src/components/Messages.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Assurez-vous que le chemin vers votre fichier firebase.js est correct

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesCollection = collection(db, 'messages'); // Utilisation de la collection 'messages' de votre base de données
      const querySnapshot = await getDocs(messagesCollection);
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Liste des Messages</h2>
      <ul>
        {messages.map(message => (
          <li key={message.id}>
            <strong>De: {message.sender}</strong>: {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
