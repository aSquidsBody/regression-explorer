import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import { CURSOR_MODE } from "../PlotWindow";
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

  const row: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
  };

  const iconStyle: React.CSSProperties = {
    height: "1.9rem",
    padding: `0px 0.5rem`,
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={props.style}>
      <div style={row}>
        <Label text={"Cursor Mode"}>
          <div style={iconStyle}>
            <FontAwesomeIcon icon={faArrowPointer} size={"lg"} />
          </div>
        </Label>
      </div>
      <div style={row}>
        <Option
          key={CURSOR_MODE.MOVE}
          color={"var(--primary-color)"}
          option={CURSOR_MODE.MOVE}
          selected={mode}
          onClick={onClick}
          text={"Move Screen"}
        />
        <Option
          key={CURSOR_MODE.POINT}
          color={"var(--green-button-color)"}
          option={CURSOR_MODE.POINT}
          selected={mode}
          onClick={onClick}
          text={"Add Point"}
        />
        <Option
          key={CURSOR_MODE.DELETE}
          color={"var(--green-button-color)"}
          option={CURSOR_MODE.DELETE}
          selected={mode}
          onClick={onClick}
          text={"Delete Point"}
        />
      </div>
    </div>
  );
}

export default CursorMode;
