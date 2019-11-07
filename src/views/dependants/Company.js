import React, { useEffect, useContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import { Grid, Typography, makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles(({
    card:{
        padding:'20px',
        width:'inherit'
    },
    container: {
        padding: '3vw'
    }
}))
const Company = () => {
    const classes = useStyles();

    return (
        <Grid container className={classes.container} spacing={6}>
            <Grid container item xs={12} spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4">Company</Typography>
                </Grid>
                <Grid item container spacing={1}>
                    <Grid item xs={6} sm={4} lg={2}>
                        <Paper className={classes.card}>
                            <Typography variant='body2' gutterBottom>Company</Typography>
                            <Typography variant='h6' gutterBottom>Company Name</Typography>
                            <Typography variant='caption' display="block">Owner: </Typography>
                            <Typography variant='caption' display="block" gutterBottom>Member Number: </Typography>
                        </Paper>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    );
};
export default withRouter(Company);
