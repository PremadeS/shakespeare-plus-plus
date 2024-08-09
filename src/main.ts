import { Program } from "./frontend/ast";
import Parser from "./frontend/parser";
import { createGlobalEnv } from "./runtime/environment";
import { interpret } from "./runtime/interpreter";
import * as readLineSync from "readline-sync";
import { readFileSync } from "fs";

run();

async function run() {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = readFileSync("test.spp", "utf-8");

  // Parse...
  let program: Program = parser.produceAST(input);

  // Interpret...
  let inter = interpret(program, env);
  // console.log(inter);
}

function repl() {
  console.log("\nRepl v0.1");
  const parser = new Parser();
  const env = createGlobalEnv();

  while (true) {
    const input: string = readLineSync.question("~swagger~ ");

    if (!input || input.includes("exit")) {
      process.exit(1);
    }
    // Parse...
    let program: Program = parser.produceAST(input);

    // Interpret...
    let inter = interpret(program, env);
    // console.log(inter);
  }
}
