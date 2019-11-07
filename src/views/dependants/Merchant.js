import React, { useEffect, useContext, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import { API } from 'helpers';
import { Grid, Typography, makeStyles, Paper, Icon, Button } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';

const useStyles = makeStyles(({
    card: {
        padding: '20px',
        width: 'inherit',

    },
    container: {
        padding: '3vw'
    }
}))
export const Merchant = () => {
    const classes = useStyles();
    const [merchantList, setMerchantList] = useState([]);
    const [isLoad, setIsLoad] = useState(false)
    const [selectedMerchant, setSelectedMerchant] = useState('')
    const [isSelected, setIsSelected] = useState(false)
    const [emailId, setEmailId] = useState('')
    const [fullName, setFullName] =useState('')
    const [callback, setCallback] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        API.getMerchant(setMerchantList)
    }, [callback])
    useEffect(() => {
        if (merchantList.length !== 0) {
            setIsLoad(true)
        }
    }, [merchantList])
    const handleMerchantSelect = (id) => {
        setSelectedMerchant(id)
        setIsSelected(true)
    }
    const handleDialogOpen = () => {
        setIsDialogOpen(true)
    }
    const handleSubmit = () => {
        //validation
        API.createMerchant({emailId:emailId,fullName:fullName},setCallback)
        handleDialogClose()
        //reset data
        setEmailId('')
        setFullName('')
    }
    const handleDialogClose = () => {
        setIsDialogOpen(false)
    }
    return (isSelected ? (<Redirect to={{ pathname: "/merchantdetail", state: { selectedMerchant } }} />
    ) : (
            <Grid container className={classes.container} spacing={6}>
                <Grid container className={classes.container} item xs={12} spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Merchant</Typography>
                    </Grid>
                    {isLoad &&
                        <Grid item container spacing={1}>
                            {
                                merchantList.map(merchant => (
                                    <Grid key={Math.random()} item xs={6} sm={4} lg={2}>
                                        <Paper onClick={() => handleMerchantSelect(merchant._id)} className={classes.card}>
                                            <Typography variant='body2' gutterBottom>Merchant</Typography>
                                            <Typography variant='h6' gutterBottom>{merchant.fullName}</Typography>
                                            <Typography variant='caption' display="block">Is Blocked: {merchant.isBlocked ? 'true' : 'false'} </Typography>
                                            <Typography variant='caption' display="block" gutterBottom noWrap>Email: {merchant.emailId} </Typography>
                                        </Paper>
                                    </Grid>
                                ))
                            }
                            <Grid item xs={6} sm={4} lg={2}>
                                <Paper className={classes.card} onClick={handleDialogOpen}>
                                    <Icon component='span' style={{ display: 'flex', fontSize: 100, margin: 'auto', marginTop: '10px' }}>add</Icon>
                                </Paper>
                            </Grid>

                        </Grid>
                    }
                </Grid>
                <Dialog fullWidth maxWidth='md' open={isDialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Create New Merchant</DialogTitle>
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
                                label="Merchant Name"
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
            </Grid>)
    );
};
export default withRouter(Merchant);
