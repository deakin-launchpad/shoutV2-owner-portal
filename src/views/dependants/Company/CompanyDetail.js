import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Grid, Typography, makeStyles, Avatar, Paper, Switch, Button, useMediaQuery } from '@material-ui/core';
import { API } from 'helpers/index';
import { TableWithSorting, LoadingAnimation } from 'components/index';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(10),
  },
  items: {
    padding: theme.spacing(0.5),
    textalign: 'center',
    whiteSpece: 'nowarp',
    marginBottom: theme.spacing(1),
  },
  container: {
    padding: '1.5vw'
  },card: {
    padding:theme.spacing(2),
    height:'100%',
    backgroundColor:'#C8DAD2'
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  mobileContainer : {
    display: 'block'
  }
}));

const headCells = [
  { id: 'fullName', numeric: false, disablePadding: true, label: 'Full Name' },
  { id: 'emailId', numeric: false, disablePadding: true, label: 'Email Address' },
  { id: 'isBlocked', numeric: false, disablePadding: true, label: 'Unblocked/Blocked' },
];

const CompanyDetail = ({ ...props }) => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [userData, setUserData] = useState();
  const [owner, setOwner] = useState([]);
  const [reload, setReload] = useState(Math.random);
  const classes = useStyles();
  const [selectedCompany] = useState(props.location.state.selectedCompany);
  const [isCompanySelected] = useState(
    props.location.state.hasOwnProperty('selectedCompany') ? true : false
  );
  let isItDesktop = useMediaQuery('(min-width:600px) and (min-height:600px)');

  useEffect(() => {
    let temp = [];
    const handleAdminChange = (id, state) => {
      API.blockUnblockAdmin({ adminId: id, block: !state }, setReload);
    };
    admins.forEach(element => {
      setOwner([selectedCompany.superAdminId._id]);
      temp.push({
        _id: element.adminId._id,
        fullName: element.adminId.fullName,
        emailId: element.adminId.emailId,
        isBlocked: <Switch
          checked={element.adminId.isBlocked}
          onChange={() => handleAdminChange(element.adminId._id, element.adminId.isBlocked)}
          value={element.adminId.isBlocked}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      });
    });
    setAdminData(temp);
  }, [admins, selectedCompany]);

  useEffect(() => {
    let temp = [];
    const handleUserChange = (id, state) => {
      API.blockUnblockUser({ userId: id, block: !state }, setReload);
    };
    users.forEach(element => {
      temp.push({
        _id: element.userId._id,
        fullName: element.userId.firstName + ' ' + element.userId.lastName,
        emailId: element.userId.emailId,
        isBlocked: <Switch
          checked={element.userId.isBlocked}
          onChange={() => handleUserChange(element.userId._id, element.userId.isBlocked)}
          value={element.userId.isBlocked}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      });
    });
    setUserData(temp);
  }, [users]);



  useEffect(() => {
    if (isCompanySelected) {
      API.adminsInsideCompany({ companyId: selectedCompany._id }, setAdmins);
      API.usersInsideCompany({ companyId: selectedCompany._id }, setUsers);
      setIsLoad(true);
    }
  }, [isCompanySelected, selectedCompany, reload]);


  return (
    <Grid container justify="center" className={isItDesktop ? '' : classes.mobileContainer}>
      <Grid container item xs={isItDesktop ? 10 : 12} className={classes.container}>
        {(isLoad && selectedCompany ? <Grid container spacing={3}>
          <Grid container item>
            <Grid item xs={2} sm={1}>
              <Avatar alt={selectedCompany.companyName ? selectedCompany.companyName : 'Company not registered'} src={selectedCompany.companyLogo ? selectedCompany.companyLogo : 'Company not registered'} className={classes.large} />
            </Grid>
            <Grid item xs={8} sm={9}>
              <Typography variant='h4'>{selectedCompany.companyName ? selectedCompany.companyName : 'Company not registered'}</Typography>
              <Typography variant='subtitle1'>{selectedCompany.contactEmail ? selectedCompany.contactEmail : null}</Typography>
              <Typography variant='subtitle1'>{selectedCompany.location ? selectedCompany.location + ': ' : null}{selectedCompany.businessPhoneNumber ? selectedCompany.businessPhoneNumber : null}</Typography>
            </Grid>
            <Grid item xs={2} sm={2} container justify="flex-end" alignItems="center">
              <Button component={Link} to="/company" color='primary' variant="contained">Back</Button>
            </Grid>
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs={7} sm={9}>
              <Typography variant='h4'>{selectedCompany.values.length !== 0 ? 'Values' : null}</Typography>
            </Grid>
            {selectedCompany.values && selectedCompany.values.map((element, i) => (
              <Grid item xs={6} sm={4} lg={2} key={i}>
                <Paper className={classes.card}>
                  <Typography variant='h6' gutterBottom align='center'>{element.name}</Typography>
                  <Typography variant='caption' display='block' align='center'>{element.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            {adminData[0] === undefined ? <LoadingAnimation /> : <TableWithSorting
              headerElements={headCells}
              data={adminData}
              ignoreKeys={['_id']}
              tableTitle={'Admin List'}
              actionColor={'primary'}
              specialRow={owner}
            />}
          </Grid>
          <Grid item xs={12}>
            {userData.length !== 0 && userData[0] === undefined ? <LoadingAnimation /> : <TableWithSorting
              headerElements={headCells}
              data={userData}
              ignoreKeys={['_id']}
              tableTitle={'User List'}
              actionColor={'primary'}
            />}
          </Grid>
        </Grid> : <LoadingAnimation />)}
      </Grid>
    </Grid>
  );

};

CompanyDetail.propTypes = {
  location: PropTypes.any
};
export default withRouter(CompanyDetail);