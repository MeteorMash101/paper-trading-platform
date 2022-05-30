import React from "react";
import CandlestickChartTwoToneIcon from '@mui/icons-material/CandlestickChartTwoTone';
import ShowChartTwoToneIcon from '@mui/icons-material/ShowChartTwoTone';
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
          <ShowChartTwoToneIcon/>
        </Mode>
        <Mode name="CANDLESTICK" onClick={onGraphMode}>
          <CandlestickChartTwoToneIcon/> 
        </Mode>
      </div>
    </div>
  );
}

export default Legend;