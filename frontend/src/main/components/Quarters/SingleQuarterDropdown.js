import React, { useState } from "react";
import { Form } from "react-bootstrap";
// controlId is used to remember the value for localStorage,
// and for the testId, so it should be unique to at least any
// given page where the component is used.

// quarter and setQuarter should be values returned
// by a parent component's setState

// quarters is an array of objects in this format
// [{ yyyyq :"20214", qyy: "F21"},
//  { yyyyq :"20221", qyy: "W22"},
//  { yyyyq :"20222", qyy: "S22"}]
function SingleQuarterDropdown({
  quarter,
  quarters,
  setQuarter,
  controlId,
  onChange = null,
  label = "Quarter",
}) {
  const localSearchQuarter = localStorage.getItem(controlId);
  const lastIndex = quarters.length - 1;
  const defaultQuarter = quarters[lastIndex].yyyyq;

  if (!localSearchQuarter) {
    localStorage.setItem(controlId, defaultQuarter);
  }

  const [quarterState, setQuarterState] = useState(
    quarter.yyyq || localSearchQuarter || defaultQuarter,
  );

  const handleQuarterOnChange = (event) => {
    const selectedQuarter = event.target.value;
    localStorage.setItem(controlId, selectedQuarter);
    setQuarterState(selectedQuarter);
    setQuarter(selectedQuarter);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={quarterState}
        onChange={handleQuarterOnChange}
      >
        {quarters.map(function (object, i) {
          const key = `${controlId}-option-${i}`;
          return (
            <option key={key} data-testid={key} value={object.yyyyq}>
              {object.qyy}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
}

export default SingleQuarterDropdown;
