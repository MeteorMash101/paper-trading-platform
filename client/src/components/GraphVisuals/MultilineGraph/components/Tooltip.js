import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { MultiLineDataPropTypes } from "../utils/propTypes";
import { formatPercent, formatPriceUSD } from "../utils/commonUtils";
import { useContext } from 'react';
import HoverInfoContext from "../../../../store/hover-info-context";

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
  const hoverInfoContext = useContext(HoverInfoContext);
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

  // Assign proper date time format:
  const dateTimeFormat1D = (x) => { return d3.timeFormat("%I:%M %p")(xScale.invert(x))}
  const dateTimeFormat1W = (x) => { return d3.timeFormat("%b %d, %I:%M %p")(xScale.invert(x)) }
  const dateTimeFormat1M = (x) => { return d3.timeFormat("%b %d, %I:%M %p")(xScale.invert(x)) }
  const dateTimeFormat3M = (x) => { return d3.timeFormat("%b %d, %Y")(xScale.invert(x)) }
  const dateTimeFormat6M = (x) => { return d3.timeFormat("%b %d, %Y")(xScale.invert(x)) }
  const dateTimeFormat1Y = (x) => { return d3.timeFormat("%b %d, %Y")(xScale.invert(x)) }
  const dateTimeFormat5Y = (x) => { return d3.timeFormat("%b %d, %Y")(xScale.invert(x)) }

  let dateTimeFormat = ""
  switch(data[0].name) {
    case "1D":
      dateTimeFormat = dateTimeFormat1D
      break;
    case "1W":
      dateTimeFormat = dateTimeFormat1W
      break;
    case "1M":
      dateTimeFormat = dateTimeFormat1M
      break;
    case "3M":
      dateTimeFormat = dateTimeFormat3M
      break;
    case "6M":
      dateTimeFormat = dateTimeFormat6M
      break;
    case "1Y":
      dateTimeFormat = dateTimeFormat1Y
      break;
    case "5Y":
      dateTimeFormat = dateTimeFormat5Y
      break;
    default: // safety
      dateTimeFormat = dateTimeFormat5Y
  }

  const drawContent = React.useCallback(
    (x) => {
      const tooltipContent = d3.select(ref.current).select(".tooltipContent");
      tooltipContent.attr("transform", (cur, i, nodes) => {
        const nodeWidth = nodes[i]?.getBoundingClientRect()?.width || 0;
        const translateX = nodeWidth + x > width ? x - nodeWidth - 5 : x + 10;
        return `translate(${translateX}, ${-margin.top + 15})`;
      });
      tooltipContent
        .select(".contentTitle")
        .text(dateTimeFormat(x));
    },
    [xScale, margin, width]
  );

  const drawBackground = React.useCallback(() => {
    // reset background size to defaults
    const contentBackground = d3
      .select(ref.current)
      .select(".contentBackground");
    contentBackground.attr("width", 150).attr("height", 40);

    // calculate new background size
    const tooltipContentElement = d3
      .select(ref.current)
      .select(".tooltipContent")
      .node();
    if (!tooltipContentElement) return;

    const contentSize = tooltipContentElement.getBoundingClientRect();
    contentBackground
      .attr("width", contentSize.width + 15)
      .attr("height", contentSize.height + 4);
  }, []);

  const onChangePosition = React.useCallback((d, i, isVisible) => {
    d3.selectAll(".performanceItemValue")
      .filter((td, tIndex) => tIndex === i)
      // EDIT: original below
      .text(isVisible ? d.volume : "");
      // .text(isVisible ? formatPercent(d.volume) : "");

    d3.selectAll(".performanceItemMarketValue")
      .filter((td, tIndex) => tIndex === i)
      .text(
        d.open && !isVisible ? "No data" : formatPriceUSD(d.open)
      );

    // Update price using context API here...(to show change w/ price.)
    // console.log("[Tooltip.js]: PRICE RN: ", formatPriceUSD(d.open));
    hoverInfoContext.setPrice(formatPriceUSD(d.open))

    const maxNameWidth = d3.max(
      d3.selectAll(".performanceItemName").nodes(),
      (node) => node.getBoundingClientRect().width
    );
    d3.selectAll(".performanceItemValue").attr(
      "transform",
      (datum, index, nodes) =>
        `translate(${
          nodes[index].previousSibling.getBoundingClientRect().width + 17
        },4)`
    );

    d3.selectAll(".performanceItemMarketValue").attr(
      "transform",
      `translate(${maxNameWidth + 80},4)`
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
        if (d.date === undefined && d.open === undefined) {
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
        const yPos = yScale(d.open);

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
        <rect className="contentBackground" rx={7} ry={7} opacity={0.2} />
        {/* EDIT: below date as a title */}
        <text className="contentTitle" transform="translate(4,14)" />
        <g className="content" transform="translate(4,32)">
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



// [DEPRECIATED]

// return (
//   <g ref={ref} opacity={0} {...props}>
//     <line className="tooltipLine" />
//     <g className="tooltipContent">
//       <rect className="contentBackground" rx={7} ry={7} opacity={0.2} />
//       {/* EDIT: below date as a title */}
//       <text className="contentTitle" transform="translate(4,14)" />
//       <g className="content" transform="translate(4,32)">
//         {data.map(({ name, color, date, time }, i) => (
//           <g key={name} transform={`translate(6,${22 * i})`}>
//             {/* EDIT: below was circle + date range */}
//             {/* <circle r={6} fill={color} />
//             <text className="performanceItemName" transform="translate(10,4)">
//               {name}
//             </text> */}
//             {/* EDIT: below was showing the stock volume */}
//             {/* <text
//               className="performanceItemValue"
//               opacity={0.5}
//               fontSize={10}
//             /> */}
//             {/* EDIT: below was just the stock price */}
//             {/* <text className="performanceItemMarketValue" /> */}
//           </g>
//         ))}
//       </g>
//     </g>
//     {data.map(({ name }) => (
//       <circle className="tooltipLinePoint" r={6} key={name} opacity={0} />
//     ))}
//   </g>
// );
// };