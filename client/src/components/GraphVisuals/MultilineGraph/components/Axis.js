/** AxisX.js */
import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

const Axis = ({
  type,
  scale,
  ticks,
  transform,
  tickFormat,
  disableAnimation,
  anchorEl,
  ...props
}) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const axisGenerator = type === "left" ? d3.axisRight : d3.axisBottom;
    const axis = axisGenerator(scale).ticks(ticks).tickFormat(tickFormat);
    const axisGroup = d3.select(ref.current);
    if (disableAnimation) {
      axisGroup.call(axis);
    } else {
      axisGroup.transition().duration(750).ease(d3.easeLinear).call(axis);
    }
    axisGroup.select(".domain").remove();
    axisGroup.selectAll("line").remove();
    axisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "white")
      .attr("font-size", "0.75rem");
  }, [scale, ticks, tickFormat, disableAnimation]);

  React.useEffect(() => {
    d3.select(anchorEl)
      .on("mouseout.axisX", () => {
        d3.select(ref.current)
          .selectAll("text")
          .attr("opacity", 0.5)
          .style("font-weight", "normal");
      })
      .on("mousemove.axisX", () => {
        const [x] = d3.mouse(anchorEl);
        const xDate = scale.invert(x);
        const textElements = d3.select(ref.current).selectAll("text");
        const data = textElements.data();
        const index = d3.bisector((d) => d).left(data, xDate);
        textElements
          .attr("opacity", (d, i) => (i === index - 1 ? 1 : 0.5))
          .style("font-weight", (d, i) =>
            i === index - 1 ? "bold" : "normal"
          );
      });
  }, [anchorEl, scale]);

  return <g ref={ref} transform={transform} {...props} />;
};

Axis.propTypes = {
  type: PropTypes.oneOf(["left", "bottom"]).isRequired,
  scale: PropTypes.func.isRequired,
  ticks: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  tickFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  transform: PropTypes.string,
  disableAnimation: PropTypes.bool,
  anchorEl: PropTypes.instanceOf(Element)
};

Axis.defaultProps = {
  ticks: 0,
  tickFormat: null,
  transform: "",
  disableAnimation: false,
  anchorEl: null
};

export default Axis;
