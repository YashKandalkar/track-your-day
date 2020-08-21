import React, { useState, useEffect } from "react";
import OldTask from '../../components/OldTask/OldTask'

import { makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Popover from '@material-ui/core/Popover';
import CircularProgress from '@material-ui/core/CircularProgress';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import StopIcon from '@material-ui/icons/Stop';

const useStyles = makeStyles((theme) => ({
    root: {
        color: '#eee',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    container: {
        display: 'flex',
        position: 'relative',
        background: '#202124',
        color: '#eee',
        textAlign: 'center',
        height: '20vh',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tasksNotice: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 'auto',
        marginBottom: '2rem'
    },
    accordionContainer: {
        marginTop: '2rem'
    },
    accordion: {
        '&.MuiAccordion-root': {
            backgroundColor: '#202124',
            color: '#e8eaed',
        },
        '&>.MuiCollapse-container': {
            minHeight: 0
        }
    },
    accordionSummary: {
        minHeight: 0,
    },
    taskContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: theme.spacing(1),
        gridGap: theme.spacing(1),
    },
    whiteIcon: {
        color: 'rgba(220,220,220,0.57)'
    },
    helpIcon: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1)
    },
    popover: {
        pointerEvents: 'none',
        alignContent: 'center',
        display: 'flex'
    },
    paper: {
        padding: theme.spacing(1),
        
    },
    abandonedColor: {
        color: 'rgb(60, 63, 67)'
    },
    completedColor: {
        color: 'rgb(30, 58, 95)'
    }
}));

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const MuiAccordion = ({ 
    id, 
    title, 
    children,
    classes,
    handleChange,
    expanded,
}) => {
    return (
        <Accordion 
            className={classes.accordion}
            onChange={handleChange(id)}
            expanded={expanded === id}
            square
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon className={classes.whiteIcon}/>}
                aria-controls={`panel${id}-content`}
                id={id}
                className={classes.accordionSummary}
            >
                <Typography className={classes.heading}>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.taskContainer}>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

const formatDate = date => {
    let d = date.toDateString().slice(0, -4);
    return `${d.slice(0,3)},${d.slice(3)}`
}

const History = ({ userData, openAlert, BASE_URL }) => {
    const classes = useStyles();
    const [mounted, setMounted] = useState(false);
    const [sortedTasks, setSortedTasks] = useState({});
    const [expanded, setExpanded] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loaded, setLoaded] = useState(false);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if(!mounted){
            fetch(`${BASE_URL}/getHistory`, {
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
                    setLoaded(true);
                } else {
                    console.log("something went wrong!");
                }
            })
            .then(data => {
                if(data !== undefined){
                    const newSortedTasks = {};
                    data.forEach(el => {
                        const niceDate = formatDate(new Date(el.created))
                        
                        if(newSortedTasks[niceDate]){
                            newSortedTasks[niceDate].push(el);
                        } else {
                            newSortedTasks[niceDate] = [el, ];
                        }
                    });
                    setLoaded(true);
                    setSortedTasks(newSortedTasks);
                }
            })
            .catch((err) => console.log("error", err))

            setMounted(true);
        }
    }, [mounted, setMounted, setSortedTasks, userData, BASE_URL]);
    
    const handleChange = (id) => (event, isExpanded) => {
        setExpanded(isExpanded?id:false);
    }

    const deleteTask = (task_ids, accordionTitle) => {
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
        .then(() => {
            const newSortedArr = {...sortedTasks};
            newSortedArr[accordionTitle] = newSortedArr[accordionTitle].filter(el => el.task_id !== task_ids[0])
            if(newSortedArr[accordionTitle].length === 0){
                delete newSortedArr[accordionTitle];
            }
            console.log(newSortedArr)
            setSortedTasks(newSortedArr);
        })
        .catch(err => {
            console.error(err);
            openAlert("Something went wrong!", "error");
        })
    }

    return (
        <div className={classes.root}>
            <Container 
                className={classes.container}
                maxWidth={"sm"}
            >
                <HelpOutlineIcon 
                    className={classes.helpIcon}
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                />
                <Popover
                    id="mouse-over-popover"
                    className={classes.popover}
                    classes={{
                        paper: classes.paper,
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <div>
                        <div>
                            <StopIcon className={classes.abandonedColor} />Abandoned
                        </div>
                        <div>
                            <StopIcon className={classes.completedColor} />Completed
                        </div>
                    </div>
                </Popover>
                <ThemeProvider theme={theme}>
                    <Typography variant="h3">
                        <code>
                            {`History`}
                        </code>
                    </Typography>
                </ThemeProvider>
            </Container>
            
            <Container className={classes.accordionContainer}>
                {
                    Object.keys(sortedTasks).length?

                        Object.keys(sortedTasks).map((el, i) => {
                            return (
                                <MuiAccordion 
                                    id={i} 
                                    key={i}
                                    title={el}
                                    classes={classes}
                                    expanded={expanded}
                                    handleChange={handleChange}
                                >
                                    {
                                        sortedTasks[el].map((task, ind) => {
                                            return (
                                                <OldTask 
                                                    key={ind}
                                                    taskId={task.task_id}
                                                    title={task.title}
                                                    body={task.body}
                                                    status={task.status}
                                                    deleteTask={deleteTask}
                                                    accordionTitle={el}
                                                />
                                            )
                                        })
                                    }
                                </MuiAccordion>
                            )
                        })
                    :
                        <div style={{textAlign: 'center'}}>
                            {
                                loaded? 
                                    "History is empty!"
                                :
                                    <CircularProgress />
                            }
                            
                        </div>
                }
            </Container>
            <Container 
                className={classes.tasksNotice}
            >
                <ThemeProvider theme={theme}>
                    <Typography variant="caption" >
                        {"Tasks older than 7 days are deleted!"}
                    </Typography>
                </ThemeProvider>
            </Container>
        </div>
    )
}

export default History;