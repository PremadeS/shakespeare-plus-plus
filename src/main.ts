import { Program } from "./frontend/ast";
import Parser from "./frontend/parser";
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
    let program: Program = parser.produceAST(input);

    // Print in readable format...
    console.log(JSON.stringify(program, null, 2));
  }
}
