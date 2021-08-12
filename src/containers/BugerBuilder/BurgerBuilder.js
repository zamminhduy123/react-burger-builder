import React from 'react'

import Aux from '../../hoc/AuxHoc/AuxHoc'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-order'
import Spinner from '../../components/UI/Spinner/Spinner';

import {connect} from 'react-redux'
import * as actions from '../../store/actions/index'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

export class BurgerBuilder extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            purchasing: false,
        }
    }

    componentDidMount(){
        this.props.onInitIngredient();
    }

    purchaseHanlder = () => {
        if (this.props.isAuthenticated){
            this.setState({purchasing: true})
        }
        else {
            this.props.onSetRedirectPath('/checkout')
            this.props.history.push('/auth')
        }
    }

    purchaseCancelHanlder = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchased();
        this.props.history.push({
            pathname: '/checkout',
        })
    }

    updatePurchaseState(updatedIngredients) {
        const sum = Object.keys(updatedIngredients).map(ingreKey => {
            return updatedIngredients[ingreKey];
        })
        .reduce((sum,element) => {
            return sum+element;
        },0);
        return sum > 0
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        }

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.props.error ? <p style={{display:'inline-block', textAlign:'center'}}>Something went wrong!!!Please reload the page!!!</p> : <Spinner/>;
        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientsAdded={this.props.onIngredientAdded}
                        ingredientsRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        order={this.purchaseHanlder}
                        isAuth={this.props.isAuthenticated}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
                                purchaseCancle={this.purchaseCancelHanlder}
                                purchaseContinue={this.purchaseContinueHandler}
                                ingredients={this.props.ings}
                                total={this.props.price}/>
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHanlder}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return { 
        onIngredientAdded: (ingName) => dispatch(actions.addIngridient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngridient(ingName)),
        onInitIngredient: () => dispatch(actions.initIngredients()),
        onInitPurchased: () => dispatch(actions.purchaseInit()),
        onSetRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler( BurgerBuilder ,axios ));