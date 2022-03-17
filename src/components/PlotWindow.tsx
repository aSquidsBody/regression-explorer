import React, { useEffect, useRef, useState } from "react";
import { Algorithm, algorithms } from "../utils/algorithms/index";

import { range } from "../utils/range";

export enum CURSOR_MODE {
  MOVE = "move",
  POINT = "point",
  DELETE = "delete",
}

const DIAMETER = 30;
const ZOOM_SCALE = 0.0005;

function zoomValue(deltaY: number) {
  return 1 + deltaY * ZOOM_SCALE;
}

const PLOT = {
  COLOR: "black",
  THICKNESS: 2,
};

const AXES = {
  THICKNESS: 1,
  //   COLOR: "#c2c2ff",
  COLOR: "#010101",
  TICK: {
    THICKNESS: 1,
    MAX_GAP: 125, // maximum pixel spacing between ticks
    FONT: "1rem Urbanist",
  },
};

interface PlotWindowProps {
  mode: CURSOR_MODE;
  color?: string;
  algorithm?: string;
  height?: number;
  width?: number;
  style?: React.CSSProperties;
}

interface Cartesian {
  x: number;
  y: number;
}

// internal representation of a point
interface PointData {
  id: number;
  pixel: Cartesian;
  coord: Cartesian;
  color?: string;
  tempPx: Cartesian;
  ref: React.RefObject<HTMLDivElement>;
}

