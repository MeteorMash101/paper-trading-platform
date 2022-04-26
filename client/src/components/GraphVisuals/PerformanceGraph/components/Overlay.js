/** Overlay.js */
import React from "react";
import PropTypes from "prop-types";

/**
 * Use Overlay as a wrapper for components that need mouse events to be handled.
 * For example: Tooltip, AxisX.
 */
const Overlay = React.forwardRef(({ width, height, children }, ref) => (
  <g>
    {children}
    <rect ref={ref} width={width} height={height} opacity={0} />
  </g>
));

Overlay.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
};

export default Overlay;
