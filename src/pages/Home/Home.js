import React, { useState, useEffect } from 'react';
import { makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Backdrop from '@material-ui/core/Backdrop';
import Tooltip from '@material-ui/core/Tooltip';

import CardList from "../../components/CardList/CardList";
import NewTask from '../../components/NewTask/NewTask';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';


let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const useStyles = makeStyles((theme) => ({
    root: {
        color: '#eee'
    },
    container: {
        display: 'flex',
        background: '#202124',
        color: '#eee',
        textAlign: 'center',
        height: '20vh',
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: '4px'
    },
    tasksNotice: {
        textAlign: 'center',
        marginTop: '2rem'
    },
    addTaskButton: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            bottom: theme.spacing(3),
            right: theme.spacing(3),
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const Home = ({ userData, openAlert, BASE_URL }) => {
    const classes = useStyles();
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [taskArray, setTaskArray] = useState({});
    const [taskNotice, setTaskNotice] = useState("You don't have any active tasks");
    const [taskCount, setTaskCount] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [showLoading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [prevData, setPrevData] = useState({});

    const handleBackdropToggle = () => {
        setBackdropOpen(!backdropOpen);
    };

    //load user's data
    useEffect(() => {
        if(!mounted){
            fetch(`${BASE_URL}/getTasks`, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: userData.id
                }) 
            })
            .then(response => {
                if(response.status === 200){
                    return response.json();
                } else if(response.status === 404){
                    //user has no tasks
                    setTaskNotice(`You don't have any active tasks!`);
                    setLoading(false);
                } else {
                    console.log("something went wrong!");
                }
            })
            .then(data => {
                if(data){
                    setTaskNotice(`You have ${data.length===0?'no':data.length} active ${data.length===1?'task':'tasks'}!`)
                    let tasks = {};
                    setTaskCount(data.length);
                    data.forEach((el) => {
                        tasks[el.task_id] = {...el};
                    });
                    setLoading(false);
                    setTaskArray(tasks);
                }
                else{
                    
                }
            })
            .catch((err)=>{
                console.log(err);
            });

            setMounted(true);
        }
    }, [mounted, userData.id, setTaskNotice, setTaskCount, setLoading, BASE_URL]);
    
    const createTask = (title, body, color='#202124') => {
        fetch(`${BASE_URL}/createTask`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: userData.id,
                title,
                body,
                color
            }) 
        })
        .then(response => {
            if(response.status === 200){
                return response.json();
            } else {
                openAlert("Something went wrong!", "error");
            }
        }) 
        .then(data => {
            if(data){
                const {task_id, created} = data;
                setEdit(false);
                handleBackdropToggle();
                let newArray = taskArray;
                newArray[task_id] = {
                    title, body, created, task_id, last_edited:created, color
                }
                setTaskArray(newArray);
                setTaskNotice(`You have ${taskCount+1} active ${taskCount+1===1?'task':'tasks'}!`);
                // openAlert("Created a new task successfully!", "success");
                setTaskCount(taskCount+1);
            }
            else{
                openAlert("Something went wrong!", "error");
            }
        })
        .catch(()=>{
            openAlert("Something went wrong!", "error");
        });
    }

    const editTask = (task_id, title, body, status, color, blockNotice) => {
        fetch(`${BASE_URL}/updateTask`, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                task_id,
                title,
                body,
                status,
                color
            }) 
        })
        .then(response => {
            if(response.status === 200){
                return response.json();
            } else {
                openAlert("Something went wrong!", "error");
            }
        })
        .then(data => {
            if(data){
                let newArray = {...taskArray};
                newArray[task_id] = {
                    ...data[0]
                }
                setTaskArray(newArray);
                setEdit(false);
                if(!blockNotice)
                    openAlert("Edited task successfully!", "success");
            }
            else{
                openAlert("Something went wrong!", "error");
            }
        })
        .catch(()=>{
            openAlert("Something went wrong!", "error");
        });
    }

    const deleteTask = (task_ids) => {
        fetch(`${BASE_URL}/deleteTasks`, {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                task_ids: task_ids
            }) 
        })
        .then(response => {
            if(response.status === 200){
                return response.json();
            } else {
                openAlert("Something went wrong!", "error");
            }
        })
        .then(data => {
            let newArray = {...taskArray};

            task_ids.forEach(el => {
                delete newArray[el];
            })
            
            setTaskArray(newArray);
            const newCount = taskCount-data;
            (taskCount-1 === 0)?
                setTaskNotice(`You don't have any active tasks!`)
            :    setTaskNotice(`You have ${newCount} active ${newCount===1?'task':'tasks'}!`)
            
            setTaskCount(newCount);
            openAlert(`Deleted ${data} task(s)`, "warning");
        })
        .catch(err => {
            console.error(err);
            openAlert("Something went wrong!", "error");
        })
    }

    const updateMultiple = (task_ids, newValues) => {
        fetch(`${BASE_URL}/updateMultiple`, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ task_ids, ...newValues }) 
        })
        .then(response => {
            if(response.status === 200){
                return response.json();
            } else {
                openAlert("Something went wrong!", "error");
            }
        })
        .then(data => {
            if(data.length){
                let newArray = {...taskArray};
                data.forEach(el => {
                    newArray[el.task_id] = el;
                });
                setTaskArray(newArray);
            }
            else{
                openAlert("Something went wrong!", "error");
            }
        })
        .catch(()=>{
            openAlert("Something went wrong!", "error");
        });
    }

    const markComplete = (task_id) => {
        fetch(`${BASE_URL}/markCompleted`, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ task_id }) 
        })
        .then(response => {
            if(response.status === 200){
                return response.json();
            } else {
                openAlert("Something went wrong!", "error");
            }
        })
        .then(data => {
            let newArray = {...taskArray};
            delete newArray[task_id];
            
            setTaskArray(newArray);
            const newCount = taskCount-1;
            (newCount === 0)?
                setTaskNotice(`You don't have any active tasks!`)
            :    setTaskNotice(`You have ${newCount} active ${newCount===1?'task':'tasks'}!`)
            openAlert("Marked as complete!", "success");
            setTaskCount(newCount);
        })
        .catch(()=>{
            openAlert("Something went wrong!", "error");
        });
    }

    return (
        <div className={classes.root}>
            <Container className={classes.container} maxWidth={"sm"}>
                <ThemeProvider theme={theme}>
                    <Typography variant="h3" >
                        <code>
                            {`Welcome, ${userData.name}!`}
                        </code>
                    </Typography>
                </ThemeProvider>
            </Container>
            <Container 
                className={classes.tasksNotice}
            >
                <ThemeProvider theme={theme}>
                    <Typography variant="h5" >
                        {taskNotice}
                    </Typography>
                </ThemeProvider>
            </Container>
            <CardList 
                showLoading={showLoading}
                taskArray={taskArray}
                handleBackdropToggle={handleBackdropToggle} 
                createTask={createTask} 
                editTask={editTask}
                setEdit={setEdit}
                deleteTask={deleteTask}
                setPrevData={setPrevData}
                updateMultiple={updateMultiple}
                markComplete={markComplete}
            />
            <Tooltip title="Create task" arrow>
                <Fab 
                    color="secondary" 
                    aria-label="add" 
                    className={classes.addTaskButton}
                    onClick={handleBackdropToggle}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
            
            <Backdrop 
                className={classes.backdrop} 
                open={backdropOpen}
            >
                <NewTask 
                    handleBackdropToggle={handleBackdropToggle} 
                    createTask={createTask} 
                    edit={edit}
                    editTask={editTask}
                    prevData={prevData}
                    setEdit={setEdit}
                    setPrevData={setPrevData}
                />
            </Backdrop>
            
        </div>
    )
}


export default Home;