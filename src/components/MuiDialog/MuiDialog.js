import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';


const MuiDialog = ({
    open,
    title,
    content,
    btn1,
    btn2,
    handleDialogClose,
    onMainButtonClick
}) => {

    return (
        <span>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                            {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="default">
                        {btn1}
                    </Button>
                    <Button onClick={onMainButtonClick} color="primary" autoFocus>
                        {btn2}
                    </Button>
                </DialogActions>
            </Dialog>
        </span>
    )
}


export default MuiDialog;