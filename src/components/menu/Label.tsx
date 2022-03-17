import React from "react";
import { LINE_HEIGHT, FONT_SIZE, PADDING } from "./styles";

interface LabelProps {
  text: string;
  children?: JSX.Element;
}

function Label(props: LabelProps) {
  const labelWrapper: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: `${PADDING} 10px`,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--noto)",
    fontWeight: "bold",
    height: LINE_HEIGHT,
    fontSize: FONT_SIZE,
    padding: `${PADDING} 0px`,
  };

  return (
    <div style={labelWrapper}>
      <h3 style={labelStyle}>{props.text}</h3>
      {props.children}
    </div>
  );
}

export default Label;
