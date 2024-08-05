import { RuntimeVal } from "./values";

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;

  constructor(parentEnv?: Environment) {
    this.parent = parentEnv;
    this.variables = new Map();
  }

  // TODO: change error statments to shakesperean ones...

  public declareVar(varName: string, value: RuntimeVal): RuntimeVal {
    if (this.variables.has(varName)) {
      throw new Error(`cannot declare variable '${varName}' it is already defined`);
    }

    this.variables.set(varName, value);
    return value;
  }

  public assignVar(varName: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varName);
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
      throw new Error(`cannot resolve variable name ${varName}`);
    }

    return this.parent.resolve(varName);
  }
}
