import { Identifier, MemberExpr } from "../frontend/ast";
import * as readLineSync from "readline-sync";

import {
  ArrayVal,
  BoolVal,
  NumVal,
  ObjectVal,
  RuntimeVal,
  StringVal,
  makeBool,
  makeNativeFn,
  makeNull,
  makeNum,
  makeObject,
  makeString,
} from "./values";
import Parser from "../frontend/parser";
import path from "path";
import fs from "fs";
import { interpret } from "./interpreter";
function timeFunction(args: RuntimeVal[], env: Environment): RuntimeVal {
  return makeNum(Date.now());
}

function printFunction(args: RuntimeVal[], env: Environment): RuntimeVal {
  let result: string = "";
  for (let i = 0; i < args.length; ++i) {
    switch (args[i].type) {
      case "null":
        result += "AsHollowAsAFoolsHead";
        break;
      case "boolean": {
        if ((args[i] as BoolVal).value == true) {
          result += "AsTrueAsTheLightOfDay";
        } else {
          result += "AsFalseAsAFlimsyFabric";
        }
        break;
      }
      case "number":
        result += (args[i] as NumVal).value;
        break;
      case "string":
        result += (args[i] as StringVal).value;
        break;
      case "object":
        for (const prop of (args[i] as ObjectVal).properties) {
          result += JSON.stringify(prop) + "\n";
        }
        break;

      default:
        console.log(JSON.stringify(args[i]));
        break;
    }
  }
  process.stdout.write(result);
  return makeNull();
}

export function createGlobalEnv(): Environment {
  const env = new Environment();

  env.declareVar("asTrueAsTheLightOfDay", makeBool(true), true); //     True...
  env.declareVar("asFalseAsAFlimsyFabric", makeBool(false), true); //   False...
  env.declareVar("asHollowAsAFoolsHead", makeNull(), true); //          Null...

  //Maketh Native built-in functions...

  //Print...
  env.declareVar("printethThouWordsForAllToSee", makeNativeFn(printFunction), true);

  //Current Time...
  env.declareVar("revealThyTime", makeNativeFn(timeFunction), true);

  //Inputs...
  env.declareVar(
    "readethThineStringInput",
    makeNativeFn((args) => {
      let input: string = readLineSync.question();
      return makeString(input);
    }),
    true
  );
  env.declareVar(
    "readethThineNumInput",
    makeNativeFn((args) => {
      let input: string = readLineSync.question();
      let res = Number(input);
      if (!res) {
        throw new Error(`Thy number proves itself a whimsical fool!: ${input}`);
      }
      return makeNum(res);
    }),
    true
  );

  // Addeth Another file...
  env.declareVar(
    "import",
    makeNativeFn((args) => {
      // Go to main folder (shakespeare++)
      const filePath = path.dirname(path.dirname(__dirname)) + "/" + (args[0] as StringVal).value;

      let input;
      // change .txt to .spp
      if (filePath.endsWith(".spp")) {
        input = fs.readFileSync(filePath, "utf-8");
      } else {
        throw new Error("Lo, this file doth not bear the mark of the sacred .spp!: " + path);
      }
      const parser = new Parser();
      const program = parser.produceAST(input);

      return interpret(program, env);
    }),
    true
  );

  // Arithmetic things...
  env.declareVar(
    "calculationShenanigans",
    makeObject(
      new Map()
        .set("pi", makeNum(Math.PI))
        .set("e", makeNum(Math.E))
        .set(
          "unveilThyAbsoluteWorth",
          makeNativeFn((args) => {
            const arg = (args[0] as NumVal).value;
            return makeNum(Math.abs(arg));
          })
        )
        .set(
          "revealThouRootsWhimsy",
          makeNativeFn((args) => {
            const arg = (args[0] as NumVal).value;
            return makeNum(Math.sqrt(arg));
          })
        )
        .set(
          "witnessThisErrantDigit",
          makeNativeFn((args) => {
            const arg1 = (args[0] as NumVal).value;
            const arg2 = (args[1] as NumVal).value;

            const min = Math.ceil(arg1);
            const max = Math.floor(arg2);
            return makeNum(Math.floor(Math.random() * (max - min + 1)) + min);
          })
        )
        .set(
          "logOfTwosMeasure",
          makeNativeFn((args) => {
            const arg = (args[0] as NumVal).value;
            return makeNum(Math.log2(arg));
          })
        )
        .set(
          "logOfTenFold",
          makeNativeFn((args) => {
            const arg = (args[0] as NumVal).value;
            return makeNum(Math.log10(arg));
          })
        )
        .set(
          "greatestOfThemAll",
          makeNativeFn((args) => {
            let maxNum: number = (args[0] as NumVal).value;
            for (let i = 1; i < args.length; ++i) {
              maxNum = Math.max(maxNum, (args[i] as NumVal).value);
            }
            return makeNum(maxNum);
          })
        )
        .set(
          "littlestOfThemAll",
          makeNativeFn((args) => {
            let minNum: number = (args[0] as NumVal).value;
            for (let i = 1; i < args.length; ++i) {
              minNum = Math.min(minNum, (args[i] as NumVal).value);
            }
            return makeNum(minNum);
          })
        )
    ),
    true
  );

  return env;
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentEnv?: Environment) {
    this.parent = parentEnv;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(varName: string, value: RuntimeVal, constant: boolean): RuntimeVal {
    if (this.variables.has(varName)) {
      throw new Error(`Thou canst not declareth yond variable, ${varName} for it hath been already ordained.`);
    }
    if (constant) {
      this.constants.add(varName);
    }

    this.variables.set(varName, value);
    return value;
  }

  public assignVar(varName: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varName);

    if (env.constants.has(varName)) {
      throw new Error(`Thou canst not reassign value to yond steadfast(const) variable. ${varName}`);
    }

    env.variables.set(varName, value);
    return value;
  }

  public lookupVar(varName: string): RuntimeVal {
    const env = this.resolve(varName);
    return env.variables.get(varName) as RuntimeVal;
  }

  public resolve(varName: string): Environment {
    if (this.variables.has(varName)) {
      return this;
    }

    if (this.parent == undefined) {
      throw new Error(`Thou canst not resolve yond variable's name. ${varName}`);
    }

    return this.parent.resolve(varName);
  }

  public lookupObject(expr: MemberExpr, value?: RuntimeVal, property?: Identifier): RuntimeVal {
    let pastVal: any = {} as RuntimeVal;
    if (expr.object.kind === "MemberExpr") {
      pastVal = this.lookupObject(
        expr.object as MemberExpr,
        undefined,
        (expr.object as MemberExpr).property as Identifier
      );
    } else {
      const varname = (expr.object as Identifier).symbol;
      const env = this.resolve(varname);

      pastVal = env.variables.get(varname);
    }

    const currentProp = (expr.property as Identifier).symbol;
    const prop = property ? property.symbol : currentProp;

    if (value) {
      (pastVal as ObjectVal).properties.set(prop, value);
    }
    if (currentProp) {
      pastVal = (pastVal as ObjectVal).properties.get(currentProp) as ObjectVal;
    }
    return pastVal;
  }
}
