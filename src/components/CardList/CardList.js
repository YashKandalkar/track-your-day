import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Tooltip from '@material-ui/core/Tooltip';

import {Masonry} from 'masonic';

import Task from '../Task/Task';
import ColorPicker from '../ColorPicker/ColorPicker';
import MuiDialog from '../MuiDialog/MuiDialog';

import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import CloseIcon from '@material-ui/icons/Close';

import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    appBar: {
        top: theme.spacing(-8),
        "-moz-transition": "top 0.1s linear",
        "-webkit-transition": "top 0.1s linear",
        transition: "top 0.1s ease-in",
        background: '#202124',
        // height: theme.spacing(8)
    },
    toolbar: theme.mixins.toolbar,
    root: {
      background: '#202124',
      maxWidth: '100vw'
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    container: {
        background: '#202124',
    },
    tasksTitle: {
        marginTop: '2rem',
        background: theme.palette.primary.dark,
        width: '100%',
        display: 'flex',
        maxHeight: '9vh',
        alignItems: 'center',
        padding: theme.spacing(2)
    },
    noTasksNotice: {
        background: '#202124',
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
        minHeight: '250px',
        display: 'flex',
        justifyContent: 'center'
    }
}));

const MasonryComponent = props => (
    <Masonry
        key={Object.keys(props.taskArray).length}
        items={Object.values(props.taskArray).reverse()} 
        columnGutter={8}
        {...props}
        columnWidth={240}
        render={({data: el}) => {
            return (<Task 
                key={el.task_id}
                title={el.title}
                body={el.body}
                created={el.created}
                edited={el.last_edited}
                id={el.task_id}
                color={el.color}
                deleteTask={props.deleteTask}
                setEdit={props.setEdit}
                setPrevData={props.setPrevData}
                handleBackdropToggle={props.handleBackdropToggle}
                editTask={props.editTask}
                onSelectClick={props.onSelectClick}
                isSelected={Boolean(props.selectedTasks[el.task_id])}
                selectedCount={props.selectedCount}
                markComplete={props.markComplete}
            />)
        }}
        role="task container"
        tabIndex="none"
    />
)

const CardList = ({
    showLoading,
    taskArray,
    deleteTask,
    setEdit,
    setPrevData,
    handleBackdropToggle,
    editTask,
    updateMultiple,
    markComplete
}) => {
    const classes = useStyles();
    const [selectedTasks, setSelected] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [open, setDialogOpen] = useState(false);
    const [appBarOpen, setAppBar] = useState(false);


    const showAppBar = () => {
        setAppBar(true);
    }

    const hideAppBar = () => {
        setAppBar(false);
    }

    const onSelectClick = (task_id, val) => {
        if(val){
            setSelected({...selectedTasks, [task_id]: task_id});
            if(Object.keys(selectedTasks).length === 0){
                showAppBar();
                if(Object.keys(taskArray).length === 1){
                    setSelectAll(true);
                }
            } 
            
            else if(Object.keys(selectedTasks).length+1 === Object.keys(taskArray).length) {
                setSelectAll(true);
            }
        }
        else {
            let newArr = {...selectedTasks}
            delete newArr[task_id];
            setSelected(newArr);
            if(Object.keys(selectedTasks).length === 1){
                hideAppBar();
                setSelectAll(false);
            } 

            else if(Object.keys(selectedTasks).length <= Object.keys(taskArray).length){
                setSelectAll(false);
            }
            
        }

    }

    const onSelectAll = () => {
        if(selectAll){
            setSelected({});
            hideAppBar();
        } else {
            let newObj = {};
            Object.keys(taskArray).forEach(el => {
                newObj[el] = el;
            });
            setSelected(newObj);
        }
        setSelectAll(!selectAll);
    }

    const onColorClick = (color) => {
        updateMultiple(Object.keys(selectedTasks), {color});
    }

    const onDeleteClick = () => {
        setDialogOpen(true);
    }

    const onCloseClick = () => {
        setSelectAll(false);
        setSelected({});
        hideAppBar();
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
    }

    const deleteTasks = () => {
        setDialogOpen(false);
        deleteTask(Object.keys(selectedTasks));
        setSelected({});
        hideAppBar();
    }

    return (
        <div className={classes.container}>
            <AppBar className={classes.appBar} style={{top: appBarOpen?0:'-64px'}}>
                <Toolbar className={classes.toolbar}>
                    <Tooltip title={"Close"}>
                        <IconButton onClick={onCloseClick}>
                            <CloseIcon style={{color: '#eee'}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Select all"} arrow>
                        <IconButton onClick={onSelectAll}>
                            <SelectAllIcon style={{color: selectAll?'#8699ff':'#eee'}}/>
                        </IconButton>
                    </Tooltip>
                    <ColorPicker 
                        style={{marginLeft: 'auto'}} 
                        iconColor="#eee" 
                        onColorClick={onColorClick}
                    />
                    <Tooltip title={"Delete selected items"} arrow>
                        <IconButton onClick={onDeleteClick}>
                            <DeleteOutlineOutlinedIcon style={{color: '#eee'}}/>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            
            <Typography 
                className={classes.tasksTitle}
                variant={"h4"}
                gutterBottom
            >
                Active tasks
            </Typography>
            <Container className={classes.root}>
                {
                    (Object.keys(taskArray).length)?
                        <MasonryComponent 
                            taskArray={taskArray}
                            setEdit={setEdit}
                            deleteTask={deleteTask}
                            setPrevData={setPrevData}
                            handleBackdropToggle={handleBackdropToggle}
                            editTask={editTask}
                            onSelectClick={onSelectClick}
                            selectedTasks={selectedTasks}
                            selectedCount={Object.keys(selectedTasks).length}
                            markComplete={markComplete}
                        />
                    :
                        <Grid item className={classes.noTasksNotice}>
                            <Typography variant="caption">
                                {
                                    (showLoading)?
                                        <CircularProgress />
                                    :
                                    <>
                                        You don't have any active tasks for today!
                                        <br />
                                        Click the + button to add a task!
                                    </>
                                }
                            </Typography>
                        </Grid>
                }
            </Container>
            <MuiDialog
                open={open}
                title={`Delete ${Object.keys(selectedTasks).length} task(s)?`}
                content="This action cannot be undone!"
                handleDialogClose={handleDialogClose}
                btn1="Cancel"
                btn2="Delete"
                onMainButtonClick={deleteTasks}
            />
        </div>
    )
}


export default CardList;