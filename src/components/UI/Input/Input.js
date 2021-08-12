import React from 'react'

import classes from './Input.css'

const input = (props) => {

    const inputClasses = [classes.InputElement]

    if (props.invalid && props.shouldValidate && props.touched){
        inputClasses.push(classes.Invalid)
    }

    let inputEle = null;
    switch(props.elementType){
        case ('input'):
            inputEle = <input className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} onChange={props.changed} />
            break;
        case ('text-area'):
            inputEle = <textarea className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} onChange={props.changed}/>
            break;
        case ('select'):
            inputEle = (
                <select className={inputClasses.join(' ')}    
                    value={props.value} onChange={props.changed}>
                        {props.elementConfig.options.map(option => (
                            <option key={option.value} value={option.value}>{option.displayValue}</option>
                        ))}
                </select>)
            break;
        default:
            inputEle = <input className={classes.InputElement} {...props.elementConfig} value={props.value}/>
            break;
    }

    return (
        <div>
            <label className={classes.Label}>{props.label}</label>
            {inputEle}
        </div>
    );
}

export default input;