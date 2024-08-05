import * as fs from "fs";
export enum TokenType {
  Number,
  BinaryOperator,
  Identifier,
  OpenParen,
  CloseParen,

  Const,
  Granteth,
  Yonder,
  Equals,
  Terminator, //Statement terminator...

  EOF,
}

export interface Token {
  value: string;
  type: TokenType;
}

const KEYWORDS: Record<string, TokenType> = {
  granteth: TokenType.Granteth,
  yonder: TokenType.Yonder,
  equivalethTo: TokenType.Equals, //                      =
  withUtmostRespect: TokenType.Terminator, //             ;
  addethPolitelyWith: TokenType.BinaryOperator, //        +
  subtractethPolitelyWith: TokenType.BinaryOperator, //   -
  multiplethPolitelyWith: TokenType.BinaryOperator, //    *
  dividethPolitelyWith: TokenType.BinaryOperator, //      /
  modulethPolitelyWith: TokenType.BinaryOperator, //      %
  steadFast: TokenType.Const, // constant
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
 *  |----- Converts identifier to a simpler keyword/symbol... ---------------------|
 *  |----- if not an operator identifier, then returns the same string... --|
 *  |----- Basically you have to write these instead of +, - ...etc --------|
 *  +-----------------------------------------------------------------------+  */
function translateOperation(str: string): string {
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
  } else if (str == "equivalethTo") {
    return "=";
  } else if (str == "withUtmostRespect") {
    return ";";
  } else if (str == "steadFast") {
    return "const";
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
          tokens.push(token(KEYWORDS[identifier], translateOperation(identifier)));
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
        console.error("Unseen token hath appeared: ", src[pos]);
        process.exit(1);
      }
    }
    ++pos;
  }
  // Endeth of fileth
  tokens.push(token(TokenType.EOF, "EOF"));
  return tokens;
}
