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
exports.parseInputPlaceholderFromOption = exports.isStepInActionProcess = exports.findUniqueSelector = exports.stopRecordingClicksKeys = exports.stopNodeSelection = exports.launchNodeSelection = exports.isAnExtractionAction = exports.actionIsExpectingSelector = exports.parseStepFromWebpage = exports.getSelectorContent = exports.parseDefaultAction = exports.parseTagType = exports.parseTagTypeFromAction = exports.fetchGraphQL = exports.tinkToSteps = exports.loadTink = exports.submitFeedback = exports.saveTink = exports.makeGithubIssue = exports.GITHUB_TOKEN = exports.ADMIN_SECRET = void 0;
var types_1 = require("./types");
exports.ADMIN_SECRET = "aRjtmnouR7ue0kvluCyqk5h1SHlyc65lfeK2DcdiRFIRcXx43tvTmjb5EUhB5jIT";
exports.GITHUB_TOKEN = "be2579e560cca9e75f9ac73ea80e70244be90d43";
// import { ADMIN_SECRET, GITHUB_TOKEN } from "../env";
var uuid_1 = require("uuid");
var makeGithubIssue = function (description, tinkID) { return __awaiter(void 0, void 0, void 0, function () {
    var postedIssue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://api.github.com/repos/baptisteArno/tinking/issues", {
                    method: "post",
                    body: JSON.stringify({
                        title: "(Automated Issue) " + description.slice(0, 20) + "...",
                        body: (tinkID ? "Tink ID: \"" + tinkID + "\"" : "No Tink ID") + "\nDescription: " + description,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "token " + exports.GITHUB_TOKEN,
                    },
                }).then(function (res) { return res.json(); })];
            case 1:
                postedIssue = _a.sent();
                return [2 /*return*/, postedIssue.html_url];
        }
    });
}); };
exports.makeGithubIssue = makeGithubIssue;
var saveTink = function (steps) { return __awaiter(void 0, void 0, void 0, function () {
    var MAKE_TINK, madeTink;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                MAKE_TINK = "mutation MyMutation($steps: [A_Step] = {}) {\n    makeTink(steps: $steps) {\n      id\n    }\n  }";
                return [4 /*yield*/, exports.fetchGraphQL(MAKE_TINK, {
                        steps: steps,
                    })];
            case 1:
                madeTink = _a.sent();
                return [2 /*return*/, madeTink.data.makeTink.id];
        }
    });
}); };
exports.saveTink = saveTink;
var submitFeedback = function (description, makeTink, steps) { return __awaiter(void 0, void 0, void 0, function () {
    var MAKE_FEEDBACK, variables, madeFeedback, tinkData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                MAKE_FEEDBACK = "mutation MyMutation($description: String = \"\"" + (makeTink ? ", $steps: [A_Step] = {}" : "") + ") {\n    submitFeedback(feedback: {description: $description" + (makeTink ? ", steps: $steps" : "") + "}) {\n      Feedback {\n        id\n        Tink {\n          id\n        }\n      }\n    }\n  }";
                if (makeTink) {
                    variables = {
                        description: description,
                        steps: steps,
                    };
                }
                else {
                    variables = {
                        description: description,
                    };
                }
                return [4 /*yield*/, exports.fetchGraphQL(MAKE_FEEDBACK, variables)];
            case 1:
                madeFeedback = _a.sent();
                console.log(madeFeedback);
                if (!madeFeedback.data) {
                    return [2 /*return*/, false];
                }
                tinkData = madeFeedback.data.submitFeedback.Feedback.Tink;
                return [2 /*return*/, tinkData ? tinkData.id : null];
        }
    });
}); };
exports.submitFeedback = submitFeedback;
var loadTink = function (tinkID) { return __awaiter(void 0, void 0, void 0, function () {
    var GET_TINK, findTink;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                GET_TINK = "query MyQuery {\n    Tink(where: {id: {_eq: \"" + tinkID + "\"}}) {\n      dateCreated\n      website\n      Steps {\n        index\n        totalSelected\n        StepAction {\n          action\n          selector\n          tagName\n          RecordActions {\n            index\n            isClick\n            selector\n          }\n          Options {\n            type\n            value\n          }\n        }\n      }\n    }\n  }";
                return [4 /*yield*/, exports.fetchGraphQL(GET_TINK)];
            case 1:
                findTink = _a.sent();
                if (findTink.data && findTink.data.Tink[0]) {
                    return [2 /*return*/, exports.tinkToSteps(findTink.data.Tink[0])];
                }
                else {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.loadTink = loadTink;
var tinkToSteps = function (tink) {
    var parsed = [];
    var _loop_1 = function (i) {
        var currentTinkStep = tink.Steps.find(function (s) { return s.index === i; });
        var newStep = {
            id: uuid_1.v4(),
            options: [],
        };
        if (i === 0)
            newStep.content = tink.website;
        newStep.totalSelected = currentTinkStep.totalSelected;
        newStep.action = currentTinkStep.StepAction.action;
        newStep.selector = currentTinkStep.StepAction.selector;
        newStep.tagName = currentTinkStep.StepAction.tagName;
        if (currentTinkStep.StepAction.Options.length) {
            for (var oi = 0; oi < currentTinkStep.StepAction.Options.length; oi++) {
                var currentOption = currentTinkStep.StepAction.Options[oi];
                var newOption = currentOption;
                newStep.options.push(newOption);
            }
        }
        if (currentTinkStep.StepAction.RecordActions.length) {
            newStep.recordedClicksAndKeys = [];
            var _loop_2 = function (rai) {
                var currentRecordAction = currentTinkStep.StepAction.RecordActions.find(function (ra) { return ra.index === rai; });
                if (currentRecordAction.isClick) {
                    var newRecordAction = {
                        selector: currentRecordAction.selector,
                    };
                    newStep.recordedClicksAndKeys.push(newRecordAction);
                }
                else {
                    var newRecordAction = {
                        input: currentRecordAction.selector,
                    };
                    newStep.recordedClicksAndKeys.push(newRecordAction);
                }
            };
            for (var rai = 0; rai < currentTinkStep.StepAction.RecordActions.length; rai++) {
                _loop_2(rai);
            }
        }
        parsed.push(newStep);
    };
    for (var i = 0; i < tink.Steps.length; i++) {
        _loop_1(i);
    }
    return parsed;
};
exports.tinkToSteps = tinkToSteps;
var fetchGraphQL = function (schema, variables) {
    if (variables === void 0) { variables = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var graphql, requestOptions, database_url, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    graphql = JSON.stringify({
                        query: schema,
                        variables: variables,
                    });
                    requestOptions = {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            "x-hasura-admin-secret": exports.ADMIN_SECRET,
                        },
                        body: graphql,
                    };
                    database_url = "https://tinkingdb.hasura.app/v1/graphql";
                    return [4 /*yield*/, fetch(database_url, requestOptions).then(function (res) {
                            return res.json();
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
};
exports.fetchGraphQL = fetchGraphQL;
var parseTagTypeFromAction = function (action) {
    if (action === types_1.StepAction.EXTRACT_HREF || action === types_1.StepAction.NAVIGATE) {
        return types_1.TagType.LINK;
    }
    if (action === types_1.StepAction.EXTRACT_IMAGE_SRC) {
        return types_1.TagType.IMAGE;
    }
    return types_1.TagType.CONTAINER;
};
exports.parseTagTypeFromAction = parseTagTypeFromAction;
var parseTagType = function (tagName) {
    if (tagName === "a") {
        return types_1.TagType.LINK;
    }
    if (tagName === "img") {
        return types_1.TagType.IMAGE;
    }
    return types_1.TagType.CONTAINER;
};
exports.parseTagType = parseTagType;
var parseDefaultAction = function (tagName) {
    if (tagName === "a") {
        return types_1.StepAction.NAVIGATE;
    }
    if (tagName === "img") {
        return types_1.StepAction.EXTRACT_IMAGE_SRC;
    }
    return types_1.StepAction.EXTRACT_TEXT;
};
exports.parseDefaultAction = parseDefaultAction;
var getSelectorContent = function (action, selector) {
    var _a, _b;
    if (!selector) {
        return "";
    }
    var element = parent.document.querySelector(selector);
    if (!element) {
        return;
    }
    switch (action) {
        case types_1.StepAction.EXTRACT_TEXT: {
            return ((_b = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.replace(/(\r\n|\n|\r)/gm, "").trim()) !== null && _b !== void 0 ? _b : undefined);
        }
        case types_1.StepAction.EXTRACT_IMAGE_SRC: {
            return element.src;
        }
        case types_1.StepAction.EXTRACT_HREF:
        case types_1.StepAction.NAVIGATE: {
            return element.href;
        }
    }
    return;
};
exports.getSelectorContent = getSelectorContent;
var parseStepFromWebpage = function (data) {
    return {
        selector: data.selector,
        totalSelected: data.total,
        tagName: data.tagName,
        tagType: exports.parseTagType(data.tagName),
        content: data.content,
    };
};
exports.parseStepFromWebpage = parseStepFromWebpage;
var actionIsExpectingSelector = function (action) {
    return [
        types_1.StepAction.EXTRACT_HREF,
        types_1.StepAction.EXTRACT_IMAGE_SRC,
        types_1.StepAction.EXTRACT_TEXT,
        types_1.StepAction.NAVIGATE,
    ].includes(action);
};
exports.actionIsExpectingSelector = actionIsExpectingSelector;
var isAnExtractionAction = function (action) {
    return [
        types_1.StepAction.EXTRACT_HREF,
        types_1.StepAction.EXTRACT_IMAGE_SRC,
        types_1.StepAction.EXTRACT_TEXT,
    ].includes(action !== null && action !== void 0 ? action : types_1.StepAction.NAVIGATE);
};
exports.isAnExtractionAction = isAnExtractionAction;
var launchNodeSelection = function (stepIndex, tagType, params) {
    return (params === null || params === void 0 ? void 0 : params.record)
        ? startRecordingClicksKeys(stepIndex)
        : startNodeSelection(stepIndex, tagType, params);
};
exports.launchNodeSelection = launchNodeSelection;
var stopNodeSelection = function () {
    parent.postMessage({ type: "SELECT_NODE", command: "stop" }, "*");
};
exports.stopNodeSelection = stopNodeSelection;
var startNodeSelection = function (stepIndex, tagType, params) {
    var _a;
    return parent.postMessage({
        type: "SELECT_NODE",
        command: "start",
        stepIndex: stepIndex,
        tagType: tagType,
        optionIndex: (_a = params === null || params === void 0 ? void 0 : params.optionIndex) !== null && _a !== void 0 ? _a : null,
    }, "*");
};
var startRecordingClicksKeys = function (stepIndex) {
    return parent.postMessage({
        type: "RECORD_CLICKS_KEYS",
        command: "start",
        stepIndex: stepIndex,
    }, "*");
};
var stopRecordingClicksKeys = function (stepIndex) {
    return parent.postMessage({
        type: "RECORD_CLICKS_KEYS",
        command: "stop",
        stepIndex: stepIndex,
    }, "*");
};
exports.stopRecordingClicksKeys = stopRecordingClicksKeys;
var findUniqueSelector = function (selector, index, selectingNodeIndex) {
    parent.postMessage({
        type: "SELECT_NODE",
        command: "findUniqueSelector",
        selector: selector,
        index: index,
        selectingNodeIndex: selectingNodeIndex,
    }, "*");
};
exports.findUniqueSelector = findUniqueSelector;
var isStepInActionProcess = function (step) {
    var isRecordingButNoInputs = step.recordedClicksAndKeys !== undefined &&
        step.recordedClicksAndKeys.length === 0;
    var isSelectingButNoTagName = !step.tagName;
    if (step.action === types_1.StepAction.RECORD_CLICKS_KEYS) {
        return isRecordingButNoInputs;
    }
    return isSelectingButNoTagName;
};
exports.isStepInActionProcess = isStepInActionProcess;
var parseInputPlaceholderFromOption = function (optionType) {
    switch (optionType) {
        case types_1.OptionType.PAGINATION: {
            return "Node query selector";
        }
        case types_1.OptionType.REGEX: {
            return "Regex with group to match";
        }
        case types_1.OptionType.CUSTOM_AMOUNT_TO_EXTRACT: {
            return "Amount to extract";
        }
        default: {
            return "";
        }
    }
};
exports.parseInputPlaceholderFromOption = parseInputPlaceholderFromOption;
