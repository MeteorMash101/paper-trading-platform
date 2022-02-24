import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { MultiLineDataPropTypes } from "../utils/propTypes";
import { formatPercent, formatPriceUSD } from "../utils/commonUtils";

const Tooltip = ({
  xScale,
  yScale,
  width,
  height,
  data,
  margin,
  anchorEl,
  children,
  ...props
}) => {
  const ref = React.useRef(null);
  const drawLine = React.useCallback(
    (x) => {
      d3.select(ref.current)
        .select(".tooltipLine")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", -margin.top)
        .attr("y2", height);
    },
    [ref, height, margin]
  );

  const drawContent = React.useCallback(
    (x) => {
      const tooltipContent = d3.select(ref.current).select(".tooltipContent");
      tooltipContent.attr("transform", (cur, i, nodes) => {
        const nodeWidth = nodes[i]?.getBoundingClientRect()?.width || 0;
        const translateX = nodeWidth + x > width ? x - nodeWidth - 12 : x + 8;
        return `translate(${translateX}, ${-margin.top})`;
      });
      tooltipContent
        .select(".contentTitle")
        .text(d3.timeFormat("%b %d, %Y")(xScale.invert(x)));
    },
    [xScale, margin, width]
  );

  const drawBackground = React.useCallback(() => {
    // reset background size to defaults
    const contentBackground = d3
      .select(ref.current)
      .select(".contentBackground");
    contentBackground.attr("width", 125).attr("height", 40);

    // calculate new background size
    const tooltipContentElement = d3
      .select(ref.current)
      .select(".tooltipContent")
      .node();
    if (!tooltipContentElement) return;

    const contentSize = tooltipContentElement.getBoundingClientRect();
    contentBackground
      .attr("width", contentSize.width + 8)
      .attr("height", contentSize.height + 4);
  }, []);

  const onChangePosition = React.useCallback((d, i, isVisible) => {
    d3.selectAll(".performanceItemValue")
      .filter((td, tIndex) => tIndex === i)
      .text(isVisible ? formatPercent(d.value) : "");
    d3.selectAll(".performanceItemMarketValue")
      .filter((td, tIndex) => tIndex === i)
      .text(
        d.marketvalue && !isVisible ? "No data" : formatPriceUSD(d.marketvalue)
      );

    const maxNameWidth = d3.max(
      d3.selectAll(".performanceItemName").nodes(),
      (node) => node.getBoundingClientRect().width
    );
    d3.selectAll(".performanceItemValue").attr(
      "transform",
      (datum, index, nodes) =>
        `translate(${
          nodes[index].previousSibling.getBoundingClientRect().width + 14
        },4)`
    );

    d3.selectAll(".performanceItemMarketValue").attr(
      "transform",
      `translate(${maxNameWidth + 60},4)`
    );
  }, []);

  const followPoints = React.useCallback(() => {
    const [x] = d3.mouse(anchorEl);
    const xDate = xScale.invert(x);
    const bisectDate = d3.bisector((d) => d.date).left;
    let baseXPos = 0;

    // draw circles on line
    d3.select(ref.current)
      .selectAll(".tooltipLinePoint")
      .attr("transform", (cur, i) => {
        const index = bisectDate(data[i].items, xDate, 1);
        const d0 = data[i].items[index - 1];
        const d1 = data[i].items[index];
        const d = xDate - d0?.date > d1?.date - xDate ? d1 : d0;
        if (d.date === undefined && d.value === undefined) {
          // move point out of container
          return "translate(-100,-100)";
        }
        const xPos = xScale(d.date);
        if (i === 0) {
          baseXPos = xPos;
        }

        let isVisible = true;
        if (xPos !== baseXPos) {
          isVisible = false;
        }
        const yPos = yScale(d.value);

        onChangePosition(d, i, isVisible);

        return isVisible
          ? `translate(${xPos}, ${yPos})`
          : "translate(-100,-100)";
      });

    drawLine(baseXPos);
    drawContent(baseXPos);
    drawBackground();
  }, [
    anchorEl,
    drawLine,
    drawContent,
    drawBackground,
    xScale,
    yScale,
    data,
    onChangePosition
  ]);

  React.useEffect(() => {
    d3.select(anchorEl)
      .on("mouseout.tooltip", () => {
        d3.select(ref.current).attr("opacity", 0);
      })
      .on("mouseover.tooltip", () => {
        d3.select(ref.current).attr("opacity", 1);
      })
      .on("mousemove.tooltip", () => {
        d3.select(ref.current)
          .selectAll(".tooltipLinePoint")
          .attr("opacity", 1);
        followPoints();
      });
  }, [anchorEl, followPoints]);

  if (!data.length) return null;

  return (
    <g ref={ref} opacity={0} {...props}>
      <line className="tooltipLine" />
      <g className="tooltipContent">
        <rect className="contentBackground" rx={4} ry={4} opacity={0.2} />
        <text className="contentTitle" transform="translate(4,14)" />
        <g className="content" transform="translate(4,32)">
          {data.map(({ name, color }, i) => (
            <g key={name} transform={`translate(6,${22 * i})`}>
              <circle r={6} fill={color} />
              <text className="performanceItemName" transform="translate(10,4)">
                {name}
              </text>
              <text
                className="performanceItemValue"
                opacity={0.5}
                fontSize={10}
              />
              <text className="performanceItemMarketValue" />
            </g>
          ))}
        </g>
      </g>
      {data.map(({ name }) => (
        <circle className="tooltipLinePoint" r={6} key={name} opacity={0} />
      ))}
    </g>
  );
};

Tooltip.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number
  }),
  data: MultiLineDataPropTypes,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  anchorEl: PropTypes.instanceOf(Element)
};

Tooltip.defaultProps = {
  width: 0,
  height: 0,
  margin: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  data: [],
  anchorEl: null
};

export default Tooltip;
