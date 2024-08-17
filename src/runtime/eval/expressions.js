"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpretIdentifier = interpretIdentifier;
exports.interpretObjectExpr = interpretObjectExpr;
exports.interpretCallExpr = interpretCallExpr;
exports.interpretBinaryExpr = interpretBinaryExpr;
exports.interpretAssignment = interpretAssignment;
exports.interpretMemberExpr = interpretMemberExpr;
var environment_1 = require("../environment");
var interpreter_1 = require("../interpreter");
var values_1 = require("../values");
function interpretNumBinaryExpr(left, right, operator, env) {
    if (operator == "&") {
        if (left.type != "boolean" || right.type != "boolean") {
            return (0, values_1.makeBool)(false);
        }
        return (0, values_1.makeBool)(left.value && right.value);
    }
    else if (operator == "|") {
        if (left.type != "boolean" || right.type != "boolean") {
            return (0, values_1.makeBool)(false);
        }
        return (0, values_1.makeBool)(left.value || right.value);
    }
    else if (operator == "==") {
        return isEqual(left, right);
    }
    else if (operator == "!=") {
        if (isEqual(left, right).value == true) {
            return (0, values_1.makeBool)(false);
        }
        else {
            return (0, values_1.makeBool)(true);
        }
    }
    if (left.type == "array" && right.type == "number" && operator == "+") {
        var varName = env.lookupVar(right.value + left.identifier);
        if (varName == undefined) {
            throw new Error("Thou seekest an index ".concat(right.value, " that dwelleth not within this array\u2019s bounds!"));
        }
        return varName;
    }
    if (left.type == "null" || right.type == "null") {
        throw new Error("Alas! One cannot engage in binary antics with naught but null! ".concat(JSON.stringify(left), " ").concat(operator, " ").concat(JSON.stringify(right)));
    }
    if (left.type == "string" && right.type == "string" && operator == "+") {
        return (0, values_1.makeString)(left.value + right.value);
    }
    var lhs = left;
    var rhs = right;
    if (operator == "+") {
        return (0, values_1.makeNum)(lhs.value + rhs.value);
    }
    else if (operator == "-") {
        return (0, values_1.makeNum)(lhs.value - rhs.value);
    }
    else if (operator == "*") {
        return (0, values_1.makeNum)(lhs.value * rhs.value);
    }
    else if (operator == "/") {
        // Divison by 0
        if (rhs.value == 0) {
            console.error("Thou art trying to cleave yon number by the wretched zero,", "\ndost thou not know this conjures chaos in the realm of numbers?\nAt: ", lhs.value, operator, rhs.value);
            process.exit(1);
        }
        return (0, values_1.makeNum)(lhs.value / rhs.value);
    }
    else if (operator == "%") {
        return (0, values_1.makeNum)(lhs.value % rhs.value);
    }
    else if (operator == ">") {
        return (0, values_1.makeBool)(lhs.value > rhs.value);
    }
    else if (operator == "<") {
        return (0, values_1.makeBool)(lhs.value < rhs.value);
    }
    else if (operator == ">=") {
        return (0, values_1.makeBool)(lhs.value >= rhs.value);
    }
    else if (operator == "<=") {
        return (0, values_1.makeBool)(lhs.value <= rhs.value);
    }
    return (0, values_1.makeNull)(); // Default case...
}
function isEqual(lhs, rhs) {
    switch (lhs.type) {
        case "boolean":
            return (0, values_1.makeBool)(lhs.value == rhs.value);
        case "number":
            return (0, values_1.makeBool)(lhs.value == rhs.value);
        case "string":
            return (0, values_1.makeBool)(lhs.value == rhs.value);
        case "null":
            return (0, values_1.makeBool)(lhs.value == rhs.value);
        case "object":
            return (0, values_1.makeBool)(lhs.properties == rhs.properties);
        case "native-fn":
            return (0, values_1.makeBool)(lhs.call == rhs.call);
        case "function":
            return (0, values_1.makeBool)(lhs.body == rhs.body &&
                lhs.parameters == rhs.parameters);
        default:
            throw new Error("Zounds! One unfortunately does not possess the ability to compare these types! ".concat(lhs, " and ").concat(rhs));
    }
}
function interpretIdentifier(identifer, env) {
    var val = env.lookupVar(identifer.symbol);
    return val;
}
function interpretObjectExpr(obj, env) {
    var object = { type: "object", properties: new Map() };
    for (var _i = 0, _a = obj.properties; _i < _a.length; _i++) {
        var _b = _a[_i], key = _b.key, value = _b.value;
        var runTimeVal = value == undefined ? env.lookupVar(key) : (0, interpreter_1.interpret)(value, env);
        object.properties.set(key, runTimeVal);
    }
    return object;
}
function interpretCallExpr(expr, env) {
    var args = [];
    for (var _i = 0, _a = expr.args; _i < _a.length; _i++) {
        var arg = _a[_i];
        args.push((0, interpreter_1.interpret)(arg, env));
    }
    var fn = (0, interpreter_1.interpret)(expr.caller, env);
    // Native functions....
    if (!fn) {
        throw new Error("Function doth not found!");
    }
    if (fn.type == "native-fn") {
        var result = fn.call(args, env);
        return result;
    }
    // User-defined functions....
    if (fn.type == "function") {
        var func = fn;
        var scope = new environment_1.default(func.declereationEnv);
        if (args.length != func.parameters.length) {
            throw new Error("Arguments not equivaleth to parameters,\nNo. of arguments: " +
                args.length +
                "\nNo. of Paramters: " +
                func.parameters.length);
        }
        //Maketh var for parameters list...
        for (var i = 0; i < func.parameters.length; ++i) {
            var varName = func.parameters[i];
            scope.declareVar(varName, args[i], false);
        }
        var result = (0, values_1.makeNull)();
        for (var _b = 0, _c = func.body; _b < _c.length; _b++) {
            var stmt = _c[_b];
            result = (0, interpreter_1.interpret)(stmt, scope);
        }
        return result;
    }
    throw new Error("Alas, thou canst not call a value that is no function! " + JSON.stringify(fn));
}
function interpretBinaryExpr(binop, env) {
    var left = (0, interpreter_1.interpret)(binop.left, env);
    var right = (0, interpreter_1.interpret)(binop.right, env);
    return interpretNumBinaryExpr(left, right, binop.operator, env);
}
function interpretAssignment(node, env) {
    if (node.assignee.kind === "MemberExpr") {
        return interpretMemberExpr(env, node);
    }
    if (node.assignee.kind !== "Identifier") {
        throw new Error("Thou hath committed an unworthy deed: an invalid assignation unto ".concat(JSON.stringify(node.assignee), "."));
    }
    var varName = node.assignee.symbol;
    return env.assignVar(varName, (0, interpreter_1.interpret)(node.value, env));
}
function interpretMemberExpr(env, node, expr) {
    if (expr) {
        return env.lookupObject(expr);
    }
    if (node) {
        return env.lookupObject(node.assignee, (0, interpreter_1.interpret)(node.value, env));
    }
    throw new Error("Thou canst not evaluate a member expression without a rightful member or assignment!");
}
