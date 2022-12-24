export const calculatorNames: readonly string[] = [
  "Cyclic",
  "Matrix",
  "NightRider",
  "PulseWaves",
  "ShrinkingCube",
  "Stars",
  "Test",
] as const;

export type CalculatorName = typeof calculatorNames[number];

export const isCalculatorName = (name: string | symbol): boolean => {
  return (
    typeof name === "string" &&
    Boolean(calculatorNames.find((cName) => cName === name))
  );
};
