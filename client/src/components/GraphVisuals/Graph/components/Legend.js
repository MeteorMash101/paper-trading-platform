import React from "react";
import { FcCandleSticks } from "react-icons/fc"
import { VscGraphLine } from "react-icons/vsc"
import DateRangeController from "./GraphOps/DateRangeController";
import Switch from "./GraphOps/Switch";
import Mode from "./GraphOps/Mode";

const Legend = ({ legendData, currDateRange, onChangeDateRange, onChangeShowGridlines, onChangeShowAxis, onChangeShowShade, onChangeShowColorCode, onGraphMode }) => {
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
        {/* <Switch label="Volume" onChangeHandler={onChangeShowVolume}/> */}
      </div>
      {/* Graph Mode Options */}
      <div class="graphModeSwitchContainer">
        <Mode name="GRAPH" onClick={onGraphMode}>
          <VscGraphLine class="svgLogo"/>
        </Mode>
        <Mode name="CANDLESTICK" onClick={onGraphMode}>
          <FcCandleSticks class="svgLogo"/>
        </Mode>
      </div>
    </div>
  );
}

export default Legend;