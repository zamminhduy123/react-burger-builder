import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import { Redirect } from 'react-router-dom';

import classes from './Auth.css'

import * as authAction from '../../store/actions/index'
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = props =>  {
    const [controls, setControls] = useState({
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        })
    const [isSignUp, setIsSignUp] = useState(true);

    const {isBuilding, authRedirectPath, onSetRedirectPath} = props;

    useEffect(()=>{
        if (isBuilding && authRedirectPath !== '/'){
            onSetRedirectPath('/');
        }
    }, [isBuilding, authRedirectPath, onSetRedirectPath])


    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(controls[controlName], 
            {
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true
            }
        )
        const controlsUpdated = updateObject(controls,{
            [controlName]: updatedControls
        })
        
        setControls(controlsUpdated);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value,controls.password.value, isSignUp)
    }

    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp);
    }
        const formElementArray = [];
        for (let key in controls){
            formElementArray.push({
                id: key,
                config: controls[key]
            })
        }
        let form = formElementArray.map(formElement => {
            return (
                <Input 
                    key = {formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.value}
                    changed={(e) => {inputChangedHandler(e,formElement.id)}}
                    invalid={!formElement.config.valid}
                    touched={formElement.config.touched}
                    shouldValidate={formElement.config.validation}
                />)
        })

        if (props.loading){
            form = <Spinner/>
        }

        let errorMsg = null;
        if (props.error){
            errorMsg = (
                //only for firebase message
                <p>{props.error.message}</p>
            )
        }

        let authRedirect = null;

        if (props.isAuthenticated){
            authRedirect = <Redirect to={props.authRedirectPath}/>
        }
        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMsg}
                <form onSubmit={submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button btnType="Danger" clicked={switchAuthModeHandler}>SWITCH TO {isSignUp ? 'SIGN IN' : 'SIGN UP'}</Button>
            </div>
        )
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,    
        isAuthenticated: state.auth.token !== null,
        isBuilding: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => {dispatch(authAction.auth(email, password, isSignUp))},
        onSetRedirectPath: (path) => {dispatch(authAction.setAuthRedirectPath(path))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth)