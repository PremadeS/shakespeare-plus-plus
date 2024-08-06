export type NodeType = "Program" | "VarDeclaration" | "AssignmentExpr" | "NumericLiteral" | "Identifier" | "BinaryExpr";

// Statements (doth not result in a value at runtime)...
export interface Stmt {
  kind: NodeType;
}

// Program (an array of statements)...
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

export interface VarDeclaration extends Stmt {
  kind: "VarDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expr; // can be Expr or undefined..
}

// Expression (outcomes in a value at runtime)...
export interface Expr extends Stmt {}

//Types of Expressions...

export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assignee: Expr; // left
  value: Expr; //    right
}
