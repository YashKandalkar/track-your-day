import React, { useState, useEffect } from "react";
import { makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Chart } from 'react-charts'

const formatDate = date => {
    let d = date.toDateString().slice(0, -4);
    return `${d.slice(0,3)},${d.slice(3)}`
}

const useStyles = makeStyles((theme) => ({
    root: {
        color: '#eee',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
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
    chartContainer: {
        marginTop: '3rem',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    chart: {
        width: '100%',
        height: '60vmin'
    },
    info: {
        marginTop: '3rem',
    },
    list: {
        fontSize: '1rem',
        '&>li': {
            marginTop: '0.5rem'
        }
    }
}));

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const Analyze = ({ userData, openAlert, BASE_URL }) => {
    const classes = useStyles();
    const [mounted, setMounted] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [data, setData] = useState({});

    const chartData = React.useMemo(() => [
            {
                label: 'Abandoned',
                data: data.abandoned
            },
            {
                label: 'Completed',
                data: data.completed
            }
        ], [data]
    )
    
    const axes = React.useMemo(() => [
            { primary: true, type: 'ordinal', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ], []
    )


    useEffect(() => {
        if(!mounted){
            fetch(`${BASE_URL}/getHistory`, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: userData.id,
                    orderAsc: true
                })
            })
            .then(response => {
                if(response.status === 200){
                    return response.json();
                } else if(response.status === 404){
                    setDataLoaded(true);
                } else {
                    console.log("something went wrong!");
                }
            })
            .then(data => {
                if(data !== undefined){
                    const newSortedTasks = {};
                    const aban = {}
                    const comp = {}
                    const newChartData ={
                        abandoned: [],
                        completed: []
                    }
                    data.forEach(el => {
                        const niceDate = formatDate(new Date(el.created))
                        
                        if(newSortedTasks[niceDate]){
                            newSortedTasks[niceDate].push(el);
                        } else {
                            newSortedTasks[niceDate] = [el, ];
                        }
                    });
                    Object.keys(newSortedTasks).forEach(el => {
                        newSortedTasks[el].forEach(task => {
                            if(task.status === 'completed'){
                                if(comp[el]){
                                    comp[el]++;
                                } else {
                                    comp[el] = 1;
                                    aban[el] = 0;
                                }
                            } else if(task.status === 'abandoned'){
                                
                                if(aban[el] !== undefined){
                                    aban[el] += 1;
                                } else {
                                    aban[el] = 1;
                                    comp[el] = 0;
                                }
                            }
                        })
                    })
                    Object.keys(aban).forEach(el => {
                        newChartData.abandoned.push([el, aban[el]]);
                        newChartData.completed.push([el, comp[el]]);
                    })

                    setData(newChartData);
                    setDataLoaded(true);
                } 
            })
            .catch((err) => console.log("error", err))
            
            setMounted(true);
        }
    }, [mounted, setMounted, userData, BASE_URL]);
    
     
    return (
        <div className={classes.root}>
            <Container 
                className={classes.container}
                maxWidth={"sm"}
            >
                <ThemeProvider theme={theme}>
                    <Typography variant="h3">
                        <code>
                            {`Analyze`}
                        </code>
                    </Typography>
                </ThemeProvider>
            </Container>
            <Container className={classes.info}>
                {/* <Typography variant={"body1"}> */}
                <ul className={classes.list}>
                    <li>{"Your completed graph should increase \
                    while the abandoned graph should decrease."}</li>
                    <li>{"This graph can show data of maximum 7 days."}</li>
                    <li>{"If you delete a task from history, it will not be visible here!"}</li>
                </ul>
                {/* </Typography> */}
            </Container>
            <Container 
                maxWidth={"sm"}
                className={classes.chartContainer}
            >
                {
                    dataLoaded?
                        (data.abandoned === undefined)? 
                            "You don't have enough tasks to make a graph!"
                            :
                                <div className={classes.chart}>
                                    <Chart data={chartData} axes={axes} tooltip dark/>
                                </div>
                    :
                        <CircularProgress />
                }
                
            </Container>
        </div>
    )
}

export default Analyze;