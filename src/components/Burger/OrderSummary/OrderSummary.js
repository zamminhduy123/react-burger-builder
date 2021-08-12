import React from 'react'

import Aux from '../../../hoc/AuxHoc/AuxHoc'
import Button from '../../UI/Button/Button'

const orderSummary  = (props) => {
    let ingredientSummary = Object.keys(props.ingredients).map(ingreKey => {
        return ( 
        <li key={ingreKey}>
            <span style={{textTransform: 'capitalize'}}>{ingreKey}</span>: {props.ingredients[ingreKey]}
        </li>
        )})
    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients: </p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {props.total.toFixed(2)}$</strong></p>
            <p>Continue to CheckOut?</p>
            <Button clicked={props.purchaseCancle} btnType='Danger' >CANCLE</Button>
            <Button clicked={props.purchaseContinue} btnType='Success'>CONTINUE</Button>
        </Aux>
    )
}

export default orderSummary