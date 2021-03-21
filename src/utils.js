"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGraphQL = exports.getStepAction = exports.makeStep = exports.getWebsite = exports.getTink = exports.makeTinkProcess = exports.getFeedback = void 0;
var fetch = require('node-fetch');
var getFeedback = function (description, tinkID) { return __awaiter(void 0, void 0, void 0, function () {
    var MAKE_FEEDBACK, madeFeedback;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                MAKE_FEEDBACK = "mutation MyMutation {\n      insert_Feedback(objects: {description: \"" + description + "\" " + (tinkID ? ", tink: \"" + tinkID + "\"" : '') + "}) {\n        returning {\n          id\n        }\n      }\n    }";
                console.log('Making feedback: ', description);
                return [4 /*yield*/, exports.fetchGraphQL(MAKE_FEEDBACK)];
            case 1:
                madeFeedback = _a.sent();
                console.log('Finished feedback: ', description, '. ID: ', madeFeedback.data.insert_Feedback.returning[0].id);
                return [2 /*return*/, madeFeedback.data.insert_Feedback.returning[0].id];
        }
    });
}); };
exports.getFeedback = getFeedback;
var makeTinkProcess = function (steps) { return __awaiter(void 0, void 0, void 0, function () {
    var website, tinkID, _loop_1, index;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                website = steps[0].content;
                return [4 /*yield*/, exports.getTink(website)];
            case 1:
                tinkID = _a.sent();
                _loop_1 = function (index) {
                    exports.getStepAction(steps[index]).then(function (stepActionID) {
                        return exports.makeStep(steps[index], tinkID, stepActionID, Number(index));
                    });
                };
                for (index in steps) {
                    _loop_1(index);
                }
                return [2 /*return*/, tinkID];
        }
    });
}); };
exports.makeTinkProcess = makeTinkProcess;
var getTink = function (website) { return __awaiter(void 0, void 0, void 0, function () {
    var MAKE_TINK, madeTink;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                MAKE_TINK = "\n    mutation MyMutation {\n      insert_Tink(objects: {website: \"" + website + "\"}) {\n        returning {\n          id\n        }\n      }\n    }\n    ";
                console.log('Making tink: ', website);
                return [4 /*yield*/, exports.fetchGraphQL(MAKE_TINK)];
            case 1:
                madeTink = _a.sent();
                console.log('Finished tink: ', website, '. ID: ', madeTink.data.insert_Tink.returning[0].id);
                return [2 /*return*/, madeTink.data.insert_Tink.returning[0].id];
        }
    });
}); };
exports.getTink = getTink;
var getWebsite = function (domain) { return __awaiter(void 0, void 0, void 0, function () {
    var FIND_WEBSITE, foundWebsite, MAKE_WEBSITE, madeWebsite;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                FIND_WEBSITE = "\n    query MyQuery {\n      Website(where: {domain: {_eq: \"" + domain + "\"}}) {\n        id\n      }\n    }\n    ";
                console.log('Finding website: ', domain);
                return [4 /*yield*/, exports.fetchGraphQL(FIND_WEBSITE)];
            case 1:
                foundWebsite = _a.sent();
                if (foundWebsite.data.Website[0]) {
                    console.log('Found website: ', domain, '. ID: ', foundWebsite.data.Website[0].id);
                    return [2 /*return*/, foundWebsite.data.Website[0].id];
                }
                MAKE_WEBSITE = "\n    mutation MyMutation {\n      insert_Website(objects: {domain: \"" + domain + "\"}) {\n        returning {\n          id\n        }\n      }\n    }\n    ";
                console.log('Making website: ', domain);
                return [4 /*yield*/, exports.fetchGraphQL(MAKE_WEBSITE)];
            case 2:
                madeWebsite = _a.sent();
                console.log(madeWebsite);
                console.log('Finished website: ', domain, '. ID: ', madeWebsite.data.insert_Website.returning[0].id);
                return [2 /*return*/, madeWebsite.data.insert_Website.returning[0].id];
        }
    });
}); };
exports.getWebsite = getWebsite;
var makeStep = function (step, tinkID, stepActionID, index) { return __awaiter(void 0, void 0, void 0, function () {
    var MAKE_STEP, madeStep;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                MAKE_STEP = "\n    mutation MyMutation {\n      insert_Step(objects: {index: " + index + ", stepAction: \"" + stepActionID + "\", tink: \"" + tinkID + "\"" + (step.totalSelected ? ", totalSelected: " + step.totalSelected : '') + "}) {\n        returning {\n          id\n        }\n      }\n    }\n    ";
                console.log('Making step: ', index);
                return [4 /*yield*/, exports.fetchGraphQL(MAKE_STEP)];
            case 1:
                madeStep = _a.sent();
                console.log('Finished step: ', index, '. ID: ', madeStep.data.insert_Step.returning[0].id);
                return [2 /*return*/, madeStep.data.insert_Step.returning[0].id];
        }
    });
}); };
exports.makeStep = makeStep;
var getStepAction = function (step) { return __awaiter(void 0, void 0, void 0, function () {
    var recordActionsFindSchema, optionsFindSchema, andTotalSchema, FIND_STEP_ACTION, foundStepAction, recordActionsMakeSchema, optionsMakeSchema, MAKE_STEP_ACTION, madeStepAction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                recordActionsFindSchema = step.recordedClicksAndKeys ? step.recordedClicksAndKeys.map(function (ra, index) {
                    return " _and: {RecordActions: {index: {_eq: " + index + "}, isClick: {_eq: " + Boolean(ra.selector) + "}, selector: {_eq: \"" + (ra.selector || ra.input) + "\"}}";
                }) : '';
                optionsFindSchema = step.options ? step.options.map(function (op) { return op ?
                    ", _and: {Options: {type: {_eq: \"" + op.type + "\"}" + (op.value ? ", value: {_eq: \"" + op.value + "\"}" : null) + "}"
                    : ''; }) : '';
                andTotalSchema = '}'.repeat(step.recordedClicksAndKeys ? step.recordedClicksAndKeys.length : 0 + step.options.length);
                FIND_STEP_ACTION = "\n  query {\n      StepAction(where: {\n        action: {_eq: \"" + step.action + "\"}, selector: {_eq: \"" + step.selector + "\"}, tagName: {_eq: \"" + step.tagName + "\"}\n        " + recordActionsFindSchema + "\n        " + optionsFindSchema + "\n      " + andTotalSchema + "\n      }) {\n        id\n      }\n  }\n  ";
                return [4 /*yield*/, exports.fetchGraphQL(FIND_STEP_ACTION)];
            case 1:
                foundStepAction = _a.sent();
                console.log('Finding StepAction: ', step.selector);
                if (foundStepAction.data.StepAction[0]) {
                    console.log('Finished StepAction: ', step.selector, '. ID: ', foundStepAction.data.StepAction[0].id);
                    return [2 /*return*/, foundStepAction.data.StepAction[0].id];
                }
                recordActionsMakeSchema = step.recordedClicksAndKeys ? step.recordedClicksAndKeys.map(function (ra, index) {
                    return "{index: " + index + ", isClick: " + Boolean(ra.selector) + ", selector: \"" + (ra.selector || ra.input) + "\"},";
                }) : '';
                optionsMakeSchema = step.options.length ? step.options.map(function (op) { return op ?
                    "{type: \"" + op.type + "\", value: \"" + op.value + "\"},"
                    : ''; }) : '';
                MAKE_STEP_ACTION = "\n  mutation {\n    insert_StepAction(objects: {\n      action: \"" + step.action + "\", selector: \"" + step.selector + "\", tagName: \"" + step.tagName + "\",\n      RecordActions: {data: [\n          " + recordActionsMakeSchema + "\n      ]},\n      Options: {data: [\n          " + optionsMakeSchema + "\n      ]}\n  }) {\n      returning {\n        id\n      }\n    }\n  }\n  ";
                console.log('Making StepAction: ', step.selector);
                console.log(MAKE_STEP_ACTION);
                return [4 /*yield*/, exports.fetchGraphQL(MAKE_STEP_ACTION)];
            case 2:
                madeStepAction = _a.sent();
                console.log(madeStepAction);
                console.log('Finished StepAction: ', step.selector, '. ID: ', madeStepAction.data.insert_StepAction.returning[0].id);
                return [2 /*return*/, madeStepAction.data.insert_StepAction.returning[0].id];
        }
    });
}); };
exports.getStepAction = getStepAction;
var fetchGraphQL = function (schema) { return __awaiter(void 0, void 0, void 0, function () {
    var graphql, requestOptions, database_url, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                graphql = JSON.stringify({
                    query: schema,
                    variables: {}
                });
                requestOptions = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'x-hasura-admin-secret': 'aRjtmnouR7ue0kvluCyqk5h1SHlyc65lfeK2DcdiRFIRcXx43tvTmjb5EUhB5jIT'
                    },
                    body: graphql,
                };
                database_url = 'https://tinkingdb.hasura.app/v1/graphql';
                return [4 /*yield*/, fetch(database_url, requestOptions).then(function (res) { return res.json(); })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res];
        }
    });
}); };
exports.fetchGraphQL = fetchGraphQL;
