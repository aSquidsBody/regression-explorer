function cube(a: number, b: number, c: number, d: number, x0: number) {
  return (x: number) => {
    var y = 0;
    var xP = 1;
    const coeffs = [a, b, c, d];
    for (var power = 0; power < 4; power++) {
      y = y + coeffs[power] * xP;
      xP = xP * (x - x0);
    }

    return y;
  };
}

export function cubicSplineCoeffs(x: number[], y: number[]) {
  const N = x.length - 1;

  var a = y.map((yi) => yi);
  var b = Array.from(Array(N).keys()).map((idx) => 0);
  var d = Array.from(Array(N).keys()).map((idx) => 0);
  var h = Array.from(Array(N).keys()).map((idx) => {
    return x[idx + 1] - x[idx];
  });

  const alpha = h.map((hi, idx) => {
    if (idx > 0) {
      return (
        (3 / hi) * (a[idx + 1] - a[idx]) -
        (3 / h[idx - 1]) * (a[idx] - a[idx - 1])
      );
    } else {
      return hi;
    }
  });

  var c = Array.from(Array(N + 1).keys()).map(() => 0);
  var l = Array.from(Array(N + 1).keys()).map(() => 0);
  var u = Array.from(Array(N + 1).keys()).map(() => 0);
  var z = Array.from(Array(N + 1).keys()).map(() => 0);

  l[0] = 1;

  for (var i = 1; i < N; i++) {
    l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * u[i - 1];
    u[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }

  l[N] = 1;
  z[N] = 0;
  c[N] = 0;

  for (var j = N - 1; j >= 0; j--) {
    c[j] = z[j] - u[j] * c[j + 1];
    b[j] = (a[j + 1] - a[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }

  const coeffs = Array.from(Array(N).keys()).map((idx) => {
    return [a[idx], b[idx], c[idx], d[idx]];
  });

  return coeffs;
}

export function linearSplineCoeffs(x: number[], y: number[]) {
  const coeffs = Array.from(Array(x.length - 1).keys()).map((idx) => {
    // A is the constant term, B is the slope of the line
    if (x[idx] === x[idx + 1]) {
      // vertical line
      const A = x[idx];
      const B = NaN;
      return [A, B];
    } else {
      const B = (y[idx + 1] - y[idx]) / (x[idx + 1] - x[idx]);
      const A = y[idx] - B * x[idx];
      return [A, B];
    }
  });

  return coeffs;
}

interface Cartesian {
  x: number;
  y: number;
}

function sortInput(points: Cartesian[]) {
  const xArray = points.map((point) => point.x);
  const yArray = points.map((point) => point.y);

  var xyPoints = Array.from(Array(xArray.length).keys()).map((idx) => {
    return [xArray[idx], yArray[idx]];
  });

  xyPoints.sort((xy1, xy2) => {
    return xy1[0] - xy2[0];
  });

  const sortedX = xyPoints.map((xy) => xy[0]);
  const sortedY = xyPoints.map((xy) => xy[1]);

  return { sortedX, sortedY };
}

function piecewiseFunction(
  partitions: number[],
  funcs: ((n: number) => number)[]
) {
  return (x: number) => {
    var returnVal: number = 0;

    for (let idx = 0; idx < partitions.length - 1; idx++) {
      const xi = partitions[idx];

      const xip1 = partitions[idx + 1];

      if (xi <= x && x < xip1) {
        const func = funcs[idx];
        returnVal = func(x);
      }
    }

    return returnVal;
  };
}

export function linearSpline(points: Cartesian[]) {
  try {
    const { sortedX, sortedY } = sortInput(points);

    const coeffs = linearSplineCoeffs(sortedX, sortedY);

    const linearSplines = sortedX
      .slice(0, sortedX.length - 1) // one point more than functions
      .map((o, idx) => {
        const a = coeffs[idx][0];
        const b = coeffs[idx][1];
        const c = 0;
        const d = 0;
        return cube(a, b, c, d, 0);
      });

    return piecewiseFunction(sortedX, linearSplines);
  } catch (err: any) {
    return (points: Cartesian[]) => undefined;
  }
}

export function cubicSpline(points: Cartesian[]) {
  try {
    const { sortedX, sortedY } = sortInput(points);

    const coeffs = cubicSplineCoeffs(sortedX, sortedY);

    const cubicSplines = sortedX
      .slice(0, sortedX.length - 1) // one point more than functions
      .map((xidx, idx) => {
        const a = coeffs[idx][0];
        const b = coeffs[idx][1];
        const c = coeffs[idx][2];
        const d = coeffs[idx][3];
        return cube(a, b, c, d, xidx);
      });

    return piecewiseFunction(sortedX, cubicSplines);
  } catch (err: any) {
    return undefined;
  }
}
