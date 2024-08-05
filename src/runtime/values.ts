export type ValueType = "null" | "number";

export interface RuntimeVal {
  type: ValueType;
}
export interface NullVal extends RuntimeVal {
  type: "null";
  value: "null";
}

export interface NumVal extends RuntimeVal {
  type: "number";
  value: number;
}
