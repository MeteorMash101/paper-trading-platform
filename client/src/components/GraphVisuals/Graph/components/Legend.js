import React from "react";

const Legend = ({ legendData, currDateRange, onChangeDateRange, onChangeShowGridlines, onChangeShowAxis, onChangeShowShade, onGraphMode }) => (
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
    <div class="switchContainer">
      <div class="switchElement">
        <label class="switchLabel">Gridlines</label>
        <label class="switch">
          <input type="checkbox" onChange={onChangeShowGridlines}/>
          <span class="slider round"></span>
        </label>
      </div>
      <div class="switchElement">
        <label class="switchLabel">Axis</label>
        <label class="switch">
          <input type="checkbox" onChange={onChangeShowAxis}/>
          <span class="slider round"></span>
        </label>
      </div>
      <div class="switchElement">
        <label class="switchLabel">Shade</label>
        <label class="switch">
          {/* EDIT: checked by default breaks...? */}
          <input type="checkbox" onChange={onChangeShowShade}/>
          <span class="slider round"></span>
        </label>
      </div>
      <div class="switchElement">
        <label class="switchLabel">Volume</label>
        <label class="switch">
          <input type="checkbox" checked/>
          <span class="slider round" id="NOTAVAIL"></span>
        </label>
      </div>
      <div class="switchElement">
        <label class="switchLabel">Color Code</label>
        <label class="switch">
          <input type="checkbox" checked/>
          <span class="slider round" id="NOTAVAIL"></span>
        </label>
      </div>
    </div>
    <button class="candleStickSwitch" name="GRAPH" onClick={onGraphMode}>Candlestick Mode</button>
  </div>
);

export default Legend;