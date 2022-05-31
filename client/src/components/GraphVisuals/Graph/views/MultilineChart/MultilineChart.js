/** MultilineChart.js */
import React from "react";
import PropTypes from "prop-types";
import { MultiLineDataPropTypes } from "../../utils/propTypes";
import { Line, Axis, GridLine, Overlay, Tooltip, Area } from "../../components";
import useController from "./MultilineChart.controller";
import useDimensions from "../../utils/useDimensions";
import { COLOR_CODES } from "../../../../../globals"

const MultilineChart = ({ data = [], onHover, margin = {}, showGridlines, showAxis, showShade, trendColor, showColorCode, }) => {
  const color = showColorCode ? trendColor : COLOR_CODES.NEUTRAL;
  const overlayRef = React.useRef(null);
  const [containerRef, { svgWidth, svgHeight, width, height }] = useDimensions({
    maxHeight: 400,
    margin
    // EDIT: changing margin here can fix the graph container constraint problem!
    // margin: {
    //   left: 55,
    //   right: 15,
    //   top: 5,
    //   bottom: 5
    // }
  });
  const controller = useController({ data, width, height });
  const {
    yTickFormat,
    xTickFormat,
    xScale,
    yScale,
    yScaleForAxis
  } = controller;
  console.log("[Graph.js MultilineChart]:", data)
  return (
    <div ref={containerRef}>
      <svg width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* NOTE: gridlines thing below? */}
          {showGridlines && 
            <GridLine
              className="yAxisGridLine"
              type="vertical"
              scale={xScale}
              ticks={5}
              size={height}
              transform={`translate(0, ${height})`}
            />
          }
          {showGridlines &&
            <GridLine
              className="xAxisGridLine"
              type="horizontal"
              scale={yScaleForAxis}
              ticks={2}
              size={width}
            />
          }
          {showGridlines &&
            <GridLine
              type="horizontal"
              className="baseGridLine"
              scale={yScale}
              ticks={1}
              size={width}
              disableAnimation
            />
          }
          {data.map(({ name, items = [] }) => (
            <Line
              key={name}
              data={items}
              xScale={xScale}
              yScale={yScale}
              color={color}
            />
          ))}
          {/* NOTE: shaders below */}
          {showShade && <Area data={data[0].items} xScale={xScale} yScale={yScale} trendColor={trendColor} showColorCode={showColorCode}/>}
          <Overlay onHover={onHover} ref={overlayRef} width={width} height={height}>
            {/* NOTE: y-axis labels below */}
            {showAxis && 
              <Axis
                type="left"
                className="axisY"
                scale={yScale}
                transform="translate(0, -10)"
                ticks={5}
                tickFormat={yTickFormat}
              />
            }
            {/* NOTE: x-axis labels below */}
            {showAxis && 
              <Axis
                type="bottom"
                className="axisX"
                anchorEl={overlayRef.current}
                scale={xScale}
                transform={`translate(10, ${height - height / 6})`}
                ticks={5}
                tickFormat={xTickFormat}
              />
            }
            <Tooltip
              className="tooltip"
              anchorEl={overlayRef.current}
              width={width}
              height={height}
              margin={margin}
              xScale={xScale}
              yScale={yScale}
              data={data}
            />
          </Overlay>
        </g>
      </svg>
    </div>
  );
};

MultilineChart.propTypes = {
  data: MultiLineDataPropTypes,
  margin: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number
  })
};

MultilineChart.defaultProps = {
  data: [],
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
};

export default MultilineChart;
