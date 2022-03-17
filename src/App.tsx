import React, { useState } from "react";
import PlotWindow, { CURSOR_MODE } from "./components/PlotWindow";
import NavBar from "./components/NavBar";
import Menu from "./components/Menu";

import "./App.css";
import Tutorial from "./components/Tutorial";
import { FUNCTION_NAMES } from "./utils/algorithms";

function App() {
  const [mode, setMode] = useState(CURSOR_MODE.MOVE);
  const [func, setFunction] = useState(FUNCTION_NAMES[0].name);
  const [showTutorial, setShowTutorial] = useState(true);

  // style
  const appStyle: React.CSSProperties = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };
  const navbarStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "44px",
    zIndex: 1,
  };

  const menuStyle: React.CSSProperties = {
    width: "100%",
    borderBottom: "solid 1px black",
    boxShadow: "2px 0px 20px 0px #888",
  };

  const canvasStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    maxHeight: "100vh",
    maxWidth: "100vw",
    overflow: "hidden",
  };

  return (
    <div className="App" id="app" style={appStyle}>
      {showTutorial ? <Tutorial close={() => setShowTutorial(false)} /> : null}
      <NavBar style={navbarStyle} />
      <Menu style={menuStyle} setMode={setMode} setFunction={setFunction} />
      <PlotWindow mode={mode} algorithm={func} style={canvasStyle} />
    </div>
  );
}

export default App;
