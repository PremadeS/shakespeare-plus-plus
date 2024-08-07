import { AssignmentExpr, BinaryExpr, Identifier, ObjectLiteral } from "../../frontend/ast";
import Environment from "../environment";
import { interpret } from "../interpreter";
import { BoolVal, NullVal, NumVal, ObjectVal, RuntimeVal, makeNum, makeBool, makeNull } from "../values";

function evalNumBinaryExpr(left: RuntimeVal, right: RuntimeVal, operator: string): RuntimeVal {
  if (operator == "&") {
    if (left.type != "boolean" || right.type != "boolean") {
      return makeBool(false);
    }
    return makeBool((left as BoolVal).value && (right as BoolVal).value);
  } else if (operator == "|") {
    if (left.type != "boolean" || right.type != "boolean") {
      return makeBool(false);
    }
    return makeBool((left as BoolVal).value || (right as BoolVal).value);
  } else if (operator == "==") {
    return isEqual(left, right);
  } else if (operator == "!=") {
    if ((isEqual(left, right) as BoolVal).value == true) {
      return makeBool(false);
    } else {
      return makeBool(true);
    }
  }

  if (left.type == "null" || right.type == "null") {
    throw new Error(
      `Alas! One cannot engage in binary antics with naught but null! ${JSON.stringify(
        left
      )} ${operator} ${JSON.stringify(right)}`
    );
  }

  const lhs = left as NumVal;
  const rhs = right as NumVal;

  if (operator == "+") {
    return makeNum(lhs.value + rhs.value);
  } else if (operator == "-") {
    return makeNum(lhs.value - rhs.value);
  } else if (operator == "*") {
    return makeNum(lhs.value * rhs.value);
  } else if (operator == "/") {
    // Divison by 0
    if (rhs.value == 0) {
      console.error(
        "Thou art trying to cleave yon number by the wretched zero,",
        "\ndost thou not know this conjures chaos in the realm of numbers?\nAt: ",
        lhs.value,
        operator,
        rhs.value
      );
      process.exit(1);
    }
    return makeNum(lhs.value / rhs.value);
  } else if (operator == "%") {
    return makeNum(lhs.value % rhs.value);
  } else if (operator == ">") {
    return makeBool(lhs.value > rhs.value);
  } else if (operator == "<") {
    return makeBool(lhs.value < rhs.value);
  } else if (operator == ">=") {
    return makeBool(lhs.value >= rhs.value);
  } else if (operator == "<=") {
    return makeBool(lhs.value <= rhs.value);
  }

  return makeNull(); // Default case...
}

function isEqual(lhs: RuntimeVal, rhs: RuntimeVal): RuntimeVal {
  switch (lhs.type) {
    case "boolean":
      return makeBool((lhs as BoolVal).value == (rhs as BoolVal).value);
    case "number":
      return makeBool((lhs as NumVal).value == (rhs as NumVal).value);
    case "null":
      return makeBool((lhs as NullVal).value == (rhs as NullVal).value);
    case "object":
      return makeBool((lhs as ObjectVal).properties == (rhs as ObjectVal).properties);

    default:
      throw new Error(
        `Zounds! One unfortunately does not possess the ability to compare these types! ${lhs} and ${rhs}`
      );
  }
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

  return evalNumBinaryExpr(left as NumVal, right as NumVal, binop.operator);
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
