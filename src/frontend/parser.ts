import { BoolVal, makeBool } from "../runtime/values";
import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  VarDeclaration,
  AssignmentExpr,
  Property,
  ObjectLiteral,
  CallExpr,
  MemberExpr,
  IfStatement,
  ForStatement,
  WhileStatement,
} from "./ast";
import { tokenize, Token, TokenType } from "./lexer";

/** =====================================================+
 *---- Order Of Precedence... ----                       |
 * Assignment                 <--- Lowest Precedence...  |
 * Object                                                |
 * AdditiveExpr                                          |
 * MultiplicativeExpr                                    |
 * Call                                                  |
 * Member                                                |
 * PrimaryExpr                <--- Highest Precedence... |
 ** =====================================================+     */
export default class Parser {
  private tokens: Token[] = [];
  private pos: number = 0;

  private eof() {
    return this.pos >= this.tokens.length || this.tokens[this.pos].type == TokenType.EOF;
  }

  private at(): Token {
    return this.tokens[this.pos];
  }

  // Returneth the token at current position, then increment the position...
  private next(): Token {
    const prev: Token = this.at();
    ++this.pos;
    return prev;
  }

  // Similar to next() but logs an error msg if faileth...
  private expect(type: TokenType, err: any): Token {
    const prev: Token = this.at();

    if (!prev || prev.type != type) {
      console.error(
        "Parser’s blunder!: ",
        err,
        "\nBehold, the type that hath appeared: ",
        prev,
        "Anticipating type:",
        type
      );
      process.exit(1);
    }

    ++this.pos;
    return prev;
  }

  // reset position...
  private resetPos() {
    this.pos = 0;
  }

  public produceAST(source: string): Program {
    this.resetPos();
    this.tokens = tokenize(source);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (!this.eof()) {
      program.body.push(this.parseStmt());
    }
    return program;
  }

  private parseStmt(): Stmt {
    switch (this.at().type) {
      case TokenType.Granteth:
      case TokenType.Const:
        return this.parseVarDeclaration();
      case TokenType.If:
        return this.parseIfStmt();
      case TokenType.For:
        return this.parseForStmt();
      case TokenType.While:
        return this.parseWhileStmt();
      default:
        return this.parseExpr();
    }
  }

  // granteth yonder *identifier* equivalethTo *value* withUtmostRespect
  private parseVarDeclaration(): Stmt {
    const isConstant: boolean = this.next().type == TokenType.Const;
    this.expect(TokenType.Yonder, "Syntax mistake forgetting 'yonder' respectfully");

    const identifer = this.expect(
      TokenType.Identifier,
      "Syntax mistake forgetting 'identifier / variable name' respectfully."
    ).value;

    if (this.at().type == TokenType.Terminator) {
      if (isConstant) {
        throw new Error("Thou must bestoweth value upon yond steadfast variable respectfully.");
      }
      this.next(); // Skipping terminator...
      return { kind: "VarDeclaration", constant: false, identifier: identifer } as VarDeclaration;
    }

    this.expect(TokenType.Equals, "Syntax mistake forgetting 'equivalethTo' respectfully");

    const declaration = {
      kind: "VarDeclaration",
      constant: isConstant,
      identifier: identifer,
      value: this.parseStmt(),
    } as VarDeclaration;

    this.expect(TokenType.Terminator, "Syntax mistake forgetting 'withUtmostRespect' respectfully");

    return declaration;
  }

  private parseIfStmt(): Stmt {
    this.next();
    this.expect(TokenType.OpenParen, "Syntax mistake forgetting '(' respectfully");
    const condition = this.parseExpr();
    this.expect(TokenType.CloseParen, "Syntax mistake forgetting ')' respectfully");

    const body = this.parseBlockStmt();

    let other: Stmt[] = [];

    if (this.at().type == TokenType.Else) {
      this.next();

      if (this.at().type == TokenType.If) {
        other = [this.parseIfStmt()];
      } else {
        other = this.parseBlockStmt();
      }
    }

    return { kind: "IfStatement", body, condition, other } as IfStatement;
  }

  // for(let i = 0; i < 10; i = i + 1){}
  private parseForStmt(): Stmt {
    this.next();
    this.expect(TokenType.OpenParen, "Syntax mistake forgetting '(' respectfully");
    const init = this.parseVarDeclaration();
    const condition = this.parseExpr();

    this.expect(TokenType.Terminator, "Syntax mistake forgetting 'withUtmostRespect' respectfully");

    const update = this.parseExpr();

    this.expect(TokenType.CloseParen, "Syntax mistake forgetting ')' respectfully");

    const body = this.parseBlockStmt();

    return {
      kind: "ForStatement",
      init,
      condition,
      update,
      body,
    } as ForStatement;
  }

  private parseWhileStmt(): Stmt {
    this.next();
    this.expect(TokenType.OpenParen, "Syntax mistake forgetting '(' respectfully");

    const condition = this.parseExpr();
    this.expect(TokenType.CloseParen, "Syntax mistake forgetting ')' respectfully");

    const body = this.parseBlockStmt();

    return {
      kind: "WhileStatement",
      condition,
      body,
    } as WhileStatement;
  }

  private parseBlockStmt(): Stmt[] {
    this.expect(TokenType.OpenBrace, "Syntax mistake forgetting '{' respectfully");
    const body: Stmt[] = [];

    while (!this.eof() && this.at().type != TokenType.CloseBrace) {
      body.push(this.parseStmt());
    }

    this.expect(TokenType.CloseBrace, "Syntax mistake forgetting '}' respectfully");
    return body;
  }

