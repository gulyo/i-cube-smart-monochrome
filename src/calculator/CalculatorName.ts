export const calculatorNames: readonly string[] = [
  "Matrix",
  "NightRider",
  "PulseWaves",
  "ShrinkingCube",
  "Test",
] as const;

export type CalculatorName = typeof calculatorNames[number];

export const isCalculatorName = (name: string | symbol): boolean => {
  return (
    typeof name === "string" &&
    Boolean(calculatorNames.find((cName) => cName === name))
  );
};
