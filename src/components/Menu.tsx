import React, { useState } from "react";
import CursorMode from "./menu/CursorMode";
import FunctionPicker from "./menu/FunctionPicker";
import TypePicker from "./menu/TypePicker";
import { CURSOR_MODE } from "./PlotWindow";
import { FUNCTION_NAMES, FUNCTION_TYPE } from "../utils/algorithms/index";

interface MenuProps {
  setMode: (m: CURSOR_MODE) => void;
  setFunction: (f: string) => void;
  style?: React.CSSProperties;
}

function Menu(props: MenuProps) {
  const [type, setType] = useState(FUNCTION_TYPE.SPLINE);

  const relative: React.CSSProperties = {
    position: "relative",
    margin: "auto 0px",
  };
  return (
    <div style={props.style}>
      <div style={relative}>
        <CursorMode setMode={props.setMode} />
        <TypePicker setType={setType} />
        <FunctionPicker setFunction={props.setFunction} type={type} />
      </div>
    </div>
  );
}

export default Menu;
