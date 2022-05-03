import React from "react";

const Legend = ({ legendData, selectedItems, currDateRange, onChange, labelMap }) => (
  <div className="legendContainer">
    <div className="dateRangeOptsContainer">
      {legendData.map((d) => (
        <input
          className="dateRangeOpt"
          key={d.name}
          type="button"
          id={currDateRange == d.name ? "selected" : ""}
          value={d.name}
          onClick={() => onChange(d.name)}
        />
      ))}
    </div>
  </div>
);

export default Legend;