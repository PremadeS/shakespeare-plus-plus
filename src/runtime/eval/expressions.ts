import { BinaryExpr, Identifier } from "../../frontend/ast";
import Environment from "../environment";
import { interpret } from "../interpreter";
import { NullVal, NumVal, RuntimeVal } from "../values";

function evalNumBinaryExpr(left: NumVal, right: NumVal, operator: string): NumVal {
  let result: number = 0;
  if (operator == "+") {
    result = left.value + right.value;
  } else if (operator == "-") {
    result = left.value - right.value;
  } else if (operator == "*") {
    result = left.value * right.value;
  } else if (operator == "/") {
    // Divison by 0
    if (right.value == 0) {
      console.error(
        "Thou art trying to cleave yon number by the wretched zero,",
        "\ndost thou not know this conjures chaos in the realm of numbers?\nAt: ",
        left.value,
        operator,
        right.value
      );
      process.exit(1);
    }
    result = left.value / right.value;
  } else {
    result = left.value % right.value;
  }

  return { type: "number", value: result };
}

export function evalIdentifier(identifer: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(identifer.symbol);
  return val;
}

export function interpretBinaryExpr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const left = interpret(binop.left, env);
  const right = interpret(binop.right, env);

  if (left.type == "number" && right.type == "number") {
    return evalNumBinaryExpr(left as NumVal, right as NumVal, binop.operator);
  }

  return { type: "null", value: "null" } as NullVal;
}
