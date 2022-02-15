import React from "react";

interface NavBarProps {
  style?: React.CSSProperties;
}

function NavBar(props: NavBarProps) {
  const barStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "var(--primary-color)",
    borderBottom: "solid 1px rgb(0,0,0, 0.3)",
  };

  return (
    <div style={props.style}>
      <div style={barStyle}></div>
    </div>
  );
}

export default NavBar;
