import React, { useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Grid, Typography, makeStyles, Paper, Dialog, Avatar, TextField, DialogContent, DialogActions, Button, DialogTitle, Icon } from '@material-ui/core';
import { API } from 'helpers/index';
import { LoadingAnimation } from 'components/index';
// import { element, elementType } from 'prop-types';

const useStyles = makeStyles(theme=>({
  card: {
    padding: '20px',
    width: 'inherit'
  },
  container: {
    padding: '3vw'
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  add:{
    width: theme.spacing(10),
    height: theme.spacing(10),
    fontSize: theme.spacing(10),
  }
}));
const Company = () => {
  const classes = useStyles();
  const [companies, setCompanies] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState();
  const [emailId, setEmailId] = useState('');
  const [fullName, setFullName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(true);

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
    //validation
    API.createSuperAdmin({ emailId: emailId, fullName: fullName }, reload);
    handleDialogClose();
    //reset data
    setEmailId('');
    setFullName('');
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const reload = () => {
    setRefresh(!refresh);
  };
  return (isSelected ? (<Redirect to={{ pathname: '/CompanyDetail', state: { selectedCompany } }} />)
    : (
      <Grid container className={classes.container} spacing={6}>
        <Grid item xs={12}>
          <Typography variant="h4">Companies</Typography>
        </Grid>
        {companies ?
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
          </Grid> : <LoadingAnimation/>}
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
    ));
};

export default withRouter(Company);
