import React, { useState } from "react";

import mainImg from "../assets/demo.gif";
import cursorMode from "../assets/cursorMode.png";
import addPoint from "../assets/addPoint.png";
import deletePoint from "../assets/deletePoint.png";
import regressionType from "../assets/regression.png";
import regressionOptions from "../assets/regressionOptions.png";

const numPages = 5;

// shared styles
const text: React.CSSProperties = {
  textAlign: "center",
  fontFamily: "var(--noto)",
  margin: "10px 0px 5px 0px",
};

const italic: React.CSSProperties = {
  fontStyle: "italic",
  color: "#1f1f1f",
};

const link: React.CSSProperties = {
  textDecoration: "none",
};

const centering: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const subTitle: React.CSSProperties = {
  ...text,
  ...italic,
  padding: "10px 0px",
};

interface TutorialProps {
  close: () => void;
}

function Tutorial(props: TutorialProps) {
  const [page, setPage] = useState(1);

  function incPage() {
    if (page === numPages) {
      return props.close();
    }
    setPage(page + 1);
  }

  function decPage() {
    if (page === 1) {
      return;
    }
    setPage(page - 1);
  }

  function PageSwitch() {
    if (page === 1) {
      return <Page1 />;
    }
    if (page === 2) {
      return <Page2 />;
    }
    if (page === 3) {
      return <Page3 />;
    }
    if (page === 4) {
      return <Page4 />;
    }

    if (page === 5) {
      return <Page5 />;
    }
    return null;
  }

  const style: React.CSSProperties = {
    position: "fixed",
    height: "100vh",
    width: "100vw",
    top: "0px",
    left: "0px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    background: "#00000033",
    zIndex: 2,
  };
  const box: React.CSSProperties = {
    position: "relative",
    padding: "20px 10px 50px 10px",
    borderRadius: "5px",
    border: "solid 1px #00000044",
    // border: "solid 1px black",
    boxShadow: "0px 1px 4px 0px black",
    background: "white",
    maxWidth: "570px",
    width: "100%",
    height: "570px",
  };

  const titleStyle: React.CSSProperties = {
    display: "inline",
    fontFamily: "var(--urban)",
    fontWeight: "700",
    fontSize: "2.8rem",
  };

  const nextButton: React.CSSProperties = {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    zIndex: 1,
  };

  const backButton: React.CSSProperties = {
    position: "absolute",
    bottom: "10px",
    right: "100px",
    zIndex: 1,
  };

  const skipButton: React.CSSProperties = {
    position: "absolute",
    bottom: "10px",
    left: "10px",
  };

  return (
    <div style={style}>
      <div style={box}>
        <div style={centering}>
          <h3 style={titleStyle}>Regression Explorer</h3>
        </div>
        <PageSwitch />
        <TutorialButton style={skipButton} onClick={props.close}>
          Start Graphing
        </TutorialButton>
        {page > 1 ? (
          <TutorialButton style={backButton} onClick={decPage}>
            Back
          </TutorialButton>
        ) : null}

        <TutorialButton style={nextButton} onClick={incPage}>
          {page < numPages ? "Next" : "Done"}
        </TutorialButton>
      </div>
    </div>
  );
}

function Page1() {
  const imgWrapper: React.CSSProperties = {
    position: "relative",
    height: "310px",
    width: "500px",
    border: "solid 2px gray",
    overflow: "hidden",
    marginBottom: "20px",
  };

  const mainImageStyle: React.CSSProperties = {
    position: "absolute",
    top: "-10px",
    left: "-7px",
    height: "100%",
    width: "auto",
    margin: "10px 0px",
  };

  return (
    <div style={centering}>
      <p style={text}>
        Regression Explorer is an interactive plotting tool for visualizing{" "}
        <span style={italic}>
          <a
            style={link}
            href="https://en.wikipedia.org/wiki/Polynomial_regression"
          >
            polynomial regression
          </a>
        </span>{" "}
        and{" "}
        <span style={italic}>
          <a
            style={link}
            href="https://en.wikipedia.org/wiki/Spline_(mathematics)"
          >
            cubic splines
          </a>
        </span>
        .
      </p>
      <div style={imgWrapper}>
        <img
          className="selectDisable"
          src={mainImg}
          alt="Main image"
          style={mainImageStyle}
        />
      </div>
      <p style={text}>
        Click <span style={italic}>Next</span> to see instructions on how to use
        this tool. If you know what you're doing, you can click{" "}
        <span style={italic}>Start Graphing</span> to skip this tutorial
      </p>
    </div>
  );
}

