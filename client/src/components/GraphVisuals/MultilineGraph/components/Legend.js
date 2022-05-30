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
    </div>
  );
}

export default Legend;