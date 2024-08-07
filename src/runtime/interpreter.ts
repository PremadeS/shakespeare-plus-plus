import { ValueType, RuntimeVal, NumVal, NullVal } from "./values";
import {
  NodeType,
  NumericLiteral,
  Stmt,
  BinaryExpr,
  Program,
  Identifier,
  VarDeclaration,
  AssignmentExpr,
  ObjectLiteral,
  IfStatement,
  ForStatement,
  WhileStatement,
} from "../frontend/ast";
import Environment from "./environment";
import {
  interpretForStmt,
  interpretIfStmt,
  interpretProgram,
  interpretVarDeclaration,
  interpretWhileStmt,
} from "./eval/statements";
import { evalIdentifier, evalObjectExpr, interpretAssignment, interpretBinaryExpr } from "./eval/expressions";

export function interpret(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return { value: (astNode as NumericLiteral).value, type: "number" } as NumVal;

    case "Identifier":
      return evalIdentifier(astNode as Identifier, env);

    case "ObjectLiteral":
      return evalObjectExpr(astNode as ObjectLiteral, env);

    case "BinaryExpr":
      return interpretBinaryExpr(astNode as BinaryExpr, env);

    case "AssignmentExpr":
      return interpretAssignment(astNode as AssignmentExpr, env);

    case "Program":
      return interpretProgram(astNode as Program, env);

    case "VarDeclaration":
      return interpretVarDeclaration(astNode as VarDeclaration, env);

    case "IfStatement":
      return interpretIfStmt(astNode as IfStatement, env);

    case "ForStatement":
      return interpretForStmt(astNode as ForStatement, env);

    case "WhileStatement":
      return interpretWhileStmt(astNode as WhileStatement, env);

    default:
      console.error("Lo! This ASTNode doth baffle me like a riddle wrapped in mystery", astNode);
      process.exit(1);
  }
}
