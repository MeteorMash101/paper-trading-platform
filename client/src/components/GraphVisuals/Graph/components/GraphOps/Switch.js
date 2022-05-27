import React from "react";
import { Fragment } from "react";

const Switch = ({label, onChangeHandler}) => {
    return (
        <Fragment>
            <div class="switchElement">
                <label class="switchLabel">{label}</label>
                <label class="switch">
                    <input type="checkbox" onChange={onChangeHandler}/>
                    <span class="slider round"></span>
                </label>
            </div>
        </Fragment>
    );
}

export default Switch;