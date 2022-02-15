import React, { useState } from "react";
import Label from "./Label";
import Option from "./Option";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareRootVariable,
  faSuperscript,
} from "@fortawesome/free-solid-svg-icons";
import { FUNCTION_NAMES, FUNCTION_TYPE } from "../../utils/algorithms";

interface TypePickerProps {
  setType: (f: FUNCTION_TYPE) => void;
  style?: React.CSSProperties;
}

function TypePicker(props: TypePickerProps) {
  const [type, setType] = useState(FUNCTION_TYPE.SPLINE);

  function clickType(t: FUNCTION_TYPE) {
    props.setType(t);
    setType(t);
  }

  const iconStyle: React.CSSProperties = {
    paddingLeft: "0.5rem",
    height: "1.9rem",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={props.style}>
      <div>
        <Label text={"Fitting function"}>
          <div style={iconStyle}>
            <FontAwesomeIcon icon={faSquareRootVariable} size={"lg"} />
          </div>
        </Label>
        <Option
          key={FUNCTION_TYPE.SPLINE}
          color={"var(--blue-button-color)"}
          option={FUNCTION_TYPE.SPLINE}
          selected={type}
          onClick={clickType}
        >
          <p>{"Spline"}</p>
        </Option>
        <Option
          key={FUNCTION_TYPE.REGRESSION}
          color={"var(--blue-button-color)"}
          option={FUNCTION_TYPE.REGRESSION}
          selected={type}
          onClick={clickType}
        >
          <p>{"Regression"}</p>
        </Option>
      </div>
    </div>
  );
}

export default TypePicker;
