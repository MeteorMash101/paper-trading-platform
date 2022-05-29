import React from "react";
import { Fragment } from "react";

const DateRangeController = ({legendData, currDateRange, onChangeDateRange}) => {
  return (
    <Fragment>
      {legendData.map((d) => (
        <input
          className="dateRangeOpt"
          key={d.dateOpt}
          type="button"
          id={currDateRange == d.dateOpt ? "selected" : ""}
          value={d.dateOpt}
          onClick={() => onChangeDateRange(d.dateOpt)}
        />
      ))}
    </Fragment>
  );
}

export default DateRangeController;