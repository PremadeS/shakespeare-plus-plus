import { ValueType, RuntimeVal, NumVal, NullVal } from "./values";
import { NodeType, NumericLiteral, Stmt, BinaryExpr, Program, Identifier } from "../frontend/ast";
import Environment from "./environment";

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

function evalIdentifier(identifer: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(identifer.symbol);
  return val;
}

function interpretBinaryExpr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const left = interpret(binop.left, env);
  const right = interpret(binop.right, env);

  if (left.type == "number" && right.type == "number") {
    return evalNumBinaryExpr(left as NumVal, right as NumVal, binop.operator);
  }

  return { type: "null", value: "null" } as NullVal;
}

function interpretProgram(program: Program, env: Environment): RuntimeVal {
  let lastInterpreted: RuntimeVal = { type: "null", value: "null" } as NullVal;

  // Evaluating every statement in program body...
  for (const statament of program.body) {
    lastInterpreted = interpret(statament, env);
  }

  return lastInterpreted;
}

export function interpret(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return { value: (astNode as NumericLiteral).value, type: "number" } as NumVal;

    case "Identifier":
      return evalIdentifier(astNode as Identifier, env);

    case "BinaryExpr":
      return interpretBinaryExpr(astNode as BinaryExpr, env);

    case "Program":
      return interpretProgram(astNode as Program, env);

    default:
      console.error("Lo! This ASTNode doth baffle me like a riddle wrapped in mystery", astNode);
      process.exit(1);
  }
}
