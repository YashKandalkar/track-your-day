import React, { useState } from "react";

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '@material-ui/core/IconButton';

import MoreVertIcon from '@material-ui/icons/MoreVert';


const useStyles = makeStyles((theme) => ({
    card: {
        color: '#e8eaed',
        borderColor: '#5f6368',
        backgroundColor: props => props.status==='completed'?'rgb(30, 58, 95)':'rgb(60, 63, 67)',
        borderRadius: '3px',
        transition: 'outline 0.1s ease-out',
        fontWeight: 400,
        boxSizing: 'border-box !important',
        userSelect: 'none',
    },
    whiteIcon: {
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
}));

const OldTask = ({
    taskId,
    title,
    body,
    status,
    deleteTask,
    accordionTitle
}) => {
    const classes = useStyles({status});
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const onDeleteClick = (event) => {
        event.stopPropagation();
        handleMenuClose();
        deleteTask([taskId, ], accordionTitle);
    }


    return (
        <Card 
            className={classes.card}
            variant={"outlined"}
            
        >
            <CardHeader 
                title={title}
                action={
                    <Tooltip title={"Menu"} arrow>
                        <IconButton aria-label="settings" onClick={handleMenuClick}>
                            <MoreVertIcon className={classes.whiteIcon}/>
                        </IconButton>
                    </Tooltip>
                }
            />
            <Menu
                id="actions-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                className={classes.menu}
            >
                <MenuItem onClick={onDeleteClick}>Delete from history</MenuItem>
            </Menu>
            <CardContent>
                <Typography variant="body2" component="p">
                    {body}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default OldTask;