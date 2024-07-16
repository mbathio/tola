import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCCpdUVCCz3HRumnu_vlN5cEBTelHFYBiA",
    authDomain: "tola-14414.firebaseapp.com",
    projectId: "tola-14414",
    storageBucket: "tola-14414.appspot.com",
    messagingSenderId: "18599793851",
    appId: "1:18599793851:web:9b7d9d407a4ca7d7bc459e",
    measurementId: "G-JZYFWV7T0J"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

const addCategories = async () => {
  const categories = [
    {
      name: "Informatique et Télécommunications",
      description: "Développement logiciel, Réseaux et télécommunications, Sécurité informatique, etc.",
      image: "URL_DE_L_IMAGE_INFORMATIQUE"
    },
    {
      name: "Génie Électrique",
      description: "Électronique, Électrotechnique, Automatismes, etc.",
      image: "URL_DE_L_IMAGE_GENIE_ELECTRIQUE"
    },
    {
      name: "Génie Mécanique",
      description: "Mécanique des fluides, Thermodynamique, CAO, etc.",
      image: "URL_DE_L_IMAGE_GENIE_MECANIQUE"
    },
    // Ajoutez d'autres catégories ici
    {
        name: "Génie Civil",
        description: "Structure et construction, Géotechnique, Hydraulique, Environnement et développement durable",
        image: "URL_DE_L_IMAGE_GENIE_MECANIQUE"
      },
      {
        name: "Génie Chimique et Biologique",
        description: "Chimie industrielle, Biotechnologie, Procédés chimiques, Environnement",
        image: "URL_DE_L_IMAGE_GENIE_MECANIQUE"
      },
      {
        name: "Management et Sciences Économiques",
        description: "Gestion de projet, Finance, Marketing, Entrepreneuriat",
        image: "URL_DE_L_IMAGE_GENIE_MECANIQUE"
      },
      {
        name: "Mathématiques et Physique",
        description: "Analyse mathématique, Physique appliquée, Statistiques, Recherche opérationnelle",
        image: "URL_DE_L_IMAGE_GENIE_MECANIQUE"
      },
      {
        name: "Vie Étudiante",
        description: "Clubs et associations, Événements étudiants, Sports, Logement et vie sur le campus",
        image: "URL_DE_L_IMAGE_GENIE_MECANIQUE"
      },
      {
        name: "Carrière et Développement Personnel",
        description: "Stages et opportunités professionnelles, Compétences et formation, Bourses et financement, Conseils pour les études",
        image: "URL_DE_L_IMAGE_GENIE_MECANIQUE"
      },
      {
        name: "Innovation et Recherche",
        description: "Projets de recherche, Innovations technologiques, Conférences et séminaires, Partenariats industriels",
        image: "URL_DE_L_IMAGE_GENIE_MECANIQUE"
      },
      {
        name: "Autres",
        description: "Questions générales, Discussions libres, Sujets d'actualité",
        image: "URL_DE_L_IMAGE_GENIE_MECANIQUE"
      },
  ];

  const categoriesCollection = firestore.collection('categories');

  for (const category of categories) {
    await categoriesCollection.add(category);
  }

  console.log("Catégories ajoutées avec succès !");
};

addCategories();