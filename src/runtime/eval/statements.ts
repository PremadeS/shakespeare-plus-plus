import {
  FnDeclaration,
  ForStatement,
  IfStatement,
  Program,
  Stmt,
  VarDeclaration,
  ArrDeclaration,
  WhileStatement,
} from "../../frontend/ast";
import Environment from "../environment";
import { interpret } from "../interpreter";
import { RuntimeVal, NullVal, makeNull, BoolVal, FunctionVal, makeArray } from "../values";
import { interpretAssignment } from "./expressions";

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

export function interpretArrDeclaration(declaration: ArrDeclaration, env: Environment): RuntimeVal {
  let variable: RuntimeVal = makeNull();

  // array name will contain its first value...
  let val = declaration.values[0] ? interpret(declaration.values[0], env) : makeNull();
  env.declareVar(declaration.identifier, makeArray(declaration.identifier, val), declaration.constant);

  for (let i = 0; i < declaration.values.length; ++i) {
    const val = declaration.values[i] ? interpret(declaration.values[i], env) : makeNull();
    env.declareVar(i + declaration.identifier, val, declaration.constant);
  }

  return makeNull();
}

export function interpretFnDeclaration(declaration: FnDeclaration, env: Environment): RuntimeVal {
  const fn = {
    type: "function",
    name: declaration.name,
    parameters: declaration.parameters,
    declereationEnv: env,
    body: declaration.body,
  } as FunctionVal;

  return env.declareVar(declaration.name, fn, true);
}

export function interpretIfStmt(stmt: IfStatement, env: Environment): RuntimeVal {
  const condition = interpret(stmt.condition, env);
  if ((condition as BoolVal).value === true) {
    return interpretBody(stmt.body, env);
  } else {
    return interpretBody(stmt.other, env);
  }
}

export function interpretForStmt(stmt: ForStatement, env: Environment) {
  const newEnv = new Environment(env);
  interpretVarDeclaration(stmt.init, newEnv);

  const body = stmt.body;
  const update = stmt.update;

  let condition = interpret(stmt.condition, newEnv);
  if ((condition as BoolVal).value !== true) {
    return makeNull();
  }

  do {
    interpretBody(stmt.body, newEnv, false);
    interpretAssignment(update, newEnv);

    condition = interpret(stmt.condition, newEnv);
  } while ((condition as BoolVal).value);

  return makeNull();
}

export function interpretWhileStmt(stmt: WhileStatement, env: Environment) {
  const newEnv = new Environment(env);

  const body = stmt.body;

  let condition = interpret(stmt.condition, newEnv);

  if ((condition as BoolVal).value !== true) {
    return makeNull();
  }

  do {
    interpretBody(stmt.body, newEnv, false);
    condition = interpret(stmt.condition, newEnv);
  } while ((condition as BoolVal).value);

  return makeNull();
}

export function interpretBody(stmts: Stmt[], env: Environment, newEnv: boolean = true): RuntimeVal {
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
