import React , {useState, useEffect }from 'react'

import Aux from '../../hoc/AuxHoc/AuxHoc'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import {instance} from '../../axios-order'
import Spinner from '../../components/UI/Spinner/Spinner';

import {connect} from 'react-redux'
import * as actions from '../../store/actions/index'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const  BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const {onInitIngredient} = props;

    useEffect(()=>{
        onInitIngredient();
    },[onInitIngredient])

    const purchaseHanlder = () => {
        if (props.isAuthenticated){
            setPurchasing(true)
        }
        else {
            props.onSetRedirectPath('/checkout')
            props.history.push('/auth')
        }
    }

    const purchaseCancelHanlder = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        props.onInitPurchased();
        props.history.push({
            pathname: '/checkout',
        })
    }

    const updatePurchaseState = (updatedIngredients) => {
        const sum = Object.keys(updatedIngredients).map(ingreKey => {
            return updatedIngredients[ingreKey];
        })
        .reduce((sum,element) => {
            return sum+element;
        },0);
        return sum > 0
    }

        const disabledInfo = {
            ...props.ings
        }

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = props.error ? <p style={{display:'inline-block', textAlign:'center'}}>Something went wrong!!!Please reload the page!!!</p> : <Spinner/>;
        if (props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={props.ings}/>
                    <BuildControls 
                        ingredientsAdded={props.onIngredientAdded}
                        ingredientsRemoved={props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={props.price}
                        purchasable={updatePurchaseState(props.ings)}
                        order={purchaseHanlder}
                        isAuth={props.isAuthenticated}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
                                purchaseCancle={purchaseCancelHanlder}
                                purchaseContinue={purchaseContinueHandler}
                                ingredients={props.ings}
                                total={props.price}/>
        }

        return (
            <Aux>
                <Modal show={purchasing} modalClosed={purchaseCancelHanlder}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
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

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler( BurgerBuilder ,instance ));