export enum TokenType {
  Number,
  BinaryOperator,
  Identifier,
  If,
  Else,
  For,
  While,

  OpenParen, //           (
  CloseParen, //          )
  OpenBrace, //           {
  CloseBrace, //          }
  OpenBracket, //         [
  CloseBracket, //        ]
  Comma, //               ,
  Colon, //               :
  Dot, //                 .
  And, //                 &
  Or, //                  |
  EqualTo, //             ==
  NotEqualTo, //          !=
  Greater, //             >
  Less, //                <
  GreaterThanEqual, //    >=
  LessThanEqual, //       <=

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
  equivalethTo: TokenType.Equals, //                                =
  addethPolitelyWith: TokenType.BinaryOperator, //                  +
  subtractethPolitelyWith: TokenType.BinaryOperator, //             -
  multiplethPolitelyWith: TokenType.BinaryOperator, //              *
  dividethPolitelyWith: TokenType.BinaryOperator, //                /
  modulethPolitelyWith: TokenType.BinaryOperator, //                %
  invokeThouComma: TokenType.Comma, //                              ,
  summonThyColon: TokenType.Colon, //                               :
  withUtmostRespect: TokenType.Terminator, //                       ;
  fullethStop: TokenType.Dot, //                                    .
  "`andeth`": TokenType.And, //                                     &
  "`either`": TokenType.Or, //                                      |
  "`equivalethTo`": TokenType.EqualTo, //                           ==
  "`notEquivalethTo`": TokenType.NotEqualTo, //                     !=
  "`greaterThanThou`": TokenType.Greater, //                        >
  "`lessThanThou`": TokenType.Less, //                              <
  "`greaterThanEquivalethToThou`": TokenType.GreaterThanEqual, //        >=
  "`lessThanEquivalethToThou`": TokenType.LessThanEqual, //              <=
  steadFast: TokenType.Const, //                                    constant

  providethThouFindestThyConditionTrue: TokenType.If,
  elsewiseRunnethThis: TokenType.Else,
  forsoothCyclethThroughThyRange: TokenType.For,
  whilstThouConditionHolds: TokenType.While,
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
  return str == " " || str == "\n" || str == "\t" || str == "\r";
}

/*  +-----------------------------------------------------------------------+
 *  |----- Converts identifier to a simpler keyword/symbol... ---------------------|
 *  |----- if not an operator identifier, then returns the same string... --|
 *  |----- Basically you have to write these instead of +, - ...etc --------|
 *  +-----------------------------------------------------------------------+  */
function translateOperation(str: string): string {
  switch (str) {
    case "addethPolitelyWith":
      return "+";
    case "subtractethPolitelyWith":
      return "-";
    case "multiplethPolitelyWith":
      return "*";
    case "dividethPolitelyWith":
      return "/";
    case "modulethPolitelyWith":
      return "%";
    case "equivalethTo":
      return "=";
    case "withUtmostRespect":
      return ";";
    case "summonThyColon":
      return ":";
    case "invokeThouComma":
      return ",";
    case "fullethStop":
      return ".";
    case "`andeth`":
      return "&";
    case "`either`":
      return "|";
    case "`equivalethTo`":
      return "==";
    case "`notEquivalethTo`":
      return "!=";
    case "`greaterThanThou`":
      return ">";
    case "`lessThanThou`":
      return "<";
    case "`greaterThanEquivalethToThou`":
      return ">=";
    case "`lessThanEquivalethToThou`":
      return "<=";
    case "providethThouFindestThyConditionTrue":
      return "if";
    case "elsewiseRunnethThis":
      return "else";
    case "forsoothCyclethThroughThyRange":
      return "for";
    case "whilstThouConditionHolds":
      return "while";
    case "steadFast":
      return "const";
    default:
      return str;
  }
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
    } else if (src[pos] == "{") {
      tokens.push(token(TokenType.OpenBrace, src[pos]));
    } else if (src[pos] == "}") {
      tokens.push(token(TokenType.CloseBrace, src[pos]));
    } else if (src[pos] == "[") {
      tokens.push(token(TokenType.OpenBracket, src[pos]));
    } else if (src[pos] == "]") {
      tokens.push(token(TokenType.CloseBracket, src[pos]));
    } //Multi character tokens...
    else {
      if (src[pos] == "`") {
        let identifier: string = src[pos];
        ++pos;
        while (pos < src.length && src[pos] != "`") {
          identifier += src[pos];
          ++pos;
        }
        identifier += "`";
        const reserved = KEYWORDS[identifier];
        if (reserved != undefined) {
          tokens.push(token(KEYWORDS[identifier], translateOperation(identifier)));
        } else {
          tokens.push(token(TokenType.Identifier, identifier));
        }
      } else if (isAlphabet(src[pos])) {
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
