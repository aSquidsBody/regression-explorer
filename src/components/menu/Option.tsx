import { useState } from "react";
import { OPTION_HEIGHT, OPTION_FONT_SIZE, OPTION_WIDTH } from "./styles";

interface OptionProps<T> {
  option: T;
  selected: T;
  text: string;
  minWidth?: number;
  color: string;
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
  const optionWrapper = (): React.CSSProperties => ({
    position: "relative",
    margin: "0px 5px",
    height: OPTION_HEIGHT,
    minWidth: props.minWidth ? props.minWidth.toString() + "px" : OPTION_WIDTH,
    background: pressed
      ? "var(--pressed-color)"
      : selected()
      ? "var(--primary-color)"
      : hover
      ? "var(--primary-color-opaque)"
      : "#e0e0e0",
    color: selected() ? "white" : "black",
    fontWeight: selected() ? "normal" : "bold",
    fontSize: selected()
      ? `calc(${OPTION_FONT_SIZE} + 0.06rem)`
      : OPTION_FONT_SIZE,
    cursor: "pointer",
    border: "none",
    borderRadius: "12px",
    transition: "background 0.05s",
  });

  const optionStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: "var(--noto)",
    lineHeight: OPTION_HEIGHT,
  };

  return (
    <button
      style={optionWrapper()}
      onMouseDown={mouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={optionStyle}>{props.text}</div>
    </button>
  );
}

export default Option;
