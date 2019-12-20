import React, { useState, useEffect } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Grid, Typography, Button, makeStyles} from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { API } from 'helpers';
import { EnhancedTable } from 'components'

const useStyles = makeStyles(theme => ({
    rightSide: {
        display: "flex",
        flexDirection: "row-reverse"
    },
    root: {
        marginTop: theme.spacing(10),
    },
    items: {
        padding: theme.spacing(0.5),
        textalign: "center",
        whiteSpece: "nowarp",
        marginBottom: theme.spacing(1),
    },
    container: {
        padding: '3vw'
    }

}));

const MerchantDetail = ({ ...props }) => {
    const [indTeamDetails, setIndTeamDetails] = useState([]);
    const [displayTeamDetails, setDisplayTeamDetails] = useState({})
    const [claims, setClaims] = useState([]);
    // const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isLoad, setIsLoad] = useState(false)
    const [callback, setCallback] = useState();
    const [storeName, setStoreName] = useState('')
    const [storeNumber, setStoreNumber] = useState('')
    const [isMerchantSelected] = useState(
        props.location.state.hasOwnProperty("selectedMerchant") ? true : false
    )
    let merchantId = props.location.state.selectedMerchant;
    const classes = useStyles();

    useEffect(() => {
        if (isMerchantSelected) {
            //API
            setIsLoad(true)
            console.log(merchantId)
        }
    }, [callback])
    
    const handleMerchantBlock = () => {
       //API
    }
    const handleUpdateDialogClose = () => {
        setIsUpdateDialogOpen(false)
    }

    const handleUpdateDialogOpen = () => {
        setIsUpdateDialogOpen(true)
    }
    const handleUpdateSubmit = () => {
        //API.update
        setIsUpdateDialogOpen(false)
    }
    
    return (
        <Grid container className={classes.container}>
            {(isLoad && <Grid container spacing={3}>
                <Grid item xs={8} sm={10}>
                    <Typography variant='h4' gutterBottom>{merchantId}</Typography>
                    <Typography variant='h6' gutterBottom>Location: </Typography>
                </Grid>
                <Grid item xs={2} sm={1}>
                    <Button color='primary' variant="contained" onClick={handleUpdateDialogOpen}>Update</Button>
                </Grid>
                <Grid item xs={2} sm={1}>
                    <Button color='secondary' variant="contained" onClick={() => handleMerchantBlock()}>Block</Button>
                </Grid>

                <Grid item xs={12}>
                    {/* <EnhancedTable data={} title="Claim List" styles={{
                        heading: {
                            head: {
                                background: 'black',
                                color: 'white',
                            }
                        }
                    }} options={{
                        toolbarActions: [{
                            label: 'Confirm',
                            function: (e, data) => {
                                //API.
                            }
                        }],
                        ignoreKeys: ['_id'],
                    }} /> */}
                </Grid>
                </Grid>)}

        </Grid>
    );

}
export default withRouter(MerchantDetail)