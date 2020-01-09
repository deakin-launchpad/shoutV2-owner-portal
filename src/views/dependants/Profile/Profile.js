import React, { useState, useEffect } from 'react';
import { API } from 'helpers';
import { Paper, Grid, Typography, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, makeStyles, FormControl } from '@material-ui/core';
import { notify } from 'components/index';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  card: {
    width: '20%',
    margin: theme.spacing(3),
  },
  title: {
    fontSize: 14,
  },
  input: {
    display: 'none',
  },
  description: {
    paddingLeft: '9vw',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  credit: {
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  container: {
    padding: '3vw'
  },
  padding: {
    padding: 10
  },
  paddingLeft: {
    paddingLeft: '3vw',
  },
  margin: {
    margin: theme.spacing(0.5),
  },
  marginPhone: {
    marginTop: '16px',
    marginBottom: '8px'
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },

}));

export const Profile = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [callback, setCallback] = useState();

  useEffect(() => {
  }, []);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      notify('Password not match.');
    }
    else {
      const data = { skip: false, oldPassword: oldPassword, newPassword: newPassword };
      const triggerAPI = async () => {
        const isSuccess = await API.changePasswordAdmin(data);
        notify(isSuccess);
      };
      setCallback(!callback);
      triggerAPI();
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = () => {
  };

  // const handleSubmission = (event) => {
  //     let formData = new FormData();
  //     formData.append('imageFile', event.target.files[0])
  //     API.uploadImage(formData, setImageURL);
  // }

  return (
    <Grid container className={classes.container} spacing={6}>
      <Grid container item xs={12} spacing={3}>
        {/* <Grid item xs={12} className={classes.root}>
                    <Badge
                        overlap="circle"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        badgeContent={<div><input accept="image/*"
                            className={classes.input}
                            id="icon-button-file"
                            multiple
                            onChange={handleSubmission}
                            type="file" />
                            <label htmlFor="icon-button-file">
                                <IconButton color="primary" aria-label="upload picture" component="span" size="small">
                                    <PhotoCamera />
                                </IconButton>
                            </label></div>}
                    >
                        <Avatar alt="Travis Howard" src="https://s3.au-syd.cloud-object-storage.appdomain.cloud/ipan-v2-bucket/image/profilePicture/original/Profile_XLzfhcJRFgG0.jpg" className={classes.large} />
                    </Badge>
                </Grid> */}
        <Grid item xs={12}>
          <Paper>
            <Grid container className={classes.padding} spacing={2}>
              <Grid item xs={12} sm={12} >
                <Typography variant='h5' gutterBottom>Change Password</Typography>
                <Grid container justify='center'>
                  <Grid item xs={12} sm={4}>
                    <FormControl variant="outlined" className={classes.margin} fullWidth>
                      <InputLabel>Old Password</InputLabel>
                      <OutlinedInput
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setOldPassword(e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={100}
                      />
                    </FormControl>
                    <FormControl variant="outlined" className={classes.margin} fullWidth>
                      <InputLabel>New Password</InputLabel>
                      <OutlinedInput
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setNewPassword(e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={110}
                      />
                    </FormControl>
                    <FormControl variant="outlined" className={classes.margin} fullWidth>
                      <InputLabel>Confirm New Password</InputLabel>
                      <OutlinedInput
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={170}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container justify='flex-end'>
                  <Button color='primary' variant='contained' onClick={handlePasswordChange}>Confirm</Button>
                </Grid>
              </Grid>

            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};
