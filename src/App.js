import React from 'react'
import { Route,Switch,withRouter,Redirect } from 'react-router-dom'

import {connect} from 'react-redux'

import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BugerBuilder/BurgerBuilder';

import * as actions from './store/actions/index'
import asyncComponent from './hoc/asyncComponent/asyncComponent';

const asyncCheckout = asyncComponent(() => {
  return import ('./containers/Checkout/Checkout')
}) 
const asyncAuth = asyncComponent(() => {
  return import ('./containers/Auth/Auth')
}) 
const asyncOrders = asyncComponent(() => {
  return import ('./containers/Orders/Orders')
}) 
const asyncLogout = asyncComponent(() => {
  return import ('./containers/Auth/Logout/Logout');
}) 

class App extends React.Component {
  componentDidMount() {
    this.props.onTryAutoSignUp();
  }
  render() {
    let routes = (
      <Switch>
        <Route path='/auth' exact component={asyncAuth}></Route>
        <Route path='/' exact component={BurgerBuilder}></Route>
        <Redirect to='/'/>
      </Switch>
    );

    if (this.props.isAuthenticated){
      routes =  (
        <Switch>
            <Route path='/checkout' component={asyncCheckout}></Route>
            <Route path='/orders' exact component={asyncOrders}></Route>
            <Route path='/logout' exact component={asyncLogout}></Route>
            <Route path='/auth' exact component={asyncAuth}></Route>
            <Route path='/' exact component={BurgerBuilder}></Route>
            <Redirect to='/'/>
        </Switch>
      )
    }
    return (
      <div>
        <Layout>
            {routes}
        </Layout>
      </div>
    )
  }
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
