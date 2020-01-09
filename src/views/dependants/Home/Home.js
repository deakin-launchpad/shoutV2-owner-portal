import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({
  container: {
    padding: '3vw'
  }
}));
export const Home = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container} spacing={6}>
      <Grid container item xs={12} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Overview</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
