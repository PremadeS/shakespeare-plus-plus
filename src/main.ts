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
  const env = new Environment();
  env.declareVar("x", makeNum(100), false);
  env.declareVar("y", makeNum(50), false);
  env.declareVar("asTrueAsTheLightOfDay", makeBool(true), true); //   True...
  env.declareVar("asFalseAsAFlimsyFabric", makeBool(false), true); // False...
  env.declareVar("asHollowAsAFoolsHead", makeNull(), true); //        Null...

  while (true) {
    const input: string = readLineSync.question("~swagger~ ");

    if (!input || input.includes("exit")) {
      process.exit(1);
    }
    // Parse...
    let program: Program = parser.produceAST(input);

    // Interpret...
    console.log(interpret(program, env));
  }
}
