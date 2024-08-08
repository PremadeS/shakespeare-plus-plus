export type NodeType =
  // Statements...
  | "Program"
  | "VarDeclaration"
  | "ArrDeclaration"
  | "IfStatement"
  | "ForStatement"
  | "WhileStatement"
  | "FnDeclaration"

  // Expressions...
  | "AssignmentExpr"
  | "MemberExpr"
  | "CallExpr"

  // Literals...
  | "Property"
  | "ObjectLiteral"
  | "NumericLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "StringLiteral";

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

export interface ArrDeclaration extends Expr {
  kind: "ArrDeclaration";
  constant: boolean;
  identifier: string;
  values: Expr[];
}

export interface IfStatement extends Stmt {
  kind: "IfStatement";
  body: Stmt[];
  condition: Expr;
  other: Stmt[]; // for else block...
}

export interface ForStatement extends Stmt {
  kind: "ForStatement";
  init: VarDeclaration;
  update: AssignmentExpr;
  body: Stmt[];
  condition: Expr;
}

export interface WhileStatement extends Stmt {
  kind: "WhileStatement";
  body: Stmt[];
  condition: Expr;
}
export interface FnDeclaration extends Stmt {
  kind: "FnDeclaration";
  name: string;
  parameters: string[];
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

export interface CallExpr extends Expr {
  kind: "CallExpr";
  args: Expr[];
  caller: Expr;
}

export interface MemberExpr extends Expr {
  kind: "MemberExpr";
  object: Expr;
  property: Expr;
  computed: boolean;
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

export interface Property extends Expr {
  kind: "Property";
  key: string;
  value?: Expr;
}
export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: Property[];
}

export interface StringLiteral extends Expr {
  kind: "StringLiteral";
  value: string;
}
