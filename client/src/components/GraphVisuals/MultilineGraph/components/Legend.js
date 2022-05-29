import React from "react";
import DateRangeController from "./GraphOps/DateRangeController";
import Switch from "./GraphOps/Switch";

const Legend = ({ legendData, currDateRange, onChangeDateRange, onChangeShowGridlines, onChangeShowAxis, onChangeShowShade, onChangeShowColorCode }) => {
  return (
    <div className="legendContainer">
      {/* Date Range Controller */}
      <div className="dateRangeOptsContainer">
        <DateRangeController legendData={legendData} currDateRange={currDateRange} onChangeDateRange={onChangeDateRange} />
      </div>
      {/* Graph Switches */}
      <div class="switchContainer">
        <Switch label="Gridlines" onChangeHandler={onChangeShowGridlines}/>
        <Switch label="Axis" onChangeHandler={onChangeShowAxis}/>
        <Switch label="Shade" onChangeHandler={onChangeShowShade}/>
        <Switch label="Trend Col" onChangeHandler={onChangeShowColorCode}/>
      </div>
    </div>
  );
}

export default Legend;