export type NodeType = "Program" | "NumericLiteral" | "NullLiteral" | "Identifier" | "BinaryExpr";

// Statements (doth not result in a value at runtime)...
export interface Stmt {
  kind: NodeType;
}

// Program (an array of statements)...
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
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

export interface NullLiteral extends Expr {
  kind: "NullLiteral";
  value: "null";
}
