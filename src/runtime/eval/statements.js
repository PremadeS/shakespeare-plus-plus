"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpretProgram = interpretProgram;
exports.interpretVarDeclaration = interpretVarDeclaration;
exports.interpretArrDeclaration = interpretArrDeclaration;
exports.interpretFnDeclaration = interpretFnDeclaration;
exports.interpretIfStmt = interpretIfStmt;
exports.interpretForStmt = interpretForStmt;
exports.interpretWhileStmt = interpretWhileStmt;
exports.interpretBody = interpretBody;
var environment_1 = require("../environment");
var interpreter_1 = require("../interpreter");
var values_1 = require("../values");
var expressions_1 = require("./expressions");
function interpretProgram(program, env) {
    var lastInterpreted = { type: "null", value: "null" };
    // Evaluating every statement in program body...
    for (var _i = 0, _a = program.body; _i < _a.length; _i++) {
        var statament = _a[_i];
        lastInterpreted = (0, interpreter_1.interpret)(statament, env);
    }
    return lastInterpreted;
}
function interpretVarDeclaration(declaration, env) {
    var val = declaration.value ? (0, interpreter_1.interpret)(declaration.value, env) : (0, values_1.makeNull)();
    return env.declareVar(declaration.identifier, val, declaration.constant);
}
function interpretArrDeclaration(declaration, env) {
    var variable = (0, values_1.makeNull)();
    // array name will contain its first value...
    var val = declaration.values[0] ? (0, interpreter_1.interpret)(declaration.values[0], env) : (0, values_1.makeNull)();
    env.declareVar(declaration.identifier, (0, values_1.makeArray)(declaration.identifier, val), declaration.constant);
    for (var i = 0; i < declaration.values.length; ++i) {
        var val_1 = declaration.values[i] ? (0, interpreter_1.interpret)(declaration.values[i], env) : (0, values_1.makeNull)();
        env.declareVar(i + declaration.identifier, val_1, declaration.constant);
    }
    return (0, values_1.makeNull)();
}
function interpretFnDeclaration(declaration, env) {
    var fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declereationEnv: env,
        body: declaration.body,
    };
    return env.declareVar(declaration.name, fn, true);
}
function interpretIfStmt(stmt, env) {
    var condition = (0, interpreter_1.interpret)(stmt.condition, env);
    if (condition.value === true) {
        return interpretBody(stmt.body, env);
    }
    else {
        return interpretBody(stmt.other, env);
    }
}
function interpretForStmt(stmt, env) {
    var newEnv = new environment_1.default(env);
    interpretVarDeclaration(stmt.init, newEnv);
    var body = stmt.body;
    var update = stmt.update;
    var condition = (0, interpreter_1.interpret)(stmt.condition, newEnv);
    if (condition.value !== true) {
        return (0, values_1.makeNull)();
    }
    do {
        interpretBody(stmt.body, newEnv, false);
        (0, expressions_1.interpretAssignment)(update, newEnv);
        condition = (0, interpreter_1.interpret)(stmt.condition, newEnv);
    } while (condition.value);
    return (0, values_1.makeNull)();
}
function interpretWhileStmt(stmt, env) {
    var newEnv = new environment_1.default(env);
    var body = stmt.body;
    var condition = (0, interpreter_1.interpret)(stmt.condition, newEnv);
    if (condition.value !== true) {
        return (0, values_1.makeNull)();
    }
    do {
        interpretBody(stmt.body, newEnv, false);
        condition = (0, interpreter_1.interpret)(stmt.condition, newEnv);
    } while (condition.value);
    return (0, values_1.makeNull)();
}
function interpretBody(stmts, env, newEnv) {
    if (newEnv === void 0) { newEnv = true; }
    var scope;
    if (newEnv) {
        scope = new environment_1.default(env);
    }
    else {
        scope = env;
    }
    var res = (0, values_1.makeNull)();
    for (var _i = 0, stmts_1 = stmts; _i < stmts_1.length; _i++) {
        var stmt = stmts_1[_i];
        res = (0, interpreter_1.interpret)(stmt, scope);
    }
    return res;
}
