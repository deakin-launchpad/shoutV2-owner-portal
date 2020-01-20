/***
 *  Created by Sanchit Dang
 ***/
import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { LoginContext } from 'contexts';
import { Login, Register, Home, MobileMenu, FourOFour, Example, Merchant, Company, MerchantDetail, CompanyDetail, Profile } from 'views';
import { Layout } from '../layout';
import { LayoutConfig } from 'configurations';
import { LoadingAnimation } from 'components';

export const AppRoutes = (props) => {
  const { loginStatus } = useContext(LoginContext);
  let landingPage = (LayoutConfig.landingPage !== undefined ? LayoutConfig.landingPage !== '' ? LayoutConfig.landingPage : '/merchant' : '/merchant');
  if (loginStatus === undefined) return <LoadingAnimation />;
  return (
    <Switch>
      <Route exact path='/' render={() => (((!loginStatus) ? <Redirect to={{ pathname: '/login' }} {...props} /> : <Redirect to={{
        pathname: landingPage
      }} {...props} />))} />

      <Route exact path='/login' render={() => ((!loginStatus ? <Login  {...props} /> : <Redirect to={{ pathname: landingPage }} {...props} />))} />
      <Route exact path='/register' render={() => ((!loginStatus ? <Register {...props} /> : <Redirect to={{ pathname: landingPage }} {...props} />))} />

      <Route exact path='/home' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }} {...props} /> : <Layout><Home {...props} /></Layout>))} />
      <Route exact path='/menu' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <MobileMenu  {...props} /></Layout>))} />
      <Route exact path='/examples' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <Example  {...props} /></Layout>))} />
      <Route exact path='/merchant' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <Merchant  {...props} /></Layout>))} />
      <Route exact path='/merchantdetail' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <MerchantDetail  {...props} /></Layout>))} />
      <Route exact path='/company' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <Company  {...props} /></Layout>))} />
      <Route exact path='/companyDetail' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <CompanyDetail  {...props} /></Layout>))} />
      <Route exact path='/profile' render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout> <Profile  {...props} /></Layout>))} />
      <Route render={() => ((loginStatus === false ? <Redirect to={{ pathname: '/login' }}  {...props} /> : <Layout><FourOFour  {...props} /></Layout>))} />
    </Switch >
  );
};

/**
 * Changelog 26/09/2019 - Sanchit Dang
 * - use loginStatus variable instead of stateVariable
 * - <Layout/> has to be used alongside every inner view
 * - removed use of trigger404 function
 */
