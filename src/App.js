import React, { useState, useEffect } from 'react';
import isHerokuSleeping from 'react-use-heroku';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import Home from "./pages/Home/Home";
import Analyze from "./pages/Analyze/Analyze";
import History from "./pages/History/History";

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Grow from '@material-ui/core/Grow';
import ResponsiveDrawer from './components/ResponsiveDrawer/ResponsiveDrawer';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

const BASE_URL = "https://track-your-day.herokuapp.com";

const initialState = {
  name: '',
  id: ''
}

const useStyles = makeStyles((theme) => ({
  snackbar: {
    [theme.breakpoints.down('sm')]: {
      bottom: 80,
    },
  },
  herokuSleeping: {
    textAlign: 'center',
    color: '#eee',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }
}));

const GrowTransition = (props) => {
  return <Grow {...props} />;
}

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

let snackbarTimeout;
  
function App() {
  const [mounted, setMounted] = useState(false)
  const [loggedIn, setLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [userData, setUserData] = useState(initialState);
  const [checkedRemember, setCheckedRemember] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if(!mounted){
      const remember = localStorage.getItem('remember') === 'true';
      if(remember){
        const name = localStorage.getItem('name'); 
        const id = localStorage.getItem('id');
        const joined = localStorage.getItem('joined');
        setUserData({name, id, joined});
        setLogin(true);
      }
      setCheckedRemember(true);
      setMounted(true);
    }
  }, [mounted, setMounted, setCheckedRemember])

  const openAlert = (msg, severity) => {
    if(open){
      setOpen(false);
      if(snackbarTimeout === 0){
        snackbarTimeout = setTimeout(() => {
          setAlertMsg(msg);
          setOpen(true);
          setAlertSeverity(severity);
        }, 1000);
      } else {

      }
    }
    setAlertMsg(msg);
    setOpen(true);
    setAlertSeverity(severity);
  }

  const alertClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setOpen(false);
  }

  const onLogout = () => {
    localStorage.setItem('remember', 'false');
    setLogin(false);
  }
 
  if(isHerokuSleeping({url: `${BASE_URL}/`})){
    return (
      <Container className={classes.herokuSleeping} maxWidth={"sm"}>
        <Typography style={{fontSize: '1.5rem', marginBottom: '1rem'}}>
          Heroku is sleeping, hang tight!
        </Typography>
        <CircularProgress />
      </Container>
      
    )
  }

  return (
    <div className='App'>
      <Router basename={"/track-your-day"}>
        <Switch>
          <Route exact path='/'>
            {
              (checkedRemember & loggedIn)?
                <ResponsiveDrawer path={'/'} onLogout={onLogout}>
                  <Home userData={userData} openAlert={openAlert} BASE_URL={BASE_URL}/>
                </ResponsiveDrawer>
              :
                <LoginScreen 
                  setLogin={setLogin} 
                  openAlert={openAlert} 
                  setUserData={setUserData}
                  BASE_URL={BASE_URL}
                />
            }
          </Route>
          <Route exact path='/analyze'>
            {
              (checkedRemember & loggedIn)?
              <ResponsiveDrawer path='/analyze' onLogout={onLogout}>
                <Analyze userData={userData} BASE_URL={BASE_URL}/>
              </ResponsiveDrawer>
              :
                <LoginScreen 
                  setLogin={setLogin} 
                  openAlert={openAlert} 
                  setUserData={setUserData}
                  BASE_URL={BASE_URL}
                />
            }
          </Route>
          <Route exact path='/history'>
            {
              (checkedRemember & loggedIn)?
              <ResponsiveDrawer path='/history' onLogout={onLogout}>
                <History userData={userData} openAlert={openAlert} BASE_URL={BASE_URL}/>
              </ResponsiveDrawer>
              :
                <LoginScreen 
                  setLogin={setLogin} 
                  openAlert={openAlert} 
                  setUserData={setUserData}
                  BASE_URL={BASE_URL}
                />
            }
          </Route>
        </Switch>
      </Router>
      <Snackbar 
        open={open} 
        autoHideDuration={3500} 
        onClose={alertClose}
        TransitionComponent={GrowTransition}
        key={GrowTransition.name}
        className={classes.snackbar}
      >
        <Alert onClose={alertClose} severity={alertSeverity}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </div>
    
  );
}

export default App;
