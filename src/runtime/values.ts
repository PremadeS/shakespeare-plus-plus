import { Stmt } from "../frontend/ast";
import Environment from "./environment";

export type ValueType = "null" | "number" | "boolean" | "object" | "native-fn" | "function";

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

//Object...
export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<string, RuntimeVal>;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

//Native functions...
export interface NativeFnVal extends RuntimeVal {
  type: "native-fn";
  call: FunctionCall;
}

export function makeNativeFn(call: FunctionCall): RuntimeVal {
  return { type: "native-fn", call } as NativeFnVal;
}

export interface FunctionVal extends RuntimeVal {
  type: "function";
  name: string;
  parameters: string[];
  declereationEnv: Environment;
  body: Stmt[];
}
