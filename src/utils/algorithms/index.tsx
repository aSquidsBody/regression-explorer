import { regression, Cartesian } from "./regression";
import { linearSpline, cubicSpline } from "./spline";

function regressionAlg(degree: number) {
  return (points: Cartesian[]) => regression(points, degree)!;
}

export type Algorithm = (points: Cartesian[]) => (x: number) => number;

const algorithms = new Map<string, any>();

algorithms.set("regression+1", regressionAlg(1));
algorithms.set("regression+2", regressionAlg(2));
algorithms.set("regression+3", regressionAlg(3));
algorithms.set("regression+4", regressionAlg(4));
algorithms.set("regression+5", regressionAlg(5));
algorithms.set("regression+6", regressionAlg(6));
algorithms.set("regression+7", regressionAlg(7));
algorithms.set("regression+8", regressionAlg(8));
algorithms.set("regression+9", regressionAlg(9));
algorithms.set("regression+10", regressionAlg(10));
algorithms.set("spline+1", linearSpline);
algorithms.set("spline+3", cubicSpline);

export { algorithms };

export const FUNCTION_NAMES = [
  { verbose: "Linear", name: "regression+1", type: "regression" },
  { verbose: "Quadratic", name: "regression+2", type: "regression" },
  { verbose: "Cubic", name: "regression+3", type: "regression" },
  { verbose: "4th Degree", name: "regression+4", type: "regression" },
  { verbose: "5th Degree", name: "regression+5", type: "regression" },
  { verbose: "6th Degree", name: "regression+6", type: "regression" },
  { verbose: "7th Degree", name: "regression+7", type: "regression" },
  { verbose: "8th Degree", name: "regression+8", type: "regression" },
  { verbose: "9th Degree", name: "regression+9", type: "regression" },
  { verbose: "10th Degree", name: "regression+10", type: "regression" },
  { verbose: "Linear", name: "spline+1", type: "spline" },
  { verbose: "Cubic", name: "spline+3", type: "spline" },
];

export enum FUNCTION_TYPE {
  REGRESSION = "regression",
  SPLINE = "spline",
}
