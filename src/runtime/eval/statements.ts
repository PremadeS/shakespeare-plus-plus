import { Program, VarDeclaration } from "../../frontend/ast";
import Environment from "../environment";
import { interpret } from "../interpreter";
import { RuntimeVal, NullVal, makeNull } from "../values";

export function interpretProgram(program: Program, env: Environment): RuntimeVal {
  let lastInterpreted: RuntimeVal = { type: "null", value: "null" } as NullVal;

  // Evaluating every statement in program body...
  for (const statament of program.body) {
    lastInterpreted = interpret(statament, env);
  }

  return lastInterpreted;
}

export function interpretVarDeclaration(declaration: VarDeclaration, env: Environment): RuntimeVal {
  const val = declaration.value ? interpret(declaration.value, env) : makeNull();
  return env.declareVar(declaration.identifier, val, declaration.constant);
}
