import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; // Utilisation de Routes à la place de Switch
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { Menu as MenuIcon, Home as HomeIcon, QuestionAnswer as QuestionIcon, Category as CategoryIcon, Person as PersonIcon, Notifications as NotificationsIcon, Message as MessageIcon, Settings as SettingsIcon, SupervisorAccount as AdminIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import Home from './Home';
import QuestionsList from './QuestionsList'; // Assurez-vous que QuestionsList est correctement importé s'il n'est pas encore défini
import ResponsesList from './ResponsesList'; // Assurez-vous que ResponsesList est correctement importé s'il n'est pas encore défini
import CategoriesList from './CategoriesList';
import Profile from './Profile'; // Assurez-vous que Profile est correctement importé s'il n'est pas encore défini
import Notifications from './Notifications';
import Messages from './Messages'; // Assurez-vous que Messages est correctement importé s'il n'est pas encore défini
import Settings from './Settings';
import AdminPanel from './AdminPanel';

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
          <Route path="/questions" element={<QuestionsList />} />
          <Route path="/responses" element={<ResponsesList />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppMenu;