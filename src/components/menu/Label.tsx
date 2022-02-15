import React, { useState } from "react";
import { HEIGHT, LINE_HEIGHT, FONT_SIZE, PADDING } from "./styles";

interface LabelProps {
  text: string;
  helpText?: string;
  children?: JSX.Element;
}

function Label(props: LabelProps) {
  const [hover, setHover] = useState(false);

  function showModal() {
    if (!props.helpText || !hover) return false;
    return true;
  }

  const labelWrapper: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: `${PADDING} 10px`,
    border: "solid 1px black",
    background: "#f4f4f4",
    height: HEIGHT,
    minWidth: "177px",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--noto)",
    fontWeight: "bold",
    height: LINE_HEIGHT,
    fontSize: FONT_SIZE,
    padding: `${PADDING} 0px`,
  };

  const modal: React.CSSProperties = {
    // display: hover ? "" : "none",
    opacity: showModal() ? 1 : 0,
    zIndex: showModal() ? 1 : -1,
    position: "absolute",
    left: "0%",
    bottom: "-40px",
    maxHeight: "100%",
    width: "100%",
    background: "white",
    fontSize: "0.8rem",
    fontFamily: "var(--noto)",
    border: "solid 1px black",
    borderRadius: "6px",
    transition: "opacity 0.01s linear",
    transitionDelay: showModal() ? "0.75s" : "",
  };

  return (
    <div
      style={labelWrapper}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h3 style={labelStyle}>{props.text}</h3>
      {props.children}
      <div style={modal}>{props.helpText}</div>
    </div>
  );
}

export default Label;
