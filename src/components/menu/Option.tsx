import { useState } from "react";
import {
  FONT_SIZE,
  HEIGHT,
  LINE_HEIGHT,
  OPTION_FONT_SIZE,
  PADDING,
} from "./styles";

interface OptionProps<T> {
  key: string;
  option: T;
  selected: T;
  minWidth?: number;
  color: string;
  helpText?: string;
  children?: JSX.Element;
  onClick: (m: T) => void;
}

function Option<T>(props: OptionProps<T>) {
  const [pressed, setPressed] = useState(false);
  const [hover, setHover] = useState(false);

  function mouseDown() {
    setPressed(true);
    document.onmouseup = mouseUp;
  }

  function mouseUp() {
    document.onmouseup = null;
    setPressed(false);

    props.onClick(props.option);
  }

  function selected() {
    return props.selected === props.option;
  }

  function showModal() {
    if (!props.helpText || !hover) return false;
    return true;
  }

  const optionWrapper = (): React.CSSProperties => ({
    position: "relative",
    display: "inline-flex",
    padding: `${PADDING} 10px`,
    height: HEIGHT,
    borderBottom: pressed ? "solid 1px grey" : "",
    borderLeft: pressed ? "solid 1px grey" : "solid 1px black",
    borderRight: pressed ? "solid 1px grey" : "",
    background: selected() ? props.color : "#e4e4e4",
    minWidth: props.minWidth ? props.minWidth.toString() + "px" : "108px",
    verticalAlign: "top",
    boxShadow: pressed ? "0 0 0 white" : "4px 2px 4px 1px gray",
    borderTop: pressed ? "solid 1px grey" : "solid 1px black",
    cursor: "pointer",
  });

  const optionStyle: React.CSSProperties = {
    width: "100%",
    textAlign: "center",
    fontFamily: "var(--noto)",
    fontWeight: "bold",
    height: LINE_HEIGHT,
    fontSize: OPTION_FONT_SIZE,
    padding: `${PADDING} 0px`,
  };

  const modal: React.CSSProperties = {
    // display: hover ? "" : "none",
    opacity: showModal() ? 1 : 0,
    zIndex: showModal() ? 1 : -1,
    pointerEvents: "none",
    position: "absolute",
    left: "-20%",
    bottom: "-40px",
    width: "140%",
    background: "white",
    fontSize: "0.8rem",
    border: "solid 1px black",
    borderRadius: "6px",
    transition: "opacity 0.01s linear",
    transitionDelay: showModal() ? "0.75s" : "",
  };

  return (
    <button
      key={props.key}
      style={optionWrapper()}
      onMouseDown={mouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p style={optionStyle}>{props.children}</p>
      <div style={modal}>{props.helpText}</div>
    </button>
  );
}

export default Option;
