import React, { useState } from "react";
import Label from "./Label";
import Option from "./Option";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareRootVariable,
  faSuperscript,
} from "@fortawesome/free-solid-svg-icons";
import { FUNCTION_NAMES, FUNCTION_TYPE } from "../../utils/algorithms";

interface FunctionName {
  verbose: string;
  name: string;
}

enum FunctionType {
  REGRESSION = "regression",
  SPLINE = "spline",
}

interface FunctionPickerProps {
  type: FUNCTION_TYPE;
  setFunction: (f: string) => void;
  style?: React.CSSProperties;
}

function FunctionPicker(props: FunctionPickerProps) {
  const [func, setFunction] = useState("");

  function clickFunction(f: string) {
    props.setFunction(f);
    setFunction(f);
  }
  function funcList() {
    const funcs: FunctionName[] = [];
    for (const f of FUNCTION_NAMES) {
      if (f.name.indexOf(props.type) !== -1) funcs.push(f);
    }
    return funcs;
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
        <Label text={"Fitting degree"}>
          <div style={iconStyle}>
            <FontAwesomeIcon icon={faSuperscript} size={"lg"} />
          </div>
        </Label>
        {funcList().map(({ name, verbose }) => {
          return (
            <Option
              key={name}
              color={"var(--blue-button-color)"}
              option={name}
              selected={func}
              onClick={() => clickFunction(name)}
            >
              <p>{verbose}</p>
            </Option>
          );
        })}
      </div>
    </div>
  );
}

export default FunctionPicker;
