import React , {useState} from 'react'

import classes from './ContactData.css'

import Button from '../../../components/UI/Button/Button'

import {instance} from '../../../axios-order'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'

import {connect} from 'react-redux'

import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'

import * as orderActions from '../../../store/actions/index'

import { updateObject, checkValidity } from '../../../shared/utility'

const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            postalCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Postal Code'
                },
                value: '',
                validation: {
                    required: true, 
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {

                },
                valid: true
            }
    })
    const [formIsValid, setFormIsValid] = useState(false);

    const orderHandler = (event) => {
        event.preventDefault(); //prevent reloading the page
        //firebase require .json file
        const orderFormData = {}
        for (let formElementIdentifier in orderForm){
            orderFormData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: props.ings,
            price:props.price,
            orderData: orderFormData,
            userId: props.userId
        }

        props.onOrderBurger(order,props.token);
    }

    const inputChangedHandler = (event, inputIdentifier) => {
        const updateFormElement = updateObject(orderForm[inputIdentifier],{
            value: event.target.value,
            valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
            touched: true
        })

        const updatedOrderForm = updateObject(orderForm, {
            [inputIdentifier]: updateFormElement
        })

        let formIsValid = true;

        for (let inputIdentifiers in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifiers].valid && formIsValid
        }
        setOrderForm(updatedOrderForm)
        setFormIsValid(formIsValid)
    }

        const formElementArray = [];
        for (let key in orderForm){
            formElementArray.push({
                id: key,
                config: orderForm[key]
            })
        }
        let form = (
            <form onSubmit={orderHandler}>
                    {formElementArray.map(formElement => {
                        return (<Input 
                            key = {formElement.id}
                            elementType={formElement.config.elementType} 
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.value}
                            changed={(e) => {inputChangedHandler(e,formElement.id)}}
                            invalid={!formElement.config.valid}
                            touched={formElement.config.touched}
                            shouldValidate={formElement.config.validation}
                            />)
                    })}
                    <Button btnType='Success' disabled={!formIsValid}>ORDER</Button>
                </form>
        );
        if (props.loading){
            form = <Spinner/>
        }
        return (
            <div className={classes.ContactData}>
                <h4>
                    Enter Your Contact Data
                </h4>
                {form}
            </div>
            )
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData,token) => dispatch(orderActions.purchaseBurger(orderData,token))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)( withErrorHandler(ContactData,instance) )