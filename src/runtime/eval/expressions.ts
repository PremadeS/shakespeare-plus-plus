import { AssignmentExpr, BinaryExpr, CallExpr, Identifier, MemberExpr, ObjectLiteral } from "../../frontend/ast";
import { TokenType } from "../../frontend/lexer";
import Environment from "../environment";
import { interpret } from "../interpreter";
import {
  BoolVal,
  NullVal,
  NumVal,
  ObjectVal,
  RuntimeVal,
  makeNum,
  makeBool,
  makeNull,
  NativeFnVal,
  FunctionVal,
  StringVal,
  makeString,
  ArrayVal,
} from "../values";

function interpretNumBinaryExpr(left: RuntimeVal, right: RuntimeVal, operator: string, env: Environment): RuntimeVal {
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

  if (left.type == "array" && right.type == "number" && operator == "+") {
    const varName = env.lookupVar((right as NumVal).value + (left as ArrayVal).identifier);
    if (varName == undefined) {
      throw new Error(`Thou seekest an index ${(right as NumVal).value} that dwelleth not within this array’s bounds!`);
    }
    return varName;
  }
  if (left.type == "null" || right.type == "null") {
    throw new Error(
      `Alas! One cannot engage in binary antics with naught but null! ${JSON.stringify(
        left
      )} ${operator} ${JSON.stringify(right)}`
    );
  }

  if (left.type == "string" && right.type == "string" && operator == "+") {
    return makeString((left as StringVal).value + (right as StringVal).value);
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
    case "string":
      return makeBool((lhs as StringVal).value == (rhs as StringVal).value);
    case "null":
      return makeBool((lhs as NullVal).value == (rhs as NullVal).value);
    case "object":
      return makeBool((lhs as ObjectVal).properties == (rhs as ObjectVal).properties);
    case "native-fn":
      return makeBool((lhs as NativeFnVal).call == (rhs as NativeFnVal).call);
    case "function":
      return makeBool(
        (lhs as FunctionVal).body == (rhs as FunctionVal).body &&
          (lhs as FunctionVal).parameters == (rhs as FunctionVal).parameters
      );

    default:
      throw new Error(
        `Zounds! One unfortunately does not possess the ability to compare these types! ${lhs} and ${rhs}`
      );
  }
}

export function interpretIdentifier(identifer: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(identifer.symbol);
  return val;
}

export function interpretObjectExpr(obj: ObjectLiteral, env: Environment): RuntimeVal {
  const object = { type: "object", properties: new Map() } as ObjectVal;

  for (const { key, value } of obj.properties) {
    const runTimeVal = value == undefined ? env.lookupVar(key) : interpret(value, env);
    object.properties.set(key, runTimeVal);
  }

  return object;
}

export function interpretCallExpr(expr: CallExpr, env: Environment): RuntimeVal {
  // const args = expr.args.map((arg) => interpret(arg, env));
  const args: RuntimeVal[] = [];

  for (const arg of expr.args) {
    args.push(interpret(arg, env));
  }

  const fn = interpret(expr.caller, env);
  // Native functions....
  if (fn.type == "native-fn") {
    const result = (fn as NativeFnVal).call(args, env);
    return result;
  }

  // User-defined functions....
  if (fn.type == "function") {
    const func = fn as FunctionVal;
    const scope = new Environment(func.declereationEnv);

    if (args.length != func.parameters.length) {
      throw new Error(
        "Arguments not equivaleth to parameters,\nNo. of arguments: " +
          args.length +
          "\nNo. of Paramters: " +
          func.parameters.length
      );
    }

    //Maketh var for parameters list...
    for (let i = 0; i < func.parameters.length; ++i) {
      const varName = func.parameters[i];
      scope.declareVar(varName, args[i], false);
    }

    let result: RuntimeVal = makeNull();
    for (const stmt of func.body) {
      result = interpret(stmt, scope);
    }
    return result;
  }

  throw new Error("Alas, thou canst not call a value that is no function! " + JSON.stringify(fn));
}

export function interpretBinaryExpr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const left = interpret(binop.left, env);
  const right = interpret(binop.right, env);

  return interpretNumBinaryExpr(left as NumVal, right as NumVal, binop.operator, env);
}

export function interpretAssignment(node: AssignmentExpr, env: Environment): RuntimeVal {
  if (node.assignee.kind === "MemberExpr") {
    return interpretMemberExpr(env, node);
  }
  if (node.assignee.kind !== "Identifier") {
    throw new Error(
      `Thou hath committed an unworthy deed: an invalid assignation unto ${JSON.stringify(node.assignee)}.`
    );
  }

  const varName: string = (node.assignee as Identifier).symbol;
  return env.assignVar(varName, interpret(node.value, env));
}

export function interpretMemberExpr(env: Environment, node?: AssignmentExpr, expr?: MemberExpr): RuntimeVal {
  if (expr) {
    return env.lookupObject(expr);
  }
  if (node) {
    return env.lookupObject(node.assignee as MemberExpr, interpret(node.value, env));
  }

  throw new Error("Thou canst not evaluate a member expression without a rightful member or assignment!");
}
