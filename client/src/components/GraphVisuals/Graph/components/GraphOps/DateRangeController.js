import React from "react";
import { Fragment } from "react";

const DateRangeController = ({legendData, currDateRange, onChangeDateRange}) => {
  return (
    <Fragment>
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
    </Fragment>
  );
}

export default DateRangeController;