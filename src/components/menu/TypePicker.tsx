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
  const [type, setType] = useState(FUNCTION_TYPE.REGRESSION);

  function clickType(t: FUNCTION_TYPE) {
    props.setType(t);
    setType(t);
  }

  const row: React.CSSProperties = {
    display: "flex",
    height: "50%",
  };

  const iconStyle: React.CSSProperties = {
    paddingLeft: "0.5rem",
    height: "1.9rem",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={props.style}>
      <div style={row}>
        <Label text={"Fit Type"}>
          <div style={iconStyle}>
            <FontAwesomeIcon icon={faSquareRootVariable} size={"lg"} />
          </div>
        </Label>
      </div>
      <div style={row}>
        <Option
          key={FUNCTION_TYPE.REGRESSION}
          color={"var(--blue-button-color)"}
          option={FUNCTION_TYPE.REGRESSION}
          selected={type}
          onClick={clickType}
          text={"Regression"}
        />
        <Option
          key={FUNCTION_TYPE.SPLINE}
          color={"var(--blue-button-color)"}
          option={FUNCTION_TYPE.SPLINE}
          selected={type}
          onClick={clickType}
          text={"Spline"}
        />
      </div>
    </div>
  );
}

export default TypePicker;
