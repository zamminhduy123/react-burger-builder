import React from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import {Route, Redirect} from 'react-router-dom'
import Aux from '../../hoc/AuxHoc/AuxHoc'
import ContactData from './ContactData/ContactData'

import {connect} from 'react-redux'

class Checkout extends React.Component{
    state = {
        loaded: false
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data')
    }

    render(){
        let summary = <Redirect to='/'/>
        if (this.props.ings){
            const purchasedRedirect = this.props.purchased ? <Redirect to='/'/> : null
            summary = (<Aux>
                {purchasedRedirect}
                        <CheckoutSummary 
                            ingredients={this.props.ings} 
                            checkoutCancelled={this.checkoutCancelledHandler} 
                            checkoutContinued={this.checkoutContinuedHandler}/>
                        <Route path = {this.props.match.path + '/contact-data'} 
                                component={ContactData}></Route>
                    </Aux>)
        }
        return(
            <div>
                {summary}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        purchased: state.order.purchasing
    }
}

export default connect(mapStateToProps)(Checkout)