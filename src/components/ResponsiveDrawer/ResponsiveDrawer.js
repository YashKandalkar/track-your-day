import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import MuiLink from '@material-ui/core/Link';

import WbIncandescentOutlinedIcon from '@material-ui/icons/WbIncandescentOutlined';
import HistoryIcon from '@material-ui/icons/History';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { Link } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
    //   width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#202124',
    color: '#e8eaed',
  },
  list: {
    '&>.Mui-selected': {
      backgroundColor: '#41331c',
      
      '&:hover': {
        backgroundColor: '#41331c',
      }
    },
    '&>.MuiListItem-root': {
      color: '#e8eaed',
      borderTopRightRadius: '25px',
      borderBottomRightRadius: '25px',
      '&:hover': {
        backgroundColor: '#28292c'
      }
    }
  },
  content: {
    flexGrow: 1,
    background: '#121212',
    padding: theme.spacing(3)
  },
  icon: {
    color: '#e8eaed'
  },
  copyright: {
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: '1rem',
    color: '#9aa0a6'
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'underline'
  }
}));

function ResponsiveDrawer(props) {
  const { window, path, onLogout } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List className={classes.list}>
          <ListItem 
            selected={path==='/'} 
            component={Link} 
            to='/'
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <WbIncandescentOutlinedIcon className={classes.icon}/>
            </ListItemIcon>
            <ListItemText primary={"Active Tasks"} />
          </ListItem>
          <ListItem 
            selected={path==='/history'} 
            component={Link} 
            to='/history'
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <HistoryIcon className={classes.icon}/>
            </ListItemIcon>
            <ListItemText primary={"History"} />
          </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {"Track Your Day"}
          </Typography>
          <Tooltip title={"Logout"} arrow>
            <IconButton style={{marginLeft: 'auto'}} onClick={onLogout}>
              <ExitToAppIcon style={{color: '#eee'}}/>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="nav drawer">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
            <Typography variant={"caption"} className={classes.copyright}>
              {"Make with ❤️ by "} 
              <MuiLink 
                className={classes.link} 
                color="inherit"
                href={"https://yashkandalkar.github.io"}
                target={"_blank"}
                rel={"noopener"}
              > 
                Yash Kandalkar
              </MuiLink> 
            </Typography>
          </Drawer>
        
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
      
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
