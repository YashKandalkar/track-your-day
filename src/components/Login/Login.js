import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import Checkbox from '@material-ui/core/Checkbox';

//eslint-disable-next-line
const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const useStyles = makeStyles((theme) => ({
  container: {
    height: '90%',
    display: 'flex',
    alignItems: 'center'
  },
  box: {
    padding: theme.spacing(3),
    paddingTop: 0,
    borderRadius: 3,
    minHeight: '55%',
    justifyContent: "center",
    alignContent: 'space-around'
  },
  title: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  button: {
    padding: theme.spacing(2),
    paddingBottom: 0
  },
  rememberMe: {
      marginBottom: '-0.735rem',
      textAlign: 'center'
  }
}));

const Login = ({ onRegisterClick, setLogin, openAlert, setUserData, BASE_URL }) => {
    const classes = useStyles();
    const [emailRef, passwordRef] = [useRef(), useRef()];
    const [emailHelperText, setEmailHelperText] = useState("");
    const [passHelperText, setPassHelperText] = useState("");
    const [remember, setRemember] = useState(true);
    
    const onLoginClick = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if(email === ""){
            setEmailHelperText("Email cannot be empty!");
        } 
        else if(!email.match(emailformat)){
            setEmailHelperText("Please provide a valid email address!");
        }
        else if(password === ""){
            setPassHelperText("Password cannot be empty!");
        }
        else if(password.length < 8){
            setPassHelperText("Password should atleast be 8 characters long!")
        }
        else{
            fetch(`${BASE_URL}/loginUser`, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email,
                    password
                }) 
            })
            .then(response => {
                if(response.status === 200){
                    return response.json();
                } else {
                    console.log("something went wrong!");
                }
            })
            .then(data => {
                if(data){
                    setUserData({...data});
                    setLogin(true);
                    openAlert("Logged in successfully!", "success");
                    if(remember){
                        localStorage.setItem('remember', 'true');
                        localStorage.setItem('name', data.name);
                        localStorage.setItem('id', `${data.id}`);
                        localStorage.setItem('joined', data.joined);
                    } else {
                        localStorage.setItem('remember', 'false');
                    }
                }
                else{
                    openAlert("Invalid email or password!", "error");
                }
            })
            .catch((err)=>{
                console.log(err)
                openAlert("Something went wrong!", "error");
            });
        }
    }

    const onEmailChange = () => {
        if(emailRef.current.value){
            setEmailHelperText("")
        }
    }

    const onPasswordChange = () => {
        if(passwordRef.current.value){
            setPassHelperText("")
        }
    }

    const onKeyDown = (event) => {
        const key = event.which || event.keyCode;
        if(key === 13){
            onLoginClick();
        }
    }

    //keep signed in checkbox
    const handleChange = (event) => {
        setRemember(event.target.checked);
    }

    return (
        <Container className={classes.container} maxWidth="xs">
            <Grid container className={classes.box} style={{background: '#eee'}}>
                <Typography
                    className={classes.title}
                    color="secondary" 
                    style={{fontSize: '2.5rem', textAlign: 'center'}}
                >
                        Sign In
                </Typography>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth
                                required
                                label="Email" 
                                name="email" 
                                size="small" 
                                variant="outlined"
                                inputRef={emailRef}
                                helperText={emailHelperText}
                                error={emailHelperText?true:false}
                                onChange={onEmailChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Password"
                                name="password"
                                size="small"
                                type="password"
                                variant="outlined"
                                inputRef={passwordRef}
                                helperText={passHelperText}
                                error={passHelperText?true:false}
                                onChange={onPasswordChange}
                                onKeyDown={onKeyDown}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.rememberMe}>
                    Keep me signed in 
                    <Checkbox 
                        onChange={handleChange}
                        defaultChecked
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Grid item className={classes.button}>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                onClick={onRegisterClick}
                            >
                                Register
                            </Button>
                        </Grid>
                        <Grid item className={classes.button}>
                            <Button 
                                color="secondary"  
                                type="submit" 
                                variant="contained"
                                onClick={onLoginClick}
                            >
                                Log in
                            </Button>
                        </Grid>  
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};



export default Login;