import React, { useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Grid, Typography, makeStyles, Paper, Dialog, Avatar, TextField, DialogContent, DialogActions, Button, DialogTitle, Icon, useMediaQuery } from '@material-ui/core';
import { API } from 'helpers/index';
import { LoadingAnimation, notify } from 'components/index';
// import { element, elementType } from 'prop-types';

const useStyles = makeStyles(theme => ({
  card: {
    padding: '20px',
    width: 'inherit'
  },
  container: {
    padding: '1.5vw'
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  add: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    fontSize: theme.spacing(10),
  }
}));
const Company = () => {
  const classes = useStyles();
  const [companies, setCompanies] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState();
  const [emailId, setEmailId] = useState('');
  const [fullName, setFullName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(true);
  let isItDesktop = useMediaQuery('(min-width:600px) and (min-height:600px)');

  useEffect(() => {
    API.getCompanies(setCompanies);
  }, [refresh]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setIsSelected(true);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleSubmit = () => {
    let emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //validation
    if (emailId !== '' && fullName !== '') {
      let emailPatternTest = emailPattern.test(emailId);
      if (!emailPatternTest) {
        notify('Invalid Email address!');
      } else {
        API.createSuperAdmin({ emailId: emailId.toLowerCase(), fullName: fullName }, reload);
        notify('New merchant created!');
        handleDialogClose();
      }
    }
    else notify('Please fill the form!');
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    //reset data
    setEmailId('');
    setFullName('');
  };

  const reload = () => {
    setRefresh(!refresh);
  };
  return (isSelected ? (<Redirect to={{ pathname: '/CompanyDetail', state: { selectedCompany } }} />)
    : (
      <Grid container className={classes.container} justify="center">
        <Grid container item xs={isItDesktop ? 10 : 12}>
          <Grid item xs={12}>
            <Typography variant="h4">Companies</Typography>
          </Grid>
          {companies && companies !== undefined && companies !== null?
            <Grid item container spacing={1}>
              {companies.map((element, i) => (
                element.values.length === 0 ?
                  <Grid item xs={12} sm={6} lg={4} key={i}>
                    <Paper onClick={() => handleCompanySelect(element)} className={classes.card}>
                      <Grid container>
                        <Grid item xs={4} container alignItems='center' justify='center'>
                          <Avatar alt="img" src={element.companyLogo} className={classes.large} />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='h6' gutterBottom>Not Registered</Typography>
                          <Typography variant='caption' display="block">Owner: {element.superAdminId.fullName}</Typography>
                          <Typography variant='caption' display="block" gutterBottom>Location: Not Registered</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid> :
                  <Grid item xs={12} sm={6} lg={4} key={i}>
                    <Paper onClick={() => handleCompanySelect(element)} className={classes.card}>
                      <Grid container>
                        <Grid item xs={4} container alignItems='center' justify='center'>
                          <Avatar alt="img" src={element.companyLogo} className={classes.large} />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant='h6' gutterBottom>{element.companyName}</Typography>
                          <Typography variant='caption' display="block">Owner: {element.superAdminId.fullName}</Typography>
                          <Typography variant='caption' display="block" gutterBottom>Location: {element.location}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
              ))
              }
              <Grid item xs={12} sm={6} lg={4}>
                <Paper className={classes.card} onClick={handleDialogOpen}>
                  <Grid container alignItems='center' justify='center'>
                    <Icon component='span' className={classes.add}>add</Icon>
                  </Grid>
                </Paper>
              </Grid>
            </Grid> : <LoadingAnimation />}
          <Dialog fullWidth maxWidth='md' open={isDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Create New Owner</DialogTitle>
            <DialogContent>
              <form>
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  defaultValue={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                />
                <TextField
                  className={classes.margin}
                  label="Owner name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  defaultValue={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    ));
};

export default withRouter(Company);
