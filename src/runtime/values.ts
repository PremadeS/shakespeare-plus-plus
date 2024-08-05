export type ValueType = "null" | "number" | "boolean";

export interface RuntimeVal {
  type: ValueType;
}

// Null...
export interface NullVal extends RuntimeVal {
  type: "null";
  value: "null";
}
export function makeNull(): RuntimeVal {
  return { type: "null", value: "null" } as NullVal;
}

// Number...
export interface NumVal extends RuntimeVal {
  type: "number";
  value: number;
}
export function makeNum(n = 0): RuntimeVal {
  return { type: "number", value: n } as NumVal;
}

// Boolean...
export interface BoolVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}
export function makeBool(b = true): RuntimeVal {
  return { type: "boolean", value: b } as BoolVal;
}