// Plot window controls the visuals of the plot window,
// and it will control the visuals in the plot window, e.g.
// points and functions
function PlotWindow(props: PlotWindowProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // manage the dimensions of the window in coord space
  const [xCoordRange, setXCoordRange] = useState([0, 0]);
  const [yCoordRange, setYCoordRange] = useState([0, 0]);

  // select the canvas (to pan the screen)
  var [clientX, setClientX] = useState(0);
  var [clientY, setClientY] = useState(0);

  const [pts, setPts] = useState([] as PointData[]);
  const [cursor, setCursor] = useState("");

  // get point and index
  function getPt(id: number): { pt?: PointData; idx: number } {
    for (let idx = 0; idx < pts.length; idx++) {
      const pt = pts[idx];
      if (pt.id === id) {
        return { pt, idx };
      }
    }

    return { pt: undefined, idx: -1 };
  }

  // delete a point
  function deletePt(id: number) {
    setPts(pts.filter((pt) => pt.id !== id));
  }

  function setColor(pt: PointData) {
    return function (c: string) {
      pt.color = c;
      setPts([...pts]);
    };
  }

  function xPixel2coord(px: number, ctx: CanvasRenderingContext2D) {
    return (
      ((xCoordRange[1] - xCoordRange[0]) * px) / ctx.canvas.width +
      xCoordRange[0]
    );
  }

  function yPixel2coord(px: number, ctx: CanvasRenderingContext2D) {
    return (
      ((yCoordRange[0] - yCoordRange[1]) * px) / ctx.canvas.height +
      yCoordRange[1]
    );
  }

  function xCoord2pixel(px: number, ctx: CanvasRenderingContext2D) {
    return (
      ((px - xCoordRange[0]) * ctx.canvas.width) /
      (xCoordRange[1] - xCoordRange[0])
    );
  }

  function yCoord2pixel(px: number, ctx: CanvasRenderingContext2D) {
    return (
      ((px - yCoordRange[1]) * ctx.canvas.height) /
      (yCoordRange[0] - yCoordRange[1])
    );
  }

  // method to convert pixel to coord
  function pixel2coord(px: Cartesian, canvas?: HTMLCanvasElement) {
    if (!canvas) {
      canvas = canvasRef.current || undefined;
    }
    if (!canvas) return;
    const xRange = xCoordRange[1] - xCoordRange[0];
    const yRange = yCoordRange[1] - yCoordRange[0];
    if (xRange <= 0 || yRange <= 0) return;

    const height = canvas.clientHeight;
    const width = canvas.clientWidth;

    return {
      x: (xRange * px.x) / width + xCoordRange[0],
      y: (-yRange * px.y) / height + yCoordRange[1],
    };
  }

  // method to convert coord to pixel
  function coord2pixel(px: Cartesian, canvas?: HTMLCanvasElement) {
    if (!canvas) {
      canvas = canvasRef.current || undefined;
    }
    if (!canvas) return;

    const xRange = xCoordRange[1] - xCoordRange[0];
    const yRange = yCoordRange[1] - yCoordRange[0];
    if (xRange <= 0 || yRange <= 0) return;

    const height = canvas!.clientHeight;
    const width = canvas!.clientWidth;
    return {
      x: ((px.x - xCoordRange[0]) * width) / xRange,
      y: ((px.y - yCoordRange[1]) * height) / -yRange,
    };
  }

  // method to handle the resizing of the window
  function resize() {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const height = wrapper.clientHeight;
    const width = wrapper.clientWidth;

    canvas.height = height;
    canvas.width = width;
    setXCoordRange([-5, 5]);
    const yRange = (10 * height) / width;
    setYCoordRange([-yRange / 2, yRange / 2]);
  }

  // draw everything
  function draw() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Draw axes and functions
    drawAxes(canvas, ctx);
    drawTicks(canvas, ctx);
    drawFunction(canvas, ctx);
  }

  // draw the axes
  function drawAxes(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // get the origin in pixels (bound it to the plot window)
    const originPx = coord2pixel({ x: 0, y: 0 });
    if (!originPx) return;
    originPx.x = Math.max(Math.min(originPx.x, canvas.clientWidth), 0);
    originPx.y = Math.max(Math.min(originPx.y, canvas.clientHeight), 0);

    ctx.beginPath();
    ctx.lineWidth = AXES.THICKNESS;
    ctx.strokeStyle = AXES.COLOR;

    // x-axis
    ctx.moveTo(0, originPx.y);
    ctx.lineTo(canvas.clientWidth, originPx.y);

    // y-axis
    ctx.moveTo(originPx.x, canvas.clientHeight);
    ctx.lineTo(originPx.x, 0);

    ctx.closePath();
    ctx.stroke();
  }

  // draw the ticks on the axes
  function drawTicks(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // get the origin in pixels (bound it to the plot window)
    const originPx = coord2pixel({ x: 0, y: 0 });
    if (!originPx) return;
    originPx.x = Math.max(Math.min(originPx.x, canvas.clientWidth), 0);
    originPx.y = Math.max(Math.min(originPx.y, canvas.clientHeight), 0);

    ctx.lineWidth = AXES.TICK.THICKNESS;

    const tScale = tickScale();
    if (!tScale) return;
    const [scale, exp] = tScale;

    const decimals = Math.abs(exp);

    // Get the first and last ticks to appear on the screen
    const lowerX = parseFloat(
      (xCoordRange[0] + (-xCoordRange[0] % scale)).toFixed(decimals)
    );
    const higherX = parseFloat(
      (xCoordRange[1] - (xCoordRange[1] % scale)).toFixed(decimals)
    );
    const lowerY = parseFloat(
      (yCoordRange[0] + (-yCoordRange[0] % scale)).toFixed(decimals)
    );
    const higherY = parseFloat(
      (yCoordRange[1] - (yCoordRange[1] % scale)).toFixed(decimals)
    );

    // define the ticks and get pixel values
    const tickXCoords = range(lowerX, higherX + scale, scale);
    const tickYCoords = range(lowerY, higherY + scale, scale);

    const tickPixels = Array(Math.max(tickXCoords.length, tickYCoords.length));
    for (let i = 0; i < tickPixels.length; i++) {
      tickPixels[i] = coord2pixel({
        x: tickXCoords[i],
        y: tickYCoords[i],
      });
    }

    for (let i = 0; i < tickPixels.length; i++) {
      if (!tickPixels[i]) return;
    }

    for (var idx = 0; idx < tickPixels.length; idx++) {
      const px = tickPixels[idx];

      const x = px!.x;
      const y = px!.y;

      if (!isNaN(x)) {
        // draw the x-ticks
        // bound the ticks to be within the box
        var upperYPx = canvas.clientHeight;
        var lowerYPx = 0;

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(0, 0, 0, 0.2)";

        ctx.moveTo(x, lowerYPx);
        ctx.lineTo(x, upperYPx);
        ctx.closePath();
        ctx.stroke();

        lowerYPx = Math.min(originPx.y + 5, canvas.clientHeight);
        upperYPx = Math.max(originPx.y - 5, 0);

        ctx.beginPath();

        ctx.lineWidth = AXES.TICK.THICKNESS;
        ctx.strokeStyle = "black";

        ctx.moveTo(x, lowerYPx);
        ctx.lineTo(x, upperYPx);
        ctx.closePath();
        ctx.stroke();

        // set up the label
        ctx.font = AXES.TICK.FONT;
        const label = tickLabel(tickXCoords[idx], exp);
        if (label) {
          const leftOffset = ctx.measureText(label).width / 2;

          if (label !== "0") {
            if (lowerYPx + 15 > canvas.clientHeight) {
              ctx.fillText(label, x - leftOffset, upperYPx - 5);
            } else {
              ctx.fillText(label, x - leftOffset, lowerYPx + 15);
            }
          }
        }
      }

      if (!isNaN(y)) {
        // draw the y-ticks
        ctx.beginPath();
        var leftXPx = 0;
        var rightXPx = canvas.clientWidth;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(0, 0, 0, 0.2)";
        ctx.moveTo(leftXPx, y);
        ctx.lineTo(rightXPx, y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        leftXPx = Math.max(originPx.x - 5, 0);
        rightXPx = Math.min(originPx.x + 5, canvas.clientWidth);
        ctx.lineWidth = AXES.TICK.THICKNESS;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();

        // set up the label
        const label = tickLabel(tickYCoords[idx], exp);
        if (label) {
          const leftOffset = ctx.measureText(label).width + 5;
          if (label !== "0") {
            if (leftXPx - leftOffset <= 0) {
              ctx.fillText(label, rightXPx + 5, y + 5);
            } else {
              ctx.fillText(label, leftXPx - leftOffset, y + 5);
            }
          }
        }
      }
    }
  }

  // helper function to get tick scaling
  // returns scale base and exp
  function tickScale() {
    const temp = pixel2coord({
      x: 0,
      y: 0,
    });

    const tempGap = pixel2coord({
      x: AXES.TICK.MAX_GAP,
      y: AXES.TICK.MAX_GAP,
    });
    if (!temp || !tempGap) return;
    const maxCoordGap = tempGap.x - temp.x;
    const scaleExp = Math.floor(Math.log10(maxCoordGap));
    const scaleBase = 10 ** scaleExp;
    const scaleMult = maxCoordGap / scaleBase;
    if (scaleMult >= 5) return [scaleBase * 5, scaleExp];
    if (scaleMult >= 2) return [scaleBase * 2, scaleExp];
    return [scaleBase, scaleExp];
  }

  // helper function to generate tick labels
  function tickLabel(labelNumber: number, exp: number) {
    if (parseFloat(labelNumber.toFixed(Math.abs(exp))) !== 0.0) {
      if (exp < -2 || exp > 3) {
        return labelNumber.toExponential(1).toString();
      } else if (exp < -1) {
        return labelNumber.toFixed(2).toString();
      } else if (exp < 0) {
        return labelNumber.toFixed(1).toString();
      } else {
        return parseInt(labelNumber.toString()).toString();
      }
    }
  }

  // draw a function
  function drawFunction(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    if (!props.algorithm) return;
    const algorithm = algorithms.get(props.algorithm!)! as Algorithm;

    const isSpline = props.algorithm?.includes("spline");

    const coords: Cartesian[] = [];
    for (const pt of pts) {
      coords.push(pt.coord);
    }

    const func = algorithm(coords)!;
    if (!func) return;

    // plotFunction
    const dx = 0.25;
    ctx.beginPath();
    ctx.lineWidth = PLOT.THICKNESS;
    ctx.strokeStyle = PLOT.COLOR;

    var numInterp = Math.floor(canvas.clientWidth / dx);
    var interpXs = range(dx, (numInterp + 1) * dx, dx); // xPixels

    var maxX = pts[0].pixel.x;
    var minX = maxX;
    for (const pt of pts) {
      const x = pt.pixel.x;
      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }
    }

    // initialize the previous step of the path
    var prevPixelX = 0;
    var prevCoordX = xPixel2coord(prevPixelX, ctx);
    var prevCoordY = func(prevCoordX);
    var prevPixelY = yCoord2pixel(prevCoordY, ctx);

    for (let i = 0; i < interpXs.length; i++) {
      const pixelX = interpXs[i];
      const coordX = xPixel2coord(pixelX, ctx);
      const coordY = func(coordX);
      const pixelY = yCoord2pixel(coordY, ctx);
      if (isSpline) {
        if (prevPixelX > minX && pixelX < maxX) {
          ctx.moveTo(prevPixelX, prevPixelY);
          ctx.lineTo(pixelX, pixelY);
        }
      } else {
        // draw the interploting line
        ctx.moveTo(prevPixelX, prevPixelY);
        ctx.lineTo(pixelX, pixelY);
      }
      // reset the prev values
      prevPixelX = pixelX;
      prevPixelY = pixelY;
      prevCoordX = coordX;
      prevCoordY = coordY;
    }
    ctx.closePath();
    ctx.stroke();
  }

  // grabby functions
  function selectPan(e: React.MouseEvent<HTMLCanvasElement>) {
    // setClientX(e.clientX);
    // setClientY(e.clientY);
    clientX = e.clientX;
    clientY = e.clientY;
    window.getSelection()!.removeAllRanges();
    document.onmousemove = dragPan;
    document.onmouseup = deselectPan;
  }

  function dragPan(e: MouseEvent) {
    // window.getSelection()!.removeAllRanges();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // difference between old mouse position and current mouse position
    const diffX = e.clientX - clientX;
    const diffY = e.clientY - clientY;

    const xRange = xCoordRange[1] - xCoordRange[0];
    const yRange = yCoordRange[1] - yCoordRange[0];

    const width = canvas.width; // px
    const height = canvas.height; // px

    const newXRange0 = xCoordRange[0] - diffX / (width / xRange);
    const newXRange1 = xCoordRange[1] - diffX / (width / xRange);
    const newYRange0 = yCoordRange[0] + diffY / (height / yRange);
    const newYRange1 = yCoordRange[1] + diffY / (height / yRange);

    setXCoordRange([newXRange0, newXRange1]);
    setYCoordRange([newYRange0, newYRange1]);
  }

  function deselectPan(e: MouseEvent) {
    window.getSelection()!.removeAllRanges();
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function clickAddPoint(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    let id = 0;
    if (pts.length > 0) id = Math.max(...pts.map((pt) => pt.id)) + 1;
    const pixel = {
      x: e.clientX - wrapper.offsetLeft,
      y: e.clientY - wrapper.offsetTop,
    };
    const coord = pixel2coord(pixel)!;

    // create a point
    const newPoint: PointData = {
      id,
      pixel,
      coord,
      color: "black",
      tempPx: pixel,
      ref: React.createRef(),
    };
    const newPts = [...pts, newPoint];
    setPts(newPts);
  }

  // zooming
  function zoom(e: React.WheelEvent<HTMLCanvasElement | HTMLDivElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const cursor = pixel2coord({
      x: e.clientX - wrapper.offsetLeft,
      y: e.clientY - wrapper.offsetTop,
    });
    if (!cursor) return;

    // set some values
    const zoomScale = zoomValue(e.deltaY);
    const oldXRange = [...xCoordRange];
    const oldYRange = [...yCoordRange];

    xCoordRange[0] = cursor.x - (cursor.x - xCoordRange[0]) * zoomScale;
    xCoordRange[1] = zoomScale * (oldXRange[1] - oldXRange[0]) + xCoordRange[0];
    yCoordRange[0] = cursor.y - (cursor.y - oldYRange[0]) * zoomScale;
    yCoordRange[1] = zoomScale * (oldYRange[1] - oldYRange[0]) + yCoordRange[0];
    setXCoordRange([...xCoordRange]);
    setYCoordRange([...yCoordRange]);
  }

  // point moving functions
  function selectPoint(id: number) {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      window.getSelection()!.removeAllRanges();
      // get the idx of the point
      const { pt } = getPt(id);
      if (!pt) return;
    };
  }

  function dragPoint(id: number) {
    return (e: MouseEvent) => {
      window.getSelection()!.removeAllRanges();
      const elmnt = document.getElementById(id.toString());
      if (!elmnt) return;
      const { pt, idx } = getPt(id);
      if (!pt) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      // get pixel diff since mouse moved
      const x2 = e.clientX - 0.5 * DIAMETER - wrapper.offsetLeft;
      const y2 = e.clientY - 0.5 * DIAMETER - wrapper.offsetTop;
      const diffX = x2 - pts[idx].tempPx.x;
      const diffY = y2 - pts[idx].tempPx.y;

      elmnt.style.top = y2.toString() + "px";
      elmnt.style.left = x2.toString() + "px";

      const newY = elmnt.offsetTop + diffY;
      const newX = elmnt.offsetLeft + diffX;

      pts[idx].tempPx.x = newX;
      pts[idx].tempPx.y = newY;
      pts[idx].pixel.x = x2 + 0.5 * DIAMETER;
      pts[idx].pixel.y = y2 + 0.5 * DIAMETER;
      pts[idx].coord = pixel2coord(pts[idx].pixel)!;
      draw();
    };
  }

  // lifestyle function
  // inital resize
  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
  }, []);

  useEffect(() => {
    for (const pt of pts) {
      const px = coord2pixel(pt.coord)!;

      const point = pt.ref.current;
      if (point) {
        point.style.top = (px.y - 0.5 * DIAMETER).toString() + "px";
        point.style.left = (px.x - 0.5 * DIAMETER).toString() + "px";
      }
    }
    draw();
  }, [pts.length]);

  // move the points when the
  useEffect(() => {
    // move the points
    for (const pt of pts) {
      // compute the new pixel position
      const px = coord2pixel(pt.coord)!;
      pt.pixel = px;
      const pointObj = pt.ref.current;
      if (pointObj) {
        pointObj.style.top = (px.y - 0.5 * DIAMETER).toString() + "px";
        pointObj.style.left = (px.x - 0.5 * DIAMETER).toString() + "px";
      }
    }
    draw();
  }, [xCoordRange, yCoordRange]);

  // redraw when the algorithm is changed
  useEffect(() => {
    draw();
  }, [props.algorithm]);

  function isMode(m: CURSOR_MODE) {
    return m === props.mode;
  }

  // styles
  const canvasStyle: React.CSSProperties = {
    position: "relative",
    background: "#f4f4f4",
    zIndex: 0,
    cursor:
      cursor !== ""
        ? cursor
        : isMode(CURSOR_MODE.MOVE)
        ? "move"
        : isMode(CURSOR_MODE.POINT)
        ? "default"
        : "default",
  };

  return (
    <div id="plot-window" style={props.style} ref={wrapperRef}>
      <canvas
        id="canvas"
        ref={canvasRef}
        style={canvasStyle}
        onMouseDown={
          props.mode === CURSOR_MODE.MOVE
            ? selectPan
            : props.mode === CURSOR_MODE.POINT
            ? clickAddPoint
            : () => {}
        }
        onWheel={zoom}
      ></canvas>

      {pts.map((pt, idx) => {
        return (
          <Point
            mode={props.mode}
            data={pt}
            onWheel={zoom}
            setCursor={setCursor}
            onMouseDown={selectPoint(pt.id)}
            onMouseMove={dragPoint(pt.id)}
            delete={() => deletePt(pt.id)}
            key={"pt" + pt.id}
            setColor={setColor(pt)}
          />
        );
      })}
    </div>
  );
}

