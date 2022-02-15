import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import { CURSOR_MODE } from "../PlotWindow";
import { HEIGHT, LINE_HEIGHT, PADDING } from "./styles";
import Option from "./Option";
import Label from "./Label";

interface CursorModeProps {
  setMode: (mode: CURSOR_MODE) => void;
  style?: React.CSSProperties;
}

function CursorMode(props: CursorModeProps) {
  const [mode, setMode] = useState(CURSOR_MODE.MOVE);

  function onClick(m: CURSOR_MODE) {
    props.setMode(m);
    setMode(m);
  }

  const component: React.CSSProperties = {
    display: "inline-flex",
  };

  const iconStyle: React.CSSProperties = {
    height: "1.9rem",
    padding: `${PADDING} 0px ${PADDING} 0.5rem`,
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={props.style}>
      <div style={component}>
        <Label text={"Cursor mode"} helpText={labelText}>
          <div style={iconStyle}>
            <FontAwesomeIcon icon={faArrowPointer} size={"lg"} />
          </div>
        </Label>
        <Option
          key={CURSOR_MODE.MOVE}
          color={"var(--green-button-color)"}
          option={CURSOR_MODE.MOVE}
          selected={mode}
          onClick={onClick}
          helpText={moveText}
        >
          <p>Move Screen</p>
        </Option>
        <Option
          key={CURSOR_MODE.POINT}
          color={"var(--green-button-color)"}
          option={CURSOR_MODE.POINT}
          selected={mode}
          onClick={onClick}
          helpText={pointText}
        >
          <p>Add Point</p>
        </Option>
      </div>
    </div>
  );
}

const labelText = "Choose what happens when you click the graph";
const moveText = "Move around the graph window by click+dragging the plot";
const pointText = "Create points by clicking on the graph";

export default CursorMode;
