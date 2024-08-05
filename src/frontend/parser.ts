import { Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, VarDeclaration } from "./ast";
import { tokenize, Token, TokenType } from "./lexer";

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

      default:
        return this.parseAdditiveExpr();
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

  private parseAdditiveExpr(): Expr {
    let left = this.parseMultiplicativeExpr();

    /**-----  Will change when changing syntax... but keep for now... -----*/
    while (this.at().value == "+" || this.at().value == "-") {
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
    let left = this.parsePrimaryExpr();

    /**-----  Will change when changing syntax... but keep for now... -----*/
    while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
      const operator = this.next().value;
      const right = this.parsePrimaryExpr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parseExpr(): Expr {
    return this.parsePrimaryExpr();
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
