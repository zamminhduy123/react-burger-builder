import React from 'react'

import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = ( props ) =>{
    let transformedIngredients = Object.keys(props.ingredients)
        .map((igreKey) => {
            return [...Array(props.ingredients[igreKey])].map((_,i) => {
                return <BurgerIngredient key={igreKey+i} type={igreKey}/>;
            });
        })
        .reduce((arr, el) => {
            return arr.concat(el);
        }, []);

    if (transformedIngredients.length === 0){
        transformedIngredients = <p>Please start adding ingredients!!!</p>
    }
    
    return (
        <div className = {classes.Burger}>
            <BurgerIngredient type="bread-top"></BurgerIngredient>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"></BurgerIngredient>
        </div>
    );
};

export default burger