import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Typography, makeStyles, Paper, Button } from '@material-ui/core';
import { API } from 'helpers/index';
import { TableWithSorting } from 'components';
import { LoadingScreen } from 'components/index';
import Avatar from '@material-ui/core/Avatar';
import { Map, View, Feature } from 'ol';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import 'ol/ol.css';
import Moment from 'react-moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  rightSide: {
    display: 'flex',
    flexDirection: 'row-reverse'
  },
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
    padding: '3vw'
  },
  card: {
    padding: '20px',
    width: 'inherit',
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },

}));

const MerchantDetail = ({ ...props }) => {

  const headCells = [
    { id: 'date', numeric: false, disablePadding: true, label: 'Date' },
    { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
    { id: 'amount', numeric: false, disablePadding: true, label: 'Amount' },
    { id: 'claim', numeric: false, disablePadding: true, label: 'Confirm Claim' },
  ];

  const [isLoad, setIsLoad] = useState(false);
  const [merchantDetails, setMerchantDetails] = useState();
  const [mapZoom] = useState(15);
  const [mapCentre, setMapCentre] = useState([0, 0]);
  const [claims, setClaims] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [reload, setReload] = useState(true);
  const [claimId, setClaimId] = useState('');
  const [isMerchantSelected] = useState(
    props.location.state.hasOwnProperty('selectedMerchant') ? true : false
  );
  const [open, setOpen] = React.useState(false);
  let merchantId = props.location.state.selectedMerchant;
  const classes = useStyles();

  useEffect(() => {
    if (isMerchantSelected) {
      API.merchantDetails({ merchantId: merchantId }, setMerchantDetails);
      setIsLoad(true);
    }
  }, [isMerchantSelected, merchantId]);

  useEffect(() => {
    if (isMerchantSelected) {
      API.getMerchantClaims({ merchantId: merchantId }, setClaims);
    }
  }, [isMerchantSelected, reload, merchantId]);

  const handleClose = () => {
    setOpen(false);
  };
  const olMap = new Map({
    target: null,
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: fromLonLat(mapCentre),
      zoom: mapZoom
    })
  });

  const handleClaim = () => {
    API.confirmMerchantClaim({ claimId: claimId }, refresh);
    setClaimId('');
    setOpen(false);
  };
  const refresh = () => {
    setReload(!reload);
  };
  useEffect(() => {
    let temp = [];
    claims.forEach(element => {
      temp.push({
        _id: element._id,
        date: <Moment format='DD/MM/YYYY'>{element.date}</Moment>,
        status: element.status,
        amount: '$' + element.amount,
        claims: element.status === 'Processing' ? <Button color='secondary' variant='outlined' onClick={() => { setClaimId(element._id); setOpen(true); }}>Approve</Button> : 'Transferred'
      });
    });
    setClaimData(temp);
  }, [claims]);

  useEffect(() => {
    if (merchantDetails && merchantDetails.location) {
      setMapCentre(merchantDetails.location.coordinates);
      let map = document.getElementById('map');
      map.innerHTML = '';
      olMap.setTarget('map');
      var layer = new VectorLayer({
        source: new Vector({
          features: [
            new Feature({
              geometry: new Point(fromLonLat(mapCentre))
            })
          ]
        })
      });
      olMap.addLayer(layer);
    }
  }, [mapCentre, merchantDetails, olMap]);


  return (
    <Grid container className={classes.container}>
      {(isLoad && merchantDetails ? <Grid container spacing={3}>
        <Grid item xs={1} sm={1}>
          <Avatar alt={merchantDetails.storeName ? merchantDetails.storeName : 'Merchant not registered'} src={merchantDetails.profilePicture ? merchantDetails.profilePicture.thumbnail : 'Merchant not registered'} className={classes.large} />
        </Grid>
        <Grid item xs={7} sm={9}>
          <Typography variant='h4' gutterBottom>{merchantDetails.storeName ? merchantDetails.storeName : 'Merchant not registered'}</Typography>
        </Grid>
        <Grid item xs={3} sm={3} lg={3}>
          <Paper className={classes.card}>
                        Orders: {merchantDetails.orders}
          </Paper>
        </Grid>
        <Grid item xs={3} sm={3} lg={3}>
          <Paper className={classes.card}>
                        Customers: {merchantDetails.customers}
          </Paper>
        </Grid>
        <Grid item xs={3} sm={3} lg={3}>
          <Paper className={classes.card}>
                        Earning: {merchantDetails.earning} cr
          </Paper>
        </Grid>
        <Grid item xs={3} sm={3} lg={3}>
          <Paper className={classes.card}>
                        Paid: ${merchantDetails.paid}
          </Paper>
        </Grid>
        <Grid item xs={8} sm={10}>
          {merchantDetails.location && <Typography variant='h6' gutterBottom>Location: </Typography>}
        </Grid>
        <Grid item xs={12} className={classes.map}>
          <div id='map' style={{ width: 'inherit', height: '30vh' }}></div>
        </Grid>
        {claimData[0] && <TableWithSorting
          headerElements={headCells}
          data={claimData}
          ignoreKeys={['_id']}
          tableTitle={'Claim List'}
          actionColor={'primary'}
        />}
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby='alert-dialog-slide-title'
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle id='alert-dialog-slide-title'>{'Confirm claim'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
                            By clicking agree, you approve the transaction.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
                            Disagree
            </Button>
            <Button onClick={handleClaim} color='primary'>
                            Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Grid> : <LoadingScreen></LoadingScreen>)}
    </Grid>
  );

};

MerchantDetail.propTypes = {
  location: PropTypes.any
};
export default withRouter(MerchantDetail);