import { Program } from "./frontend/ast";
import Parser from "./frontend/parser";
import { interpret } from "./runtime/interpreter";
import * as readLineSync from "readline-sync";

const parser = new Parser();

repl();

async function repl() {
  console.log("\nRepl v0.1");
  while (true) {
    const input: string = readLineSync.question("~swagger~ ");

    if (!input || input.includes("exit")) {
      process.exit(1);
    }
    // Parse...
    let program: Program = parser.produceAST(input);

    // Interpret...
    console.log(interpret(program));
  }
}
