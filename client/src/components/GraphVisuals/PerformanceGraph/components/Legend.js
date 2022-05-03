import React from "react";

const Legend = ({ data, selectedItems, onChange }) => (
  <div className="legendContainer">
    {data.map((d) => (
      <div className="checkbox" style={{ color: d.color }} key={d.name}>
<<<<<<< HEAD:client/src/components/GraphVisuals/PerformanceGraph/components/Legend.js
        {/* <h4>Performance Graph</h4> */}
        {/* <label>
          {d.name !== "Performance Graph" && (
=======
        <label>
          {(
>>>>>>> 13583d02a01853d72174f63df22bbe89bdf052fc:client/src/components/Graph/components/Legend.js
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
        </label> */}
      </div>
    ))}
  </div>
);

export default Legend;