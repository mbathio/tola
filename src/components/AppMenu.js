import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; // Utilisation de Routes à la place de Switch
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
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
import QuestionList from './QuestionList';
import ResponsesList from './ResponsesList';
import CategoriesList from './CategoriesList';
import Profile from './Profile';
import Notifications from './Notifications';
import Message from './Message';
import Settings from './Settings';
import AdminPanel from './AdminPanel';
import CreateQuestion from './CreateQuestion'; // Assurez-vous que CreateQuestion est correctement importé

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Tola
          </Typography>
          <div style={{ flexGrow: 1 }} /> {/* Pour pousser le login/Profile à droite */}
          <IconButton
            color="inherit"
            component={RouterLink}
            to="/create-question"
          >
            <QuestionIcon />
          </IconButton>
          <IconButton
            color="inherit"
            component={RouterLink}
            to="/login"
          >
            <PersonIcon />
          </IconButton>
          <IconButton
            color="inherit"
            component={RouterLink}
            to="/profile"
          >
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
            <ListItem button component={RouterLink} to="/">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Accueil" />
            </ListItem>
            <ListItem button component={RouterLink} to="/questions">
              <ListItemIcon><QuestionIcon /></ListItemIcon>
              <ListItemText primary="Questions" />
            </ListItem>
            <ListItem button component={RouterLink} to="/responses">
              <ListItemIcon><QuestionIcon /></ListItemIcon>
              <ListItemText primary="Réponses" />
            </ListItem>
            <ListItem button component={RouterLink} to="/categories">
              <ListItemIcon><CategoryIcon /></ListItemIcon>
              <ListItemText primary="Catégories" />
            </ListItem>
            <ListItem button component={RouterLink} to="/profile">
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profil" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button component={RouterLink} to="/notifications">
              <ListItemIcon><NotificationsIcon /></ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItem>
            <ListItem button component={RouterLink} to="/messages">
              <ListItemIcon><MessageIcon /></ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItem>
            <ListItem button component={RouterLink} to="/settings">
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Paramètres" />
            </ListItem>
            <ListItem button component={RouterLink} to="/admin">
              <ListItemIcon><AdminIcon /></ListItemIcon>
              <ListItemText primary="Administration" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/responses" element={<ResponsesList />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/create-question" element={<CreateQuestion />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppMenu;
