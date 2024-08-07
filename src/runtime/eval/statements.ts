import { IfStatement, Program, Stmt, VarDeclaration } from "../../frontend/ast";
import Environment from "../environment";
import { interpret } from "../interpreter";
import { RuntimeVal, NullVal, makeNull, BoolVal } from "../values";

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

export function interpretIfStmt(stmt: IfStatement, env: Environment): RuntimeVal {
  const condition = interpret(stmt.condition, env);
  if ((condition as BoolVal).value === true) {
    return evalBody(stmt.body, env);
  } else {
    return evalBody(stmt.other, env);
  }
}

export function evalBody(stmts: Stmt[], env: Environment, newEnv: boolean = true): RuntimeVal {
  let scope: Environment;
  if (newEnv) {
    scope = new Environment(env);
  } else {
    scope = env;
  }
  let res: RuntimeVal = makeNull();

  for (const stmt of stmts) {
    res = interpret(stmt, scope);
  }

  return res;
}
