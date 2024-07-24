import React from 'react';
import { Link as RouterLink, Routes, Route } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@material-ui/core';
import { Menu as MenuIcon, Person as PersonIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import QuestionIcon from '@material-ui/icons/QuestionAnswer';
import CategoryIcon from '@material-ui/icons/Category';
import NotificationsIcon from '@material-ui/icons/NotificationsActive';
import MessageIcon from '@material-ui/icons/Message';
import SettingsIcon from '@material-ui/icons/Settings';
import AdminIcon from '@material-ui/icons/SupervisedUserCircleRounded';

import Home from './Home';
import Login from './Login';
import QuestionList from './QuestionList';
import ResponsesList from './ResponsesList';
import CategoriesList from './CategoriesList';
import Profile from './Profile';
import Notifications from './Notifications';
import Message from './Message';
import Settings from './Settings';
import AdminPanel from './AdminPanel';
import CreateQuestion from './CreateQuestion';
import Signup from './Signup';
import '../App.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
    borderRight: '1px solid #ddd',
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  menuButton: {
    marginLeft: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  toolbar: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fff',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
  },
  searchInput: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #ddd',
    outline: 'none',
    flex: 1,
    
  },
  searchButton: {
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  spacer: {
    flexGrow: 1,
  },
  drawerListItem: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const AppMenu = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Tola
          </Typography>
          <div className={classes.spacer} />
          <form className={classes.searchForm}>
            <input type="text" placeholder="Rechercher une question..." className={classes.searchInput} />
            <button type="submit" className={classes.searchButton}>Rechercher</button>
          </form>
          <Button component={RouterLink} to="/create-question" className={classes.menuButton}>
            Ajouter une question
          </Button>
          <Button component={RouterLink} to="/login" color="inherit">
            Connexion | S'inscrire
          </Button>
          <IconButton color="inherit" component={RouterLink} to="/profile">
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button component={RouterLink} to="/" className={classes.drawerListItem}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Accueil" />
            </ListItem>
            <ListItem button component={RouterLink} to="/questions" className={classes.drawerListItem}>
              <ListItemIcon>
                <QuestionIcon />
              </ListItemIcon>
              <ListItemText primary="Questions" />
            </ListItem>
            <ListItem button component={RouterLink} to="/responses" className={classes.drawerListItem}>
              <ListItemIcon>
                <QuestionIcon />
              </ListItemIcon>
              <ListItemText primary="Réponses" />
            </ListItem>
            <ListItem button component={RouterLink} to="/categories" className={classes.drawerListItem}>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Catégories" />
            </ListItem>
            <ListItem button component={RouterLink} to="/profile" className={classes.drawerListItem}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profil" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button component={RouterLink} to="/notifications" className={classes.drawerListItem}>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItem>
            <ListItem button component={RouterLink} to="/messages" className={classes.drawerListItem}>
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItem>
            <ListItem button component={RouterLink} to="/settings" className={classes.drawerListItem}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Paramètres" />
            </ListItem>
            <ListItem button component={RouterLink} to="/admin" className={classes.drawerListItem}>
              <ListItemIcon>
                <AdminIcon />
              </ListItemIcon>
              <ListItemText primary="Administration" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/responses" element={<ResponsesList />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/create-question" element={<CreateQuestion />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppMenu;
