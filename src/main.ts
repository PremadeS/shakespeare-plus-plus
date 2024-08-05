import { Program } from "./frontend/ast";
import Parser from "./frontend/parser";
import Environment from "./runtime/environment";
import { interpret } from "./runtime/interpreter";
import { NumVal, makeNull, makeBool, makeNum } from "./runtime/values";
import * as readLineSync from "readline-sync";

const parser = new Parser();

repl();

async function repl() {
  console.log("\nRepl v0.1");
  while (true) {
    const input: string = readLineSync.question("~swagger~ ");
    const env = new Environment();

    env.declareVar("x", makeNum(100));
    env.declareVar("y", makeNum(50));
    env.declareVar("asTrueAsTheLightOfDay", makeBool(true)); //   True...
    env.declareVar("asFalseAsAFlimsyFabric", makeBool(false)); // False...
    env.declareVar("asHollowAsAFoolsHead", makeNull()); //        Null...

    if (!input || input.includes("exit")) {
      process.exit(1);
    }
    // Parse...
    let program: Program = parser.produceAST(input);

    // Interpret...
    console.log(interpret(program, env));
  }
}
