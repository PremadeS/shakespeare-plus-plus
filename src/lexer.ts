import * as fs from "fs";
export enum TokenType {
  Number,
  BinaryOperator,
  Equals,
  Identifier,
  OpenParen,
  CloseParen,
  Alloweth,
  Thy,
  To,
  Beest,
  Respectfully,
}

export interface Token {
  value: String;
  type: TokenType;
}
const KEYWORDS: Record<string, TokenType> = {
  alloweth: TokenType.Alloweth,
  thy: TokenType.Thy,
  to: TokenType.To,
  beest: TokenType.Beest,
  respectfully: TokenType.Respectfully,
};
// Creates Token
function token(type: TokenType, value: String): Token {
  return { value, type };
}

function isAlphabet(str: String) {
  return str.toUpperCase() != str.toLowerCase();
}

function isInteger(str: string) {
  const num = parseInt(str, 10);
  return !isNaN(num) && num.toString() === str;
}

export function tokenize(source: String): Token[] {
  const tokens = new Array<Token>();
  const src = source.split(/\s+/);
  let pos = 0;
  while (pos < src.length) {
    // Single character tokens...
    if (src[pos] == "(") {
      tokens.push(token(TokenType.OpenParen, src[pos]));
    } else if (src[pos] == ")") {
      tokens.push(token(TokenType.CloseParen, src[pos]));
    } else if (src[pos] == "+" || src[pos] == "-" || src[pos] == "*" || src[pos] == "/") {
      tokens.push(token(TokenType.BinaryOperator, src[pos]));
    } else if (src[pos] == "=") {
      tokens.push(token(TokenType.Equals, src[pos]));
    }
    // Handle Multi-character tokens...
    else if (isAlphabet(src[pos])) {
      // Checking for reserved keywords....
      let reserved = KEYWORDS[src[pos]];
      if (reserved == undefined) {
        tokens.push(token(TokenType.Identifier, src[pos]));
      } else {
        tokens.push(token(reserved, src[pos]));
      }
    } else if (isInteger(src[pos])) {
      tokens.push(token(TokenType.Number, src[pos]));
    } else {
      console.log("In: ", src[pos]);
      throw new Error("Unrecognized Token Found");
    }
    ++pos;
  }

  return tokens;
}

const filePath = "./test.txt";
const source = fs.readFileSync(filePath, "utf-8");

for (const token of tokenize(source)) {
  console.log(token);
}
