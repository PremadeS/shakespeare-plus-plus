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
  EOF,
}

export interface Token {
  value: string;
  type: TokenType;
}
const KEYWORDS: Record<string, TokenType> = {
  alloweth: TokenType.Alloweth,
  thy: TokenType.Thy,
  to: TokenType.To,
  beest: TokenType.Beest,
  respectfully: TokenType.Respectfully,
  addethPolitelyWith: TokenType.BinaryOperator,
  subtractethPolitelyWith: TokenType.BinaryOperator,
  multiplethPolitelyWith: TokenType.BinaryOperator,
  dividethPolitelyWith: TokenType.BinaryOperator,
  modulethPolitelyWith: TokenType.BinaryOperator,
};

// Maketh Token
function token(type: TokenType, value: string): Token {
  return { value, type };
}

function isAlphabet(str: string) {
  return str.toUpperCase() != str.toLowerCase();
}

function isNumber(str: string) {
  return str >= "0" && str <= "9";
}
function isWhiteSpace(str: string) {
  return str == " " || str == "\n" || str == "\t";
}
/*  +-----------------------------------------------------------------------+
 *  |----- Converts identifier to equivalent BinaryOperator... -------------|
 *  |----- if not an operator identifier, then returns the same string... --|
 *  |----- Basically you have to write these instead of +, - ...etc --------|
 *  +-----------------------------------------------------------------------+  */
function convertethToOperator(str: string): string {
  if (str == "addethPolitelyWith") {
    return "+";
  } else if (str == "subtractethPolitelyWith") {
    return "-";
  } else if (str == "multiplethPolitelyWith") {
    return "*";
  } else if (str == "dividethPolitelyWith") {
    return "/";
  } else if (str == "modulethPolitelyWith") {
    return "%";
  }
  return str;
}

export function tokenize(source: string): Token[] {
  const tokens = new Array<Token>();
  const src = source.split("");
  let pos = 0;
  while (pos < src.length) {
    // Single character tokens...
    if (isWhiteSpace(src[pos])) {
      ++pos;
      continue;
    } else if (src[pos] == "(") {
      tokens.push(token(TokenType.OpenParen, src[pos]));
    } else if (src[pos] == ")") {
      tokens.push(token(TokenType.CloseParen, src[pos]));
    } else if (src[pos] == "=") {
      tokens.push(token(TokenType.Equals, src[pos]));
    } //Multi character tokens...
    else {
      if (isAlphabet(src[pos])) {
        let identifier: string = src[pos];
        ++pos;
        while (pos < src.length && isAlphabet(src[pos])) {
          identifier += src[pos];
          ++pos;
        }
        const reserved = KEYWORDS[identifier];
        if (reserved != undefined) {
          tokens.push(token(KEYWORDS[identifier], convertethToOperator(identifier)));
        } else {
          tokens.push(token(TokenType.Identifier, identifier));
        }
        --pos;
      } else if (isNumber(src[pos])) {
        let num: string = src[pos];
        ++pos;
        while (pos < src.length && isNumber(src[pos])) {
          num += src[pos];
          ++pos;
        }
        tokens.push(token(TokenType.Number, num));
        --pos;
      } else {
        console.error("Unanticipated token hath found: ", src[pos]);
        process.exit(1);
      }
    }
    ++pos;
  }
  // Endeth of fileth
  tokens.push(token(TokenType.EOF, "EOF"));
  return tokens;
}
