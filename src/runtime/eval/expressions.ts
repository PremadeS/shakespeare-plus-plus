import { AssignmentExpr, BinaryExpr, Identifier, ObjectLiteral } from "../../frontend/ast";
import Environment from "../environment";
import { interpret } from "../interpreter";
import { NullVal, NumVal, ObjectVal, RuntimeVal } from "../values";

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

export function evalObjectExpr(obj: ObjectLiteral, env: Environment): RuntimeVal {
  const object = { type: "object", properties: new Map() } as ObjectVal;

  for (const { key, value } of obj.properties) {
    const runTimeVal = value == undefined ? env.lookupVar(key) : interpret(value, env);
    object.properties.set(key, runTimeVal);
  }

  return object;
}

export function interpretBinaryExpr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const left = interpret(binop.left, env);
  const right = interpret(binop.right, env);

  if (left.type == "number" && right.type == "number") {
    return evalNumBinaryExpr(left as NumVal, right as NumVal, binop.operator);
  }

  return { type: "null", value: "null" } as NullVal;
}

export function interpretAssignment(node: AssignmentExpr, env: Environment): RuntimeVal {
  if (node.assignee.kind !== "Identifier") {
    throw new Error(
      `Thou hath committed an unworthy deed: an invalid assignation unto ${JSON.stringify(node.assignee)}.`
    );
  }

  const varName: string = (node.assignee as Identifier).symbol;
  return env.assignVar(varName, interpret(node.value, env));
}
