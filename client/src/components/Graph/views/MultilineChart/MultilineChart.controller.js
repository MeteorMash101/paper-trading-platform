/** MultilineChart.controller.js */
import { useMemo } from "react";
import * as d3 from "d3";

const useController = ({ data, width, height }) => {
  const xMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ date }) => date)),
    [data]
  );

  const xMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ date }) => date)),
    [data]
  );

  const xScale = useMemo(
    () => d3.scaleTime().domain([xMin, xMax]).range([0, width]),
    [xMin, xMax, width]
  );

  const yMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ value }) => value)),
    [data]
  );

  const yMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ value }) => value)),
    [data]
  );

  const yScale = useMemo(() => {
    const indention = (yMax - yMin) * 0.5;
    return d3
      .scaleLinear()
      .domain([yMin - indention, yMax + indention])
      .range([height, 0]);
  }, [height, yMin, yMax]);

  const yScaleForAxis = useMemo(
    () => d3.scaleBand().domain([yMin, yMax]).range([height, 0]),
    [height, yMin, yMax]
  );

  const yTickFormat = (d) =>
    `${parseFloat(d) > 0 ? "+" : ""}${d3.format(".2%")(d / 100)}`;

  const xTickFormat = (d) => {
    if (d3.timeFormat("%b")(d) === "Jan") {
      return d3.timeFormat("%Y")(d);
    }
    return d3.timeFormat("%b")(d);
  };
  return {
    yTickFormat,
    xScale,
    yScale,
    yScaleForAxis,
    xTickFormat
  };
};

export default useController;
