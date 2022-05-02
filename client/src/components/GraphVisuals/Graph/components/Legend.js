import React from "react";

const Legend = ({ legendData, selectedItems, currDateRange, onChange, labelMap }) => (
  <div className="legendContainer">
    <div className="dateRangeOptsContainer">
      {/* EDIT: temp buttons, will activate later. */}
      {(
        <input
          className="dateRangeOpt"
          id="notAvail"
          type="button"
          disabled
          value={"1D"}
        />
      )}
      {(
        <input
          className="dateRangeOpt"
          id="notAvail"
          type="button"
          disabled
          value={"1W"}
        />
      )}
      {legendData.map((d) => (
        <input
          className="dateRangeOpt"
          key={d.name}
          type="button"
          id= {currDateRange == d.name ? "selected" : ""}
          value={labelMap[d.name]}
          checked={selectedItems.includes(d.name)}
          onClick={() => onChange(d.name)}
        />
      ))}
    </div>
  </div>
);

export default Legend;