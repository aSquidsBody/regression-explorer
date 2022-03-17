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
  const [type, setType] = useState(FUNCTION_TYPE.REGRESSION);

  const relative: React.CSSProperties = {
    display: "flex",
    position: "relative",
    height: "100%",
    overflowX: "hidden",
    overflowY: "hidden",
  };

  const section: React.CSSProperties = {
    height: "100%",
  };
  return (
    <div style={props.style} id="menu">
      <div style={relative}>
        <MenuSection>
          <CursorMode setMode={props.setMode} style={section} />
        </MenuSection>
        <MenuSection>
          <TypePicker setType={setType} style={section} />
        </MenuSection>
        <MenuSection>
          <FunctionPicker
            setFunction={props.setFunction}
            type={type}
            style={section}
          />
        </MenuSection>
      </div>
    </div>
  );
}

interface MenuSectionProps {
  children?: JSX.Element;
}

function MenuSection(props: MenuSectionProps) {
  const style: React.CSSProperties = {
    margin: "10px",
    padding: "5px 10px",
    height: "calc(100% - 20px)",
    background: "#f0f0f0",
    borderRadius: "20px",
    boxShadow: "0px 0px 2px 0px #00000033",
  };
  return <div style={style}>{props.children}</div>;
}

export default Menu;
