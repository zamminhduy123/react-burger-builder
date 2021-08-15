import React, {useEffect, Suspense} from 'react'
import { Route,Switch,withRouter,Redirect } from 'react-router-dom'

import {connect} from 'react-redux'

import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BugerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';

import * as actions from './store/actions/index'

const Checkout = React.lazy(() => {
  return import ('./containers/Checkout/Checkout')
}) 
const Auth = React.lazy(() => {
  return import ('./containers/Auth/Auth')
}) 
const Orders = React.lazy(() => {
  return import ('./containers/Orders/Orders')
}) 
const App = props => {
  const {onTryAutoSignUp} = props;
  useEffect(()=>{
    onTryAutoSignUp();
  }, [onTryAutoSignUp])

  let routes = (
    <Switch>
      <Route path='/auth' exact render={(props) => <Auth {...props}/>}></Route>
      <Route path='/' exact component={BurgerBuilder}></Route>
      <Redirect to='/'/>
    </Switch>
  );

  if (props.isAuthenticated){
    routes =  (
      <Switch>
          <Route path='/checkout' render={(props) => <Checkout {...props}/>}></Route>
          <Route path='/orders' exact render={(props) => <Orders {...props}/>}></Route>
            <Route path='/logout' exact component={Logout}></Route>
            <Route path='/auth' exact render={(props) => <Auth {...props}/>}></Route>
            <Route path='/' exact component={BurgerBuilder}></Route>
            <Redirect to='/'/>
        </Switch>
      )
  }
  return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>
              {routes}
          </Layout>
        </Suspense>
      </div>
    )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
      onTryAutoSignUp: () => {dispatch(actions.authCheckState())} 
  } 
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
