import React from 'react'
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import { Redirect } from 'react-router-dom';

import classes from './Auth.css'

import * as authAction from '../../store/actions/index'
import { updateObject, checkValidity } from '../../shared/utility';

class Auth extends React.Component {
    state = {
        controls: {
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
        },
        isSignUp: true
    }

    componentDidMount() {
        if (this.props.isBuilding && this.props.authRedirectPath !== '/'){
            this.props.onSetRedirectPath('/');
        }
    }


    inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(this.state.controls[controlName], 
            {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        )
        const controlsUpdated = updateObject(this.state.controls,{
            [controlName]: updatedControls
        })
        
        this.setState({controls: controlsUpdated});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value, this.state.isSignUp)
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp}
        })
    }

    render() {

        const formElementArray = [];
        for (let key in this.state.controls){
            formElementArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }
        let form = formElementArray.map(formElement => {
            return (
                <Input 
                    key = {formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.value}
                    changed={(e) => {this.inputChangedHandler(e,formElement.id)}}
                    invalid={!formElement.config.valid}
                    touched={formElement.config.touched}
                    shouldValidate={formElement.config.validation}
                />)
        })

        if (this.props.loading){
            form = <Spinner/>
        }

        let errorMsg = null;
        if (this.props.error){
            errorMsg = (
                //only for firebase message
                <p>{this.props.error.message}</p>
            )
        }

        let authRedirect = null;

        if (this.props.isAuthenticated){
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        }
        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMsg}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button btnType="Danger" clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}</Button>
            </div>
        )
    }
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