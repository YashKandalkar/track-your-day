import React, { useState, useEffect } from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';
import MuiDialog from '../MuiDialog/MuiDialog';


import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import Tooltip from '@material-ui/core/Tooltip';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '@material-ui/core/IconButton';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > :hover': {
            boxShadow:  '0px 1px 5px 0 rgba(0,0,0,0.6), 0 1px 5px 1px rgba(0,0,0,0.302)',
            '& ::-webkit-scrollbar': {
                display: 'initial !important'
            },
        },
        margin: theme.spacing(1),
        '&  ::-webkit-scrollbar': {
            display: 'none !important'
        },
        boxSizing: 'border-box !important'
    },
    selectButton: {
        position: 'absolute',
        top: theme.spacing(-2.59),
        left: theme.spacing(-2.5),
        color: '#eee',
        boxShadow: 'none !important'
    },
    card: {
        color: '#e8eaed',
        borderColor: '#5f6368',
        outline: props => props.isSelected?'3px solid rgb(220, 220, 220)':'0px solid #000',
        borderRadius: props => props.isSelected?'0':'3px',
        transition: 'outline 0.1s ease-out',
        fontWeight: 400,
        boxSizing: 'border-box !important',
        userSelect: 'none'
    },
    cardIcon: {
        color: 'rgba(220,220,220,0.57)'
    },
    menu: {
        '& > .MuiPopover-paper' : {
            backgroundColor: '#202124',
            color: '#eee',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.6), 0 2px 6px 2px rgba(0,0,0,0.302)',
            '& > ul': {
                padding: '4px 0'
            }
        }
    },  
    title: {
        paddingBottom: 0,
        '& .MuiCardHeader-subheader': {
            color: 'rgba(220,220,220,0.57)'
        }
    },
    body: {
        fontSize: '0.975rem',
        whiteSpace: 'pre-line',
        maxHeight: '200px',
        overflowY: 'scroll',
    },
    deletebutton: {
        marginLeft: 'auto',
    },
    popover: {
        background: '#121212',
        borderRadius: 5,
        padding: theme.spacing(2),
        width: 200,
        border: '1px solid #484848'
    },
    colorItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '100%',
        width: 28,
        height: 28,
        margin: theme.spacing(1),
        transition: 'border 0.1s ease-in-out',
        '&:hover': {
            border: '2px solid transparent',
            borderColor: 'rgba(255,255,255,0.87)!important'
        }
    }
}));

const formatDate = date => {
    let d = date.toDateString().slice(0, -4);
    return `${d.slice(0,3)},${d.slice(3)}`
}

const Task = ({ 
    title, 
    body, 
    color, 
    id, 
    created,
    edited,
    deleteTask,
    setEdit,
    setPrevData,
    handleBackdropToggle,
    editTask,
    onSelectClick,
    isSelected,
    selectedCount,
    markComplete
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setDialogOpen] = useState(false);
    const [showSelect, setShowSelect] = useState(false);
    const [selected, setSelected] = useState(false);
    const [mounted, setMount] = useState(false);
    const [hold, setHold] = useState({isHolding: false, date: null, timer: null}); 

    const classes = useStyles({isSelected});


    useEffect(() => {
        if(!mounted){
            if(isSelected){
                setSelected(true);
                if(!showSelect)
                    setShowSelect(true);
            }
            setMount(true);
        }
    }, [mounted, setMount, isSelected, setSelected, showSelect, setShowSelect])

    const selectOpen = () => {
        if(!showSelect)
            setShowSelect(true);
    }

    const selectClose = () => {
        if(showSelect && !isSelected)
            setShowSelect(false);
    }

    const toggleSelected = () => {
        setSelected(!selected);
        if(!selected){
            onSelectClick(id, true)
        } else {
            onSelectClick(id, false)
        }
    }

    const handleDialogOpen = (event) => {
        event.stopPropagation();
        setDialogOpen(true);
        handleMenuClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const onDeleteClick = (event) => {
        event.stopPropagation();
        handleDialogClose();
        deleteTask([id, ]);
    }

    const onEditClick = (event) => {
        event.stopPropagation();
        setEdit(true);
        setAnchorEl(null);
        handleBackdropToggle()
        setPrevData({title, body, task_id: id, color, edited});
        handleDialogClose();
        
    }

    const onColorClick = (colorCode) => {
        editTask(id, undefined, undefined, undefined, colorCode, true);
    }

    const onHold = () => {
        toggleSelected();
    }

    const onMouseDown = () => {
        let timer = setTimeout(onHold, 600);
        setHold({isHolding: true, date: new Date(), timer});
    }

    const onMouseUp = () => {
        if((new Date() - hold.date) < 600){
            clearTimeout(hold.timer);
        }
        setHold({isHolding: false, date: null, timer: null});
    }

    const onCardClick = (event) => {
        event.stopPropagation();
        if(selectedCount > 0){
            toggleSelected();
        }
    }

    const onCompleteClick = (event) => {
        event.stopPropagation();
        markComplete(id);
    }

    return (
        <>
            <div 
                className={`${classes.root} grid-item`}
                onMouseEnter={selectOpen}
                onMouseLeave={selectClose}
            >
                
                {
                    showSelect?
                        <Tooltip title={"Select"} arrow>
                            <IconButton 
                                aria-label="select task" 
                                className={classes.selectButton}
                                disableRipple
                                onClick={toggleSelected}
                            >
                                <CheckCircleIcon/>
                            </IconButton>
                        </Tooltip>
                    :''
                }
                <Card 
                    className={`${classes.card} waves-effect waves-light`} 
                    variant={"outlined"} 
                    style={{background: color}}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onTouchStart={onMouseDown}
                    onTouchEnd={onMouseUp}
                    onTouchCancel={onMouseUp}
                    onClick={onCardClick}
                >
                    <CardHeader 
                        title={title}
                        className={classes.title}
                        action={
                            <Tooltip title={"Menu"} arrow>
                                <IconButton aria-label="settings" onClick={handleMenuClick}>
                                    <MoreVertIcon className={classes.cardIcon}/>
                                </IconButton>
                            </Tooltip>
                        }
                        subheader={formatDate(new Date(created))}
                    />
                    <Menu
                        id="actions-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        className={classes.menu}
                    >
                        <MenuItem onClick={onEditClick}>Edit</MenuItem>
                        <MenuItem onClick={handleDialogOpen}>Delete</MenuItem>
                    </Menu>
                    <CardContent>
                        <Typography variant="body2" component="p" className={classes.body}>
                            {body}
                        </Typography>
                    </CardContent>
                    <CardActions>
                            <ColorPicker 
                                onColorClick={onColorClick} 
                                currColor={color}
                            />
                        <Tooltip title="Mark complete" arrow>
                            <IconButton
                                aria-label="complete" 
                                style={{marginLeft: 'auto'}}
                                onClick={onCompleteClick}
                            >
                                <CheckCircleIcon className={classes.cardIcon}/>
                            </IconButton>
                        </Tooltip>
                    </CardActions>
                </Card>
            </div>
            <MuiDialog
                open={open}
                title="Delete task?"
                content="This action cannot be undone!"
                handleDialogClose={handleDialogClose}
                btn1="Cancel"
                btn2="Delete"
                onMainButtonClick={onDeleteClick}
            />
        </>
    )
}


export default Task;