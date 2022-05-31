import React from "react";

const Legend = ({ legendData, currDateRange, onChangeDateRange}) => (
  <div className="legendContainer">
    <div className="dateRangeOptsContainer">
      {legendData.map((d) => (
        <input
          className="dateRangeOpt"
          key={d.name}
          type="button"
          id={currDateRange == d.name ? "selected" : ""}
          value={d.name}
          onClick={() => onChangeDateRange(d.name)}
        />
      ))}
    </div>
    {/* <button class="candleStickSwitch" name="GRAPH" onClick={onGraphMode}>Candlestick Mode</button> */}
  </div>
);

export default Legend;