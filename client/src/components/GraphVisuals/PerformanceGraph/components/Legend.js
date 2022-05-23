import React from "react";

const Legend = ({ data, selectedItems, onChange }) => (
  <div className="legend">
    {/* {data.map((d) => ( */}
      {/* // <div className="checkbox" style={{ color: d.color }} key={d.name}> */}
        {/* <h4>Performance Graph</h4> */}
        {/* <label>
          {d.name !== "Performance Graph" && (
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
        </label> */}
      {/* </div> */}
    {/* ))} */}
   </div>
);

export default Legend;