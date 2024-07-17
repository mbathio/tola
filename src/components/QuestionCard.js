// src/components/QuestionCard.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease',
    textDecoration: 'none',
    color: 'inherit',
  },
  cardHover: {
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  },
  title: {
    marginBottom: theme.spacing(1),
    fontSize: '18px',
    color: '#333',
  },
  description: {
    color: '#666',
  },
}));

const QuestionCard = ({ question }) => {
  const classes = useStyles();

  return (
    <RouterLink to={`/questions/${question.id}`} className={`${classes.card} ${classes.cardHover}`}>
      <Card>
        <CardContent>
          <Typography className={classes.title} variant="h6">{question.title}</Typography>
          <Typography className={classes.description}>{question.description}</Typography>
        </CardContent>
      </Card>
    </RouterLink>
  );
};

export default QuestionCard;
