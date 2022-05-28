import React from "react";

const Mode = (props) => {
    return (
        <button class="graphModeSwitch" name={props.name} onClick={props.onClick}>
            {props.children}
        </button>
    );
}

export default Mode;