interface PointProps {
  data: PointData;
  mode: CURSOR_MODE;
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: MouseEvent) => void;
  setCursor: (s: string) => void;
  delete: () => void;
  setColor: (c: string) => void;
  style?: React.CSSProperties;
}

function Point(props: PointProps) {
  const [grabbing, setGrabbing] = useState(false);
  const [hover, setHover] = useState(false);

  function mouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (props.mode !== CURSOR_MODE.DELETE) {
      document.getElementById("root")!.style.cursor = "grabbing";
      props.setCursor("grabbing");
      setGrabbing(true);

      // set the other event functions
      document.onmouseup = mouseUp;
      document.onmousemove = props.onMouseMove;
    } else {
      props.delete();
    }
  }

  function mouseUp() {
    window.getSelection()!.removeAllRanges();
    document.getElementById("root")!.style.cursor = "default";
    props.setCursor("");
    setGrabbing(false);

    document.onmouseup = null;
    document.onmousemove = null;
  }

  function mouseEnter() {
    setHover(true);
  }

  function mouseLeave() {
    setHover(false);
  }

  const pointStyle: React.CSSProperties = {
    height: DIAMETER,
    width: DIAMETER,
    position: "absolute",
    borderRadius: "50%",
  };

  const relative: React.CSSProperties = {
    position: "relative",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
    cursor: grabbing
      ? "grabbing"
      : props.mode == CURSOR_MODE.DELETE
      ? "pointer"
      : "grab",
  };

  const overlay: React.CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    borderRadius: "50%",
    opacity: hover || grabbing ? 0.4 : 0,
    background: props.data.color,
    transition: hover ? "all 0.05s linear" : "",
  };

  const innerStyle: React.CSSProperties = {
    height: DIAMETER / 3,
    width: DIAMETER / 3,
    borderRadius: "50%",
    background: props.data.color,
  };

  return (
    <div
      id={props.data.id.toString()}
      style={pointStyle}
      ref={props.data.ref}
      onWheel={props.onWheel}
      onMouseLeave={mouseLeave}
    >
      <div style={relative} onMouseDown={mouseDown} onMouseEnter={mouseEnter}>
        <div style={overlay} />
        <div style={innerStyle} />
      </div>
    </div>
  );
}

export default PlotWindow;
