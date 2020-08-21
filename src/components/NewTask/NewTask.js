import React, { useRef, useState, useEffect } from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';

import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import InputBase from '@material-ui/core/InputBase';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';

import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
    card: {
        // textAlign: 'center','
        color: '#e8eaed',
        background: props => props.colorSelected||'#202124',
        borderRadius: '8px',
        borderColor: '#5f6368',
        minWidth: '50vw',
        boxShadow:  '0px 1px 5px 0 rgba(0,0,0,0.6), 0 1px 5px 1px rgba(0,0,0,0.302)',
        '& label.Mui-focused': {
            color: 'green',
        },
    },
    floatingLabelFocusStyle: {
        color: '#aaa !important'
    },
    cardIcon: {
        color: 'rgba(220,220,220,0.57)'
    },
    title: {
        paddingBottom: 0
    },
    titleInput: {
        fontSize: '1.375rem',
        color: props => props.titleError?'#ff3b2d':'#e8eaed',
    },
    body: {
        paddingBottom: theme.spacing(2),
        color: props => props.bodyError?'#ff3b2d':'#e8eaed',
        whiteSpace: 'pre-line',
        '& > textarea': {
            height: '30vh !important',
            overflowY: 'scroll !important',
            
        },
    },
    edited: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: theme.spacing(2),
        color: 'rgba(220,220,220,0.57)'
    },
    deletebutton: {
        marginLeft: 'auto',
    }
}));

const NewTask = ({ 
    handleBackdropToggle, 
    createTask,
    editTask,
    edit,
    setEdit,
    prevData,
    setPrevData
}) => {
    const [titleRef, bodyRef] = [useRef(), useRef()];
    const [titleError, setTitleError] = useState(false);
    const [bodyError, setBodyError] = useState(false);
    const [colorSelected, setColor] = useState('#202124');

    const classes = useStyles({colorSelected, titleError, bodyError});

    useEffect(() => {
        if(edit){
            setColor(prevData.color);
            titleRef.current.value = prevData.title;
            bodyRef.current.value = prevData.body;
        } else {
            titleRef.current.value = '';
            bodyRef.current.value = '';
        }
    }, [titleRef, bodyRef, edit, prevData]);

    const handleFinish = () => {
        if(!titleRef.current.value){
            setTitleError(true);
        } else if (!bodyRef.current.value){
            setBodyError(true);
        } else {
            handleBackdropToggle()
            if(!edit){
                createTask(titleRef.current.value, bodyRef.current.value, colorSelected);
            } else {
                editTask(prevData.task_id, titleRef.current.value, bodyRef.current.value, undefined, colorSelected, true);
            }
            titleRef.current.value = "";
            bodyRef.current.value = "";
        }
        
    }

    const onTitleChange = (e) => {
        if(titleRef.current.value){
            setTitleError(false);
        }
    }

    const onBodyChange = () => {
        if(bodyRef.current.value){
            setBodyError(false);
        }
    }

    const onClose = () => {
        handleBackdropToggle();
        setEdit(false);
        setPrevData({})
        titleRef.current.value = "";
        bodyRef.current.value = "";
    }

    const onColorClick = (color) => {
        setColor(color);
    }

    const getTime = (t) => {
        let date = new Date(t);
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});
    }
    
    const title = <InputBase
                    fullWidth
                    required
                    id="standard-basic-title" 
                    placeholder="Title" 
                    inputRef={titleRef}
                    error={titleError}
                    onChange={onTitleChange}
                    // inputProps={{style: {color: '#e8eaed'}}}
                    className={classes.titleInput}
                />

    const body = <InputBase
                    inputRef={bodyRef}
                    id="outlined-multiline-body"
                    placeholder="Body"
                    multiline
                    fullWidth
                    error={bodyError}
                    onChange={onBodyChange}
                    className={classes.body}
                />
                

    return (
        <Card className={classes.card} variant={"outlined"}>
            <CardHeader 
                title={title}
                className={classes.title}
                action={
                    <Tooltip title={"Cancel"} arrow>
                        <IconButton aria-label="settings" onClick={onClose}>
                            <CloseIcon className={classes.cardIcon} />
                        </IconButton>
                    </Tooltip>
                }
            />
            <CardContent className={classes.title}>
                {body}
            </CardContent>
        
            {
                edit?
                <span className={classes.edited}>{`Edited: ${getTime(prevData.edited)}`}
                </span>
                :''
            }
            
            <CardActions>
                <ColorPicker onColorClick={onColorClick} currColor={colorSelected}/>
                <Tooltip title={"Save"} arrow>
                    <IconButton aria-label="complete" style={{marginLeft: 'auto'}} onClick={handleFinish}>
                        <CheckCircleIcon className={classes.cardIcon}/>
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}

export default NewTask;