import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Importation du CSS spécifique

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollection = await getDocs(collection(db, 'users'));
        setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const questionsCollection = await getDocs(collection(db, 'questions'));
        setQuestions(questionsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const categoriesCollection = await getDocs(collection(db, 'categories'));
        setCategories(categoriesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkUserRole = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        if (userData && userData.role !== 'admin') {
          navigate('/'); // Redirige vers la page d'accueil si l'utilisateur n'est pas admin
        }
      } else {
        navigate('/'); // Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
      }
    };

    checkUserRole();
  }, [navigate]);

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      const userDoc = doc(db, 'users', id);
      await updateDoc(userDoc, { role });
      setUsers(users.map(user => (user.id === id ? { ...user, role } : user)));
    } catch (error) {
      console.error('Error updating role: ', error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteDoc(doc(db, 'questions', id));
      setQuestions(questions.filter(question => question.id !== id));
    } catch (error) {
      console.error('Error deleting question: ', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category: ', error);
    }
  };

  const handleUpdateCategory = async (id, name) => {
    console.log('ID de la catégorie à mettre à jour:', id);
    console.log('Nouveau nom de la catégorie:', name);

    try {
      const categoryDoc = doc(db, 'categories', id);
      await updateDoc(categoryDoc, { name });

      setCategories(categories.map(category =>
        category.id === id ? { ...category, name } : category
      ));
      setEditCategoryId(null);
      setEditCategoryName('');
    } catch (error) {
      console.error('Error updating category: ', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: newUserEmail,
        displayName: newUsername,
        role: newUserRole,
        createdAt: new Date(),
      });

      setUsers([...users, { id: user.uid, email: newUserEmail, displayName: newUsername, role: newUserRole }]);
      setNewUserEmail('');
      setNewUsername('');
      setNewUserPassword('');
      setNewUserRole('user');
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const newCategory = {
        name: newCategoryName,
        createdAt: new Date(),
      };

      const categoryRef = doc(collection(db, 'categories'));
      await setDoc(categoryRef, newCategory);

      setCategories([...categories, { id: categoryRef.id, ...newCategory }]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  };

  return (
    <div className="admin-panel-container">
      <h1>Admin Panel</h1>

      <h2>Ajouter un Utilisateur</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAddUser();
      }}>
        <input
          type="email"
          placeholder="Email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={newUserPassword}
          onChange={(e) => setNewUserPassword(e.target.value)}
          required
        />
        <select
          value={newUserRole}
          onChange={(e) => setNewUserRole(e.target.value)}
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>

      <h2>Utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nom d'utilisateur</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.displayName}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Questions</h2>
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Contenu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{question.title}</td>
              <td>{question.content}</td>
              <td>
                <button onClick={() => handleDeleteQuestion(question.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Catégories</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAddCategory();
      }}>
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      {editCategoryId && (
        <div className="edit-category-form">
          <h3>Modifier la catégorie</h3>
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            required
          />
          <button onClick={() => handleUpdateCategory(editCategoryId, editCategoryName)}>
            Mettre à jour
          </button>
          <button onClick={() => setEditCategoryId(null)}>Annuler</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>
                <button onClick={() => {
                  setEditCategoryId(category.id);
                  setEditCategoryName(category.name);
                }}>Modifier</button>
                <button onClick={() => handleDeleteCategory(category.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
