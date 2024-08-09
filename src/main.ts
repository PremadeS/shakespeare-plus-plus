import { Program } from "./frontend/ast";
import Parser from "./frontend/parser";
import { createGlobalEnv } from "./runtime/environment";
import { interpret } from "./runtime/interpreter";
import * as readLineSync from "readline-sync";
import { readFileSync } from "fs";
import path from "path";
main();

function getFilePath(userInput: string): string {
  if (path.isAbsolute(userInput)) {
    return userInput;
  }
  const currentDir = process.cwd();
  return path.join(currentDir, userInput);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length == 0) {
    repl();
  } else {
    for (const arg of args) {
      run(getFilePath(arg));
    }
  }
}

async function run(filename: string) {
  if (filename.slice(-3) != "spp") {
    throw new Error("This file doth not bear the mark of the sacred .spp!");
  }

  const parser = new Parser();
  const env = createGlobalEnv();

  const input = readFileSync(filename, "utf-8");

  // Parse...
  let program: Program = parser.produceAST(input);

  // Interpret...
  let inter = interpret(program, env);
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
  }
}
