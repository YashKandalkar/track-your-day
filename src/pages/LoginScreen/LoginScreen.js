import React, { useState } from 'react';
import Login from "../../components/Login/Login";
import Register from "../../components/Register/Register";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Toolbar } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    main: {
        background: '#121212',
        height: '100vh'
    },
    topbar: {
        background: theme.palette.primary.main,
        color: '#eee',
    },
    title: {
        fontSize: '2rem',
        color: '#eee',
        marginLeft: '1rem'
    }
}));

const LoginScreen = ({ setLogin, openAlert, setUserData, BASE_URL }) => {
    const [view, setView] = useState('login');
    const classes = useStyles();

    const onRegisterClick = () => {
        setView('register');
    }

    const onLoginClick = () => {
        setView('login');
    }

    return (
        <div className={classes.main}>
            <Toolbar className={classes.topbar}>
                <Typography variant="h6">Track Your Day</Typography>
            </Toolbar> 
            {
                (view === 'login')?
                    <Login 
                        onRegisterClick={onRegisterClick} 
                        setLogin={setLogin}
                        openAlert={openAlert}
                        setUserData={setUserData}
                        BASE_URL={BASE_URL}
                    />
                    :
                    <Register 
                        onLoginClick={onLoginClick} 
                        setLogin={setLogin}
                        openAlert={openAlert}
                        setUserData={setUserData}
                        BASE_URL={BASE_URL}
                    />
            }
        </div>
    )
}


export default LoginScreen;