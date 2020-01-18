import React from 'react';
import { Grid } from '@material-ui/core';
import './animation.scss';


export const LoadingAnimation = () => {

  let content = (
    <Grid container justify="center" alignItems="center">
      <Grid item style={{margin:'10rem'}}>
        <div className="coffee-mug">
          <div className="coffee-container">
            <div className="coffee"></div>
          </div>
        </div>

        {/* <div className='threedotloader'>
          <div className='dot'></div>
          <div className='dot'></div>
          <div className='dot'></div>
        </div> */}
      </Grid>
    </Grid>
  );
  return content;
};