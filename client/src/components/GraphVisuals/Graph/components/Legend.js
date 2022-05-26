import React from "react";
import { FcCandleSticks } from "react-icons/fc"
import { VscGraphLine } from "react-icons/vsc"

const Legend = ({ legendData, currDateRange, onChangeDateRange, onChangeShowGridlines, onChangeShowAxis, onChangeShowShade, onGraphMode }) => {
  return (
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
      {/* Graph Mode Options */}
      <div class="graphModeSwitchContainer">
        <button class="graphModeSwitch" name="CANDLESTICK" onClick={onGraphMode}>
          <FcCandleSticks class="svgLogo"/>
        </button>
        <button class="graphModeSwitch" name="GRAPH" onClick={onGraphMode}>
          <VscGraphLine class="svgLogo"/>
        </button>
      </div>
    </div>
  );
}

export default Legend;