function Page2() {
  const cursorModeStyle: React.CSSProperties = {
    height: "120px",
    marginBottom: "12px",
  };

  const addPointStyle: React.CSSProperties = {
    ...cursorModeStyle,
    height: "112px",
  };

  return (
    <div style={centering}>
      <h2 style={subTitle}>Cursor Mode</h2>
      <p style={text}>
        <span style={italic}>Move Screen</span> allows you to move the graphing
        window by clicking and dragging the mouse on the screen
      </p>
      <img
        className="selectDisable"
        src={cursorMode}
        alt="cursor mode"
        style={cursorModeStyle}
      />
      <p style={text}>
        You can add points to the graph by selecting the{" "}
        <span style={italic}>Add Point</span> mode. Click on a location in the
        graphing window to place a point there.
      </p>
      <img
        className="selectDisable"
        src={addPoint}
        alt="add point"
        style={addPointStyle}
      />
    </div>
  );
}

function Page3() {
  const deletePointStyle: React.CSSProperties = {
    height: "112px",
    marginBottom: "12px",
    marginTop: "4px",
  };

  return (
    <div style={centering}>
      <h2 style={subTitle}>Cursor Mode</h2>
      <p style={text}>
        <span style={italic}>Delete Point</span> mode should be used when you
        want to remove a point from the graphing window. Simply click on a point
        to remove it.
      </p>
      <img
        className="selectDisable"
        src={deletePoint}
        alt="delete point"
        style={deletePointStyle}
      />
    </div>
  );
}

function Page4() {
  const imgStyle: React.CSSProperties = {
    height: "120px",
    marginBottom: "12px",
  };

  return (
    <div style={centering}>
      <h2 style={subTitle}>Fit Type</h2>
      <p style={text}>
        Regression Explorer will produce a curve corresponding to the selected{" "}
        <span style={italic}>Fit Type</span>.
      </p>
      <img
        className="selectDisable"
        src={regressionType}
        alt="fit type"
        style={imgStyle}
      />
      <p style={text}>
        A <span style={italic}>Regression</span> curve is an approximate fit of
        data points; it may or may not pass through each point perfectly.
      </p>
      <p style={text}>
        A <span style={italic}>Spline</span> curve, in the context of Regression
        Explorer, is an exact fit of the data points. It is like a fancy
        connect-the-dots.
      </p>
    </div>
  );
}

function Page5() {
  const imgWrapper: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    height: "120px",
    width: "450px",
    borderRadius: "25px",
    marginBottom: "10px",
  };
  const imgStyle: React.CSSProperties = {
    position: "absolute",
    top: "0px",
    left: "-0px",
    height: "120px",
    width: "auto",
    marginBottom: "12px",
  };

  return (
    <div style={centering}>
      <h2 style={subTitle}>Fitting Degree</h2>
      <p style={text}>
        The fitting function, whether a regression polynomial or a spline, can
        be generated with a particular <span style={italic}>degree</span>. This
        value defines the maximum polynomial degree of generating functions.
      </p>
      <div style={imgWrapper}>
        <img
          className="selectDisable"
          src={regressionOptions}
          alt="cursor mode"
          style={imgStyle}
        />
      </div>
      <p style={text}>
        For a <span style={italic}>regression</span> polynomial, a larger
        fitting degree correlates with a more accurate approximation. If there
        are <span style={italic}>N</span> points, then a degree of{" "}
        <span style={italic}>N - 1</span> corresponds to a perfect fit. Any
        higher degree will produce no function.
      </p>
      <p style={text}>
        For a <span style={italic}>spline</span>, a larger fitting degree
        implies a smoother curve.
      </p>
    </div>
  );
}

interface TutorialButtonProps {
  style?: React.CSSProperties;
  onClick: () => void;
  children?: JSX.Element | string;
}

function TutorialButton(props: TutorialButtonProps) {
  const [pressed, setPressed] = useState(false);

  function onMouseUp(e: MouseEvent) {
    props.onClick();
    setPressed(false);
    window.getSelection()!.removeAllRanges();
    document.onmouseup = null;
  }

  function onMouseDown() {
    setPressed(true);
    window.getSelection()!.removeAllRanges();
    document.onmouseup = onMouseUp;
  }

  const style = {
    ...props.style,
    lineHeight: "20px",
    background: pressed ? "var(--pressed-color)" : "var(--primary-color)",
    border: "none",
    color: "white",
    fontFamily: "var(--noto)",
    fontSize: "1rem",
    padding: "5px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.05s ease-out",
  };

  return (
    <button style={style} onMouseDown={onMouseDown}>
      {props.children}
    </button>
  );
}

export default Tutorial;
