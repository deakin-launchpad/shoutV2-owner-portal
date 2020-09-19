import React from 'react';
import { Grid, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  root: {
    padding: "24px"
  },
  footer: {
    background: "#626F7E",
    // position: "fixed",
    // bottom: 0,
    // width: "100%"
  },
  title: {
    fontSize: "14px",
    color: "#fff"
  },
  text: {
    color: "#fff",
    fontSize: "12px",
  },
  line: {
    borderBottom: "2px solid white",
  },
  linkContainer: {
    textAlign: "right",
    display: "flex",
    flexDirection: "row"
  },
  link: {
    color: "white",
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-end"
  },
  linkMobile: {
    color: "white",
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-start"
  }
}));

export const Footer = () => {

  const isItDesktop = useMediaQuery('(min-width:600px) and (min-height:600px)');
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Grid container
        direction="row"
        justify="center" className={classes.root}>
        <Grid item sm={4} xs={12}>
          <h1 className={classes.title}>Discover Shout</h1>
          <p className={classes.text}>Shout allows your organization to reward and engage with employees and <br /> customers easily</p>
        </Grid>
        <Grid item sm={2} xs={12}>
          <h1 className={classes.title}>Contact us</h1>
          <p className={classes.text}>Ask for a demo, Try out our service</p>
        </Grid>
        <Grid item sm={4} xs={12}>
          <h1 className={classes.title}>Be our partner</h1>
          <p className={classes.text}>Free to join, no lockin contract <br />Expand your business opportunity to meed more customer</p>
        </Grid>
      </Grid>

      <Grid container justify="center" className={classes.root}>
        <Grid item sm={10} xs={10}>
          <div className={classes.line}></div>
        </Grid>
      </Grid>

      <Grid container
        direction="row"
        justify="center" className={classes.root}
        style={isItDesktop ? { paddingTop: 0 } : { marginBottom: '48px' }}
      >
        <Grid item sm={8} xs={12}>
          <img src="/logo_white.svg" alt="Logo" style={{ width: '100px' }} />
        </Grid>
        <Grid item sm={2} xs={12} className={classes.linkContainer}>
          <Link href="/help" className={isItDesktop ? classes.link : classes.linkMobile}>Help</Link>
          <Link href="/legal" className={isItDesktop ? classes.link : classes.linkMobile}>Legal</Link>
        </Grid>
      </Grid>
    </footer>
  );
};