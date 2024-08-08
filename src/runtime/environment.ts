import { Identifier, MemberExpr } from "../frontend/ast";
import { interpret } from "./interpreter";
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
} from "./values";

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

    switch (pastVal.type) {
      case "object": {
        const currentProp = (expr.property as Identifier).symbol;
        const prop = property ? property.symbol : currentProp;

        if (value) (pastVal as ObjectVal).properties.set(prop, value);

        if (currentProp) pastVal = (pastVal as ObjectVal).properties.get(currentProp) as ObjectVal;

        return pastVal;
      }

      default:
        throw "Alas, the type thou seekest is beyond my ken!: " + pastVal.type;
    }
  }
}
