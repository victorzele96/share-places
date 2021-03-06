import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import FavoritesContext from '../../context/favorites-context';

import DeployAvatar from '../UIElements/Avatar';

import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemText,
  Badge
} from '@mui/material';

import Filter from './Filter';

import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import StoreIcon from '@mui/icons-material/Store';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Menu } from '../../../static/icons/menu';

import { styled } from '@mui/material/styles';

import classes from './LeftDrawer.module.css';

const LeftDrawer = () => {
  const authCtx = useContext(AuthContext);
  const favoritesCtx = useContext(FavoritesContext);
  const [drawerstate, setDrawerState] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const signoutHandler = () => {
    authCtx.signout();
    setDrawerState(false);
  };

  const handleExpandClick = () => setExpanded(prevState => !prevState);

  const toggleDrawer = (anchor, open) => (event) => {
    /* 
      wont effect the toggle for clicking any key except
      F1 - F12, Esc, Print Screen, Scroll Lock, Pause|Break, 
      Insert, Home, End, Page Up, Page Down,
      other spacial keys that not for typing.
    */
    if (event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift' || event.key === 'Backspace'
        || event.key === 'Alt' || event.key === 'Control' || event.key === ' '
        || event.key === 'Delete' || event.key === 'Enter' || event.key === 'Space'
        || event.key === 'CapsLock'
        || (event.keyCode >= 37 && event.keyCode <= 40)
        || (event.keyCode >= 47 && event.keyCode <= 57)
        || (event.keyCode >= 65 && event.keyCode <= 91)
        || (event.keyCode >= 96 && event.keyCode <= 107)
        || (event.keyCode >= 109 && event.keyCode <= 111)
        || event.keyCode === 144 || event.keyCode === 110
        || (event.keyCode >= 186 && event.keyCode <= 192)
        || (event.keyCode >= 219 && event.keyCode <= 222)
        || event.keyCode === 226)) {
      return;
    }
    setDrawerState(prevState => !prevState);
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -15,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

  const list = (anchor) => (
    <Box
      className={classes.drawer}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem style={{ margin: "auto", display: "inline-block" }} >
          <ListItemIcon />
          <DeployAvatar type="sidebar" fname={authCtx.user ? authCtx.user.firstName : "Dear"} lname={authCtx.user ? authCtx.user.lastName : "Guest"} />
        </ListItem>
        {!authCtx.user ? ( //change to state!!!!
          <ListItem
            button
            component={Link}
            to="/auth"
            onClick={toggleDrawer(anchor, false)}
          >
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Sign In" />
          </ListItem>
        ) : (
          <ListItem button component={Link} to="/" onClick={signoutHandler} >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        )}
      </List>
      {authCtx.user && (
        <>
          <Divider />
          <div onClick={toggleDrawer(anchor, false)}>
            <List>
              <ListItem button component={Link} to="/favorites">
                <StyledBadge badgeContent={favoritesCtx.totalFavorites} color="primary">
                  <ListItemIcon>
                    <BookmarkAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Favorites" />
                </StyledBadge>
              </ListItem>
              <ListItem button component={Link} to="/add-place">
                <ListItemIcon>
                  <AddBusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Add Place" />
              </ListItem>
              <ListItem button component={Link} to="/my-places">
                <ListItemIcon>
                  <StoreIcon />
                </ListItemIcon>
                <ListItemText primary="My Places" />
              </ListItem>
            </List>
          </div>
        </>
      )}
      <Divider />
      <List>
        <ListItem>
          <ListItemIcon>
            <FilterAltIcon />
          </ListItemIcon>
          <ListItemText primary="Filter" />
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </ListItem>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Filter />
        </Collapse>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key={'right'}>
        <IconButton
          onClick={toggleDrawer()}
          className={classes.menueBtn}
        >
          <Menu
          // fontSize="large"
          />
        </IconButton>
        <Drawer
          anchor={'left'}
          open={drawerstate}
          onClose={toggleDrawer()}
        >
          {list('left')}
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default LeftDrawer;