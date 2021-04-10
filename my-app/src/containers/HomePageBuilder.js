//This is where i create the home screen
import Navigation from "../components/navigation";
import React from 'react';
import { Grid, SvgIcon, Paper, makeStyles} from '@material-ui/core';

import {ReactComponent as Topology_Img} from '../assets/Images/Topologies_Redirect_All.svg';
import {ReactComponent as Switching_Img} from '../assets/Images/Switching_Redirect_All.svg';
import {ReactComponent as Interactive_Img} from '../assets/Images/Interactive_Redirect.svg';
import {ReactComponent as Routing_Img} from '../assets/Images/Routing_Redirect_All.svg';


const useStyles = makeStyles((theme) => ({
    gridTop:{
        maxWidth: '50%',
        maxHeight:'50%',
        flexGrow:1,
        flexBasis:'50%',
        
    },
    gridBotton:{
        maxWidth: '33%',
        flexGrow:1,
        flexBasis:'50%',
        
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      background: '#707070',
    },
    paper_btn: {
        padding: theme.spacing(2),
        textAlign: 'center',
        background: '#707070',
        "&:hover": {
              background: "#AFF2AF"
            },
      },
    svg_img:{
        width:'100%',
        height: '200px'
    },
  }));

function FormRow1(){
    const classes = useStyles();
   return ( 
   <React.Fragment >
            <Grid item className={classes.gridTop} style={{padding: '10px'}}>
                <Paper className={classes.paper} >
                    <h1>Website Name</h1>
                    <p>This is an online revision tool which i am creating as my third year project, it is supposed to be used to educate students on topics such as
                    network topologies and switching methods. It also has an interactve tool allowinng students to create their own network topologies and perform 
                    switching methods on it.Please click one of the three links to head to their corresponding areas:
                    </p> 
                    <ul>
                        <li><b>Interactive Tool</b> - This allows you to create your own topology and perform different switching / routing methods on it.</li>
                        <li><b>Switching Methods</b> - This has information on switching methods desribing how they are performed and their properties.</li>
                        <li><b>Routing Methods</b> - This has information on routing methods desribinghow they are performed and their properties.</li>
                        <li><b>Topologies Revision</b> - Here you are able to view common topology designs and see their advantages and disadvantages.</li>
                    </ul>
                    
                </Paper>
            </Grid>

            <Grid item className={classes.gridTop} style={{padding: '10px'}}>
                
                <Paper className={classes.paper_btn} onClick={event => window.location.href="/Diss/#/interactive"}>
                    <Interactive_Img className={classes.svg_img} />
                    <h1>Interactive Tool</h1>
                </Paper>
            </Grid>
      </React.Fragment>
   );
}
function FormRow2(){
    const classes = useStyles();
   return ( 
   <React.Fragment>
            <Grid item xs={4} className={classes.gridBotton} >
               <Paper className={classes.paper_btn} onClick={event => window.location.href="/Diss/#/switching"}>
                    <Switching_Img className={classes.svg_img}/>
                    <h1>Switching Revision</h1>
                </Paper> 
            </Grid>
            <Grid item xs={4} className={classes.gridBotton} >
               <Paper className={classes.paper_btn} onClick={event => window.location.href="/Diss/#/routing"}>
                    <Routing_Img className={classes.svg_img}/>
                    <h1>Routing Revision</h1>
                </Paper> 
            </Grid>
            <Grid item xs={4} className={classes.gridBotton} >
                <Paper className={classes.paper_btn} onClick={event => window.location.href="/Diss/#/topologies"}>
                    <Topology_Img className={classes.svg_img}/>
                    <h1>Topologies Revision</h1>
                </Paper>
            </Grid>
      </React.Fragment>
   );
}  


function HomePageBuilder() {
    const classes = useStyles();
    console.log(process.env.PUBLIC_URL)
    return(
        <div>
        <Navigation />
        <Grid container spacing={1} id="outer" >
            <Grid container item spacing={3} style={{padding: '10px'}}>
                <FormRow1 />
            </Grid>
            <Grid container item spacing={3} style={{padding: '10px'}}>
                <FormRow2 />
            </Grid>
        </Grid>
    </div>
    );
}



export default HomePageBuilder;