  private parseExpr(): Expr {
    return this.parseAssignmentExpr();
  }

  private parseAssignmentExpr(): Expr {
    const lhs = this.parseObjectExpr();
    if (this.at().type == TokenType.Equals) {
      this.next();
      const rhs = this.parseAssignmentExpr();

      this.expect(TokenType.Terminator, "Syntax mistake forgetting 'withUtmostRespect' respectfully");
      return { kind: "AssignmentExpr", assignee: lhs, value: rhs } as AssignmentExpr;
    }

    return lhs;
  }

  private parseObjectExpr(): Expr {
    if (this.at().type != TokenType.OpenBrace) {
      return this.parseAndOrExpr();
    }

    this.next();
    const properties = new Array<Property>();

    while (!this.eof() && this.at().type != TokenType.CloseBrace) {
      const key = this.expect(TokenType.Identifier, "Syntax mistake forgetting 'Identifier' respectfully").value;

      // { key, }
      if (this.at().type == TokenType.Comma) {
        this.next();
        properties.push({ kind: "Property", key });
        continue;
        // { key }
      } else if (this.at().type == TokenType.CloseBrace) {
        this.next();
        properties.push({ kind: "Property", key });
        continue;
      }

      // {key: val}
      this.expect(TokenType.Colon, "Syntax mistake forgetting 'summonThyColon' respectfully");
      const value = this.parseExpr();

      properties.push({ kind: "Property", key, value });
      if (this.at().type != TokenType.CloseBrace) {
        this.expect(TokenType.Comma, "Syntax mistake forgetting 'invokeThouComma' OR '}' respectfully");
      }
    }

    this.expect(TokenType.CloseBrace, "Syntax mistake forgetting '}' respectfully");
    return { kind: "ObjectLiteral", properties: properties } as ObjectLiteral;
  }

  private parseAndOrExpr(): Expr {
    let left = this.parseAdditiveExpr();

    if (this.at().value == "&" || this.at().value == "|") {
      const operator = this.next().value;
      const right = this.parseAdditiveExpr();

      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
      while (this.at().type == TokenType.And || this.at().type == TokenType.Or) {
        left = {
          kind: "BinaryExpr",
          left,
          operator: this.next().value,
          right: this.parseExpr(),
        } as BinaryExpr;
      }
    }

    return left;
  }

  private parseAdditiveExpr(): Expr {
    let left = this.parseMultiplicativeExpr();

    /**-----  Will change when changing syntax... but keep for now... -----*/
    while (["+", "-", "==", "!=", ">", "<", ">=", "<="].includes(this.at().value)) {
      const operator = this.next().value;
      const right = this.parseMultiplicativeExpr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parseMultiplicativeExpr(): Expr {
    let left = this.parseCallMemberExpr();

    while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
      const operator = this.next().value;
      const right = this.parseCallMemberExpr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parseCallMemberExpr(): Expr {
    const member: Expr = this.parseMemberExpr();

    if (this.at().type == TokenType.OpenParen) {
      return this.parseCallExpr(member);
    }

    return member;
  }

  private parseMemberExpr(): Expr {
    let object: Expr = this.parsePrimaryExpr();

    while (this.at().type == TokenType.Dot || this.at().type == TokenType.OpenBracket) {
      const operator = this.next();
      let property: Expr;
      let computed: boolean;

      // For nay computed values...
      if (operator.type == TokenType.Dot) {
        computed = false;
        property = this.parsePrimaryExpr();

        if (property.kind != "Identifier") {
          throw new Error("Thou canst not use the fullStop without a merry Identifier!");
        }
      } else {
        computed = true;
        property = this.parseExpr();
        this.expect(TokenType.CloseBracket, "Syntax mistake forgetting ']' respectfully.");
      }
      object = { kind: "MemberExpr", object, property, computed } as MemberExpr;
    }

    return object;
  }

  private parseCallExpr(caller: Expr): Expr {
    let callExpr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parseArgs(),
    } as CallExpr;

    if (this.at().type == TokenType.OpenParen) {
      callExpr = this.parseCallExpr(callExpr);
    }
    return callExpr;
  }

  private parseArgs(): Expr[] {
    this.expect(TokenType.OpenParen, "Syntax mistake forgetting '(' respectfully.");
    const args = this.at().type == TokenType.CloseParen ? [] : this.parseArgsList();

    this.expect(TokenType.CloseParen, "Syntax mistake forgetting ') respectfully.");
    return args;
  }

  private parseArgsList(): Expr[] {
    const args = [this.parseAssignmentExpr()];

    while (!this.eof() && this.at().type == TokenType.Comma && this.next()) {
      args.push(this.parseAssignmentExpr());
    }

    return args;
  }

  private parsePrimaryExpr(): Expr {
    const tk = this.at().type;

    /*  +--------------------------------------+
     *  |--- Determine the current token... ---|
     *  |--- and return the literal... --------|
     *  +--------------------------------------+  */

    switch (tk) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.next().value } as Identifier;

      case TokenType.Number:
        return { kind: "NumericLiteral", value: parseFloat(this.next().value) } as NumericLiteral;

      case TokenType.OpenParen: {
        this.next();
        const val = this.parseStmt();
        this.expect(TokenType.CloseParen, "Alas, the closing parenthesis ')' doth play hide and seek!");
        return val;
      }

      default:
        console.error("By my troth, an unbidden Token hath sprung upon the parser!: ", this.at());
        process.exit(1);
    }
  }
}
