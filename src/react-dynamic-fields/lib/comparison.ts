export type ComparisonTypes =
  | "deepEquals"
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "maxLength";

export function compareValues<T>(
  value1: T,
  value2: T,
  comparison: ComparisonTypes
): boolean {
  switch (comparison) {
    case "equals":
      return value1 === value2;
    case "deepEquals":
      return JSON.stringify(value1) === JSON.stringify(value2);
    case "notEquals":
      return value1 !== value2;
    case "greaterThan":
      return (
        typeof value1 === "number" &&
        typeof value2 === "number" &&
        value1 > value2
      );
    case "lessThan":
      return (
        typeof value1 === "number" &&
        typeof value2 === "number" &&
        value1 < value2
      );
    case "greaterThanOrEqual":
      return (
        typeof value1 === "number" &&
        typeof value2 === "number" &&
        value1 >= value2
      );
    case "lessThanOrEqual":
      return (
        typeof value1 === "number" &&
        typeof value2 === "number" &&
        value1 <= value2
      );
    case "maxLength":
      return (
        typeof value1 === "string" &&
        typeof value2 === "number" &&
        value1.length > value2
      );
    default:
      return false;
  }
}

export const deepComparison = (currentRules: any, newRules: any) => {
  return JSON.stringify(currentRules) === JSON.stringify(newRules);
};
