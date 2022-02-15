export function range(start: number, end: number, stepSize: number) {
  const numSteps = (end - start) / stepSize;
  const arr = Array(Math.round(numSteps));
  for (let i = 0; i < numSteps; i++) {
    arr[i] = start + i * stepSize;
  }

  return arr;
}
