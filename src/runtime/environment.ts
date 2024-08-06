import { RuntimeVal } from "./values";

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
}
