import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PlotWindow, { CURSOR_MODE } from "./components/PlotWindow";
import NavBar from "./components/NavBar";
import Menu from "./components/Menu";

import "./App.css";
import Tutorial from "./components/Tutorial";

function App() {
  const [mode, setMode] = useState(CURSOR_MODE.MOVE);
  const [func, setFunction] = useState("");
  const [showTutorial, setShowTutorial] = useState(true);

  // style
  const navbarStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "44px",
    zIndex: 1,
  };

  const menuStyle: React.CSSProperties = {
    height: "var(--menu-height)",
    width: "100%",
    borderBottom: "solid 1px black",
    boxShadow: "2px 0px 20px 0px #888",
  };

  const canvasStyle: React.CSSProperties = {
    position: "relative",
    height: "calc(100vh - var(--navbar-height) - var(--menu-height))",
    width: "100vw",
    maxHeight: "100vh",
    maxWidth: "100vw",
    overflow: "hidden",
  };

  return (
    <div className="App" id="app">
      {showTutorial ? <Tutorial close={() => setShowTutorial(false)} /> : null}
      <NavBar style={navbarStyle} />
      <Menu style={menuStyle} setMode={setMode} setFunction={setFunction} />
      <PlotWindow mode={mode} algorithm={func} style={canvasStyle} />
    </div>
  );
}

export default App;
