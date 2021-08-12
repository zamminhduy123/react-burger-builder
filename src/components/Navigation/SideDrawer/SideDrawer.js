import React from 'react'

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/AuxHoc/AuxHoc';

import classes from './SideDrawer.css'

const sideDrawer = (props) => {

    let attechedClasses = [classes.SideDrawer,classes.Close]

    if (props.open){
        attechedClasses = [classes.SideDrawer,classes.Open]
    }

    return (
        <Aux>
            <Backdrop show={props.open} click={props.closed}/>
            <div className={attechedClasses.join(' ')} onClick={props.closed}>
                <div className={classes.Logo}><Logo/></div>
                <nav>
                    <NavigationItems isAuthenticated = {props.isAuth}></NavigationItems>
                </nav>
            </div>
        </Aux>
    );
}

export default sideDrawer