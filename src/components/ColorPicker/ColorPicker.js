import React, { useState } from 'react';
import taskColors from '../../utils/taskColors';

import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ColorLensOutlinedIcon from '@material-ui/icons/ColorLensOutlined';
import CheckIcon from '@material-ui/icons/Check';


const useStyles = makeStyles((theme) => ({
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
}))

const ColorPicker = ({
    onColorClick,
    iconColor,
    currColor,
    style
}) => {
    const [popoverEl, setPopEl] = useState(null);
    const [colorTooltipOpen, setCTOpen] = useState(false);
    
    const classes = useStyles();
    
    const popOpen = Boolean(popoverEl);
    const popId = popOpen ? 'color-edit-popover' : undefined;

    //color tooltip
    const handleCTOpen = () => {
        setCTOpen(true);
    }

    const handleCTClose = () => {
        setCTOpen(false);
    }

    const handleColorClick = (event) => {
        setPopEl(event.currentTarget);
        event.stopPropagation();
        handleCTClose();
    };

    const handleColorClose = () => {
        setPopEl(null);
    };

    const onClick = (el) => {
        handleColorClose();
        onColorClick(el);
    }

    return (
        <>
            <Tooltip 
                title="Change color" 
                arrow 
                open={colorTooltipOpen}
                onOpen={handleCTOpen}
                onClose={handleCTClose}
            >
                <IconButton 
                    aria-label="change color"
                    onClick={handleColorClick}
                    style={{...style}}
                >
                    <ColorLensOutlinedIcon style={{color: iconColor||'rgba(220,220,220,0.57)'}}/>
                </IconButton>
            </Tooltip>
            <Popper
                id={popId}
                className={classes.popover}
                open={popOpen}
                anchorEl={popoverEl}
                onClose={handleColorClose}
                style={{zIndex: 9999}}
            >
                <ClickAwayListener onClickAway={handleColorClose}>
                    <Grid container spacing={3} justify="center">
                        {
                            taskColors.map((el, i) => {
                                return (
                                    <IconButton 
                                        style={{padding:0}}
                                        key={i}
                                        onClick={() => onClick(el)}
                                    >
                                        <Grid 
                                            item 
                                            className={classes.colorItem}
                                            style={{
                                                background: el,
                                                border: el==='#202124'?'2px solid #5f6368':''
                                            }}
                                        >
                                            {
                                                (Boolean(currColor))?
                                                    (el===currColor)?
                                                        <CheckIcon style={{color: '#9aa0a6'}}/>
                                                    :''
                                                :''
                                            }
                                        </Grid>
                                    </IconButton>
                                )
                            })
                        }
                    </Grid>
                </ClickAwayListener>
            </Popper>
        </>
    )
}


export default ColorPicker;