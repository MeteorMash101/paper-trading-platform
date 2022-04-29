import React from "react";

const Legend = ({ legendData, selectedItems, onChange }) => (
  <div className="legendContainer">
    {legendData.map((d) => (
      <div className="checkbox" style={{ color: d.color }} key={d.name}>
        <label>
          {(
            <input
              type="checkbox"
              // type="button"
              value={d.name}
              checked={selectedItems.includes(d.name)}
              onChange={() => onChange(d.name)}
              // onClick={() => onClick(d.name)}
            />
          )}
          {d.name}
        </label>
      </div>
    ))}
  </div>
);

export default Legend;