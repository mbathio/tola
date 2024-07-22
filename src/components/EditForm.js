import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const EditForm = ({ open, onClose, documentId, type, currentData }) => {
  const [text, setText] = useState(currentData.text || currentData.content || '');

  const handleSave = async () => {
    try {
      const docRef = doc(db, type === 'question' ? 'questions' : `questions/${documentId}/responses`, documentId);
      await updateDoc(docRef, { text });
      onClose(); // Fermer la boîte de dialogue après la sauvegarde
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifier {type === 'question' ? 'la question' : 'la réponse'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={type === 'question' ? 'Contenu de la question' : 'Contenu de la réponse'}
          type="text"
          fullWidth
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSave} color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditForm;
