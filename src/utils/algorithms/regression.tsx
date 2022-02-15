import {
  MathArray,
  Matrix,
  transpose,
  multiply,
  lusolve,
  squeeze,
  ones,
} from "mathjs";

// create the matrix from a set of x values
function getMatrix(xData: MathArray, degree: number): Matrix {
  return xData.map((xi) =>
    ones(degree + 1).map((_, rowIndex) =>
      rowIndex === degree ? 1 : (xi as number) ** (degree - rowIndex)
    )
  ) as unknown as Matrix;
}

// Compute y-column * x-matrix
function getColumn(yData: MathArray, matrix: Matrix) {
  return multiply(yData, matrix);
}

export function regressionCoefficients(
  xData: MathArray,
  yData: MathArray,
  degree: number
) {
  const polynomials = getMatrix(xData, degree);

  const MTM = multiply(transpose(polynomials), polynomials);
  const yM = getColumn(yData, polynomials);

  const coefficients = squeeze(lusolve(MTM, yM)).valueOf() as number[];

  return coefficients;
}

export interface Cartesian {
  x: number;
  y: number;
}

export function regression(points: Cartesian[], degree: number) {
  // x & y data as mathjs arrays
  const xData = ones(points.length).map(
    (val, idx) => points[idx].x
  ) as MathArray;
  const yData = ones(points.length).map(
    (val, idx) => points[idx].y
  ) as MathArray;

  if (points.length > degree) {
    const coeffs = regressionCoefficients(xData, yData, degree);
    return regressionPolynomial(coeffs);
  }
}

export function regressionPolynomial(coeffs: number[]) {
  return (x: number) => {
    var y = 0;
    coeffs.forEach((coeff, idx) => {
      const power = coeffs.length - 1 - idx;
      y = y + coeff * x ** power;
    });
    return y;
  };
}
