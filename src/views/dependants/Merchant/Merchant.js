import React, { useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { API } from 'helpers';
import { Grid, Typography, makeStyles, Button, useMediaQuery } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch } from '@material-ui/core';
import { TableWithSorting, LoadingAnimation, notify } from 'components';

const useStyles = makeStyles(({
  card: {
    padding: '20px',
    width: 'inherit',
  },
  container: {
    padding: '1.5vw'
  },
  map: {
    maxHeight: 500,
    padding: '20px',
    width: 'inherit',
    height: '100%',
  },
  mobileContainer: {
    display: 'block'
  }
}));
export const Merchant = () => {

  const headCells = [
    { id: 'fullName', numeric: false, disablePadding: true, label: 'Full Name' },
    { id: 'emailId', numeric: false, disablePadding: true, label: 'Email Address' },
    { id: 'isBlocked', numeric: false, disablePadding: true, label: 'Unblocked/Blocked' },
    { id: 'details', numeric: false, disablePadding: true, label: 'Details' },
  ];

  const classes = useStyles();
  const [merchantList, setMerchantList] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [emailId, setEmailId] = useState('');
  const [fullName, setFullName] = useState('');
  const [callback, setCallback] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [merchantTableList, setMerchantTableList] = useState([]);
  const isItDesktop = useMediaQuery('(min-width:600px) and (min-height:600px)');

  const showDetails = (data) => {
    setIsSelected(true);
    setSelectedMerchant(data);
  };

  useEffect(() => {
    API.getMerchant(setMerchantList);
  }, [callback]);


  useEffect(() => {
    let temp = [];
    const handleChange = (id, state) => {
      API.blockUnblockMerchant({ MerchantId: id, block: !state }, refresh);
    };
    merchantList.forEach(element => {
      temp.push({
        fullName: element.fullName,
        emailId: element.emailId,
        isBlocked: <Switch
          checked={element.isBlocked}
          onChange={() => handleChange(element._id, element.isBlocked)}
          value={element.isBlocked}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />,
        details: <Button variant='outlined' color='primary' onClick={() => showDetails(element._id)}>View Details</Button>
      });
    });
    setMerchantTableList(temp);
  }, [merchantList]);



  const refresh = () => {
    API.getMerchant(setMerchantList);
  };
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleSubmit = () => {
    //validation  
    let emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailId !== '' && fullName !== '') {
      let emailPatternTest = emailPattern.test(emailId);
      if (!emailPatternTest) {
        notify('Invalid Email address!');
      } else {
        API.createMerchant({ emailId: emailId.toLowerCase(), fullName: fullName }, setCallback);
        notify('New merchant created!');
        handleDialogClose();
      }
    }
    else notify('Please fill the form!');
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEmailId('');
    setFullName('');
  };
  return (isSelected ? (<Redirect to={{ pathname: '/merchantdetail', state: { selectedMerchant } }} />
  ) : (
    <Grid container justify="center" className={isItDesktop? '' : classes.mobileContainer}>
      <Grid container item xs={isItDesktop ? 10 : 12} className={classes.container}>
        <Grid container item xs={12}>
          <Grid item xs={8}>
            <Typography variant='h4'>Merchants</Typography>
          </Grid>
          <Grid item xs={4} container justify="flex-end" alignItems="center">
            <Button variant='outlined' onClick={handleDialogOpen}>Add</Button>
          </Grid>
          {merchantTableList[0] === undefined ? <LoadingAnimation /> : <TableWithSorting
            headerElements={headCells}
            data={merchantTableList}
            ignoreKeys={['_id']}
            tableTitle={'Merchant List'}
            actionColor={'primary'}
          />}
        </Grid>
        <Dialog fullWidth maxWidth='md' open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Create New Merchant</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                label='Email'
                fullWidth
                margin='normal'
                variant='outlined'
                defaultValue={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
              <TextField
                className={classes.margin}
                label='Merchant Name'
                fullWidth
                margin='normal'
                variant='outlined'
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
    </Grid>)
  );
};
export default withRouter(Merchant);
