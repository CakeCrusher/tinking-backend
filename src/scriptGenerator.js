"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScript = void 0;
var standalone_1 = __importDefault(require("prettier/standalone"));
var parser_babel_1 = __importDefault(require("prettier/parser-babel"));
var types_1 = require("./types");
var helperFunctions_1 = require("./helperFunctions");
var utils = {
    infiniteScroll: false,
    toTitleCase: false,
};
var generateScript = function (steps, library) {
    var hasData = false;
    var indexInLoop;
    var commands = steps
        .map(function (step, idx) {
        var _a;
        if (idx === 0) {
            return "";
        }
        if ((((_a = step.options) === null || _a === void 0 ? void 0 : _a.findIndex(function (option) { return (option === null || option === void 0 ? void 0 : option.type) === types_1.OptionType.INFINITE_SCROLL; })) || -1) !== -1) {
            utils.infiniteScroll = true;
        }
        if (step.totalSelected &&
            step.totalSelected > 1 &&
            step.action === types_1.StepAction.NAVIGATE &&
            indexInLoop === undefined) {
            indexInLoop = idx + 1;
            return parseLoopFromStep(step);
        }
        return parseSingleCommandFromStep(step, idx, {
            waitForSelector: true,
        });
    })
        .join(" ");
    if (indexInLoop !== undefined) {
        hasData = true;
        var stepsInLoop = steps.filter(function (_, idx) { return indexInLoop && idx >= indexInLoop; });
        var object = "{" + stepsInLoop.map(function (step, idx) {
            var variableName = step.variableName && step.variableName !== ""
                ? step.variableName
                : "variable" + idx;
            var field = variableName;
            if (helperFunctions_1.isAnExtractionAction(step.action)) {
                var formattedVariableName = variableName.charAt(0).toUpperCase() + variableName.slice(1);
                field = variableName + ": formatted" + formattedVariableName;
            }
            return field;
        }) + "}";
        commands += "\n    console.log(" + object + ")\n    if (!promptContinue) {\n      const response = await prompts({\n        type: 'confirm',\n        name: 'value',\n        message: 'Continue?',\n        initial: true,\n      });\n      if (!response.value) {\n        process.exit();\n      }\n      promptContinue = true;\n    }\n    data.push(" + object + ")\n    bar.tick()\n  }\n    ";
    }
    if (indexInLoop === undefined) {
        var object = "{" + steps
            .map(function (step, idx) {
            if (idx === 0 || step.action === types_1.StepAction.RECORD_CLICKS_KEYS) {
                return "";
            }
            hasData = true;
            var variableName = step.variableName && step.variableName !== ""
                ? step.variableName
                : "variable" + idx;
            var field = variableName;
            if (helperFunctions_1.isAnExtractionAction(step.action) && step.totalSelected === 1) {
                var formattedVariableName = variableName.charAt(0).toUpperCase() + variableName.slice(1);
                field = variableName + ": formatted" + formattedVariableName;
            }
            return field + ",";
        })
            .join("") + "}";
        if (hasData) {
            commands += "\n        console.log(" + object + ");\n        data = " + object + "\n      ";
        }
    }
    if (hasData) {
        commands += " fs.writeFile(outputFilename || `./${new Date()}.json`,\n    prettier.format(JSON.stringify(data), {\n      parser: 'json',\n    }),\n    (err) => {\n      if (err) return console.log(err);\n    }\n  );";
    }
    var script = "\n  " + (library === "puppeteer"
        ? "const puppeteer = require(\"puppeteer\");"
        : "const { chromium } = require('playwright');") + "\n  const ProgressBar = require(\"progress\");\n  const prettier = require('prettier');\n  const fs = require('fs');\n  const prompts = require('prompts');\n  \n  (async () => {\n    " + parseLibrarySettings(library) + "\n    let data;\n    try {\n      const outputFilename = \"" + "data_scraped" + ".json\";\n      const page = await browser.newPage();\n      await page.setDefaultNavigationTimeout(0); \n      await page.goto(\"" + steps[0].content + "\");\n      " + (utils.infiniteScroll ? "await autoScroll(page)" : "") + "\n      " + commands + "\n      await browser.close();\n    } catch (e) {\n      await browser.close();\n      throw e;\n    }\n  })();\n  " + parseUtilsFunctions(utils) + "\n  ";
    try {
        script = standalone_1.default.format(script, {
            parser: "babel",
            plugins: [parser_babel_1.default],
        });
    }
    catch (e) {
        console.error("Couldn't format script:", e);
        console.log("Steps:", steps);
    }
    return script;
};
exports.generateScript = generateScript;
var parseSingleCommandFromStep = function (step, idx, _a) {
    var waitForSelector = _a.waitForSelector;
    var variableName = step.variableName && step.variableName !== ""
        ? step.variableName
        : "variable" + idx;
    var command = "";
    if (waitForSelector && step.action !== types_1.StepAction.RECORD_CLICKS_KEYS) {
        command += "\n    try {\n      await page.waitForSelector(\"" + step.selector + "\")\n    } catch{\n      console.log(\"Couldn't find " + step.selector + "\")\n    }\n    ";
    }
    var regexOption = step.options.find(function (option) { return (option === null || option === void 0 ? void 0 : option.type) === types_1.OptionType.REGEX; });
    var amountToExtract = getAmountToExtract(step);
    switch (step.action) {
        case types_1.StepAction.NAVIGATE: {
            command += "\n      let url = await page.evaluate(() => {\n        const element = document.querySelector(\"" + step.selector + "\")\n        return element.href || null;\n      });\n      await page.goto(url)\n      ";
            break;
        }
        case types_1.StepAction.EXTRACT_TEXT: {
            if (step.totalSelected &&
                step.totalSelected > 1 &&
                amountToExtract !== "1") {
                command += "\n        const " + variableName + " = await page.evaluate(() => {\n          const elements = document.querySelectorAll(\"" + step.selector + "\")\n          return [...elements].map(element => element.textContent.replace(/(\\r\\n|\\n|\\r)/gm, \"\").trim() || null).slice(0," + amountToExtract + ");\n        });";
            }
            else {
                command += "\n        const " + variableName + "Eval = () => {\n          const element = document.querySelector(\"" + step.selector + "\")\n          return element.textContent.replace(/(\\r\\n|\\n|\\r)/gm, \"\").trim();\n        }\n        let " + variableName + " = await page.evaluate(" + variableName + "Eval);\n        if(" + variableName + " === null || " + variableName + " === \"\"){\n          // The content could be dynamically loaded. Waiting a bit...\n          await page.waitForTimeout(4000)\n          " + variableName + " = await page.evaluate(" + variableName + "Eval);\n        }\n        let formatted" + (variableName.charAt(0).toUpperCase() + variableName.slice(1)) + " = " + variableName + "\n        ";
            }
            break;
        }
        case types_1.StepAction.EXTRACT_IMAGE_SRC: {
            if (step.totalSelected &&
                step.totalSelected > 1 &&
                amountToExtract !== "1") {
                command += "\n        const " + variableName + " = await page.evaluate(() => {\n          const elements = document.querySelectorAll(\"" + step.selector + "\")\n          return [...elements].map(element => element.src || null).slice(0," + amountToExtract + ");\n        });";
            }
            else {
                command += "\n        const " + variableName + "Eval = () => {\n          const element = document.querySelector(\"" + step.selector + "\")\n          return element.src || null;\n        }\n        let " + variableName + " = await page.evaluate(" + variableName + "Eval);\n        if(" + variableName + " === null || " + variableName + " === \"\"){\n          // The content could be dynamically loaded. Waiting a bit...\n          await page.waitForTimeout(4000)\n          " + variableName + " = await page.evaluate(" + variableName + "Eval);\n        }\n        let formatted" + (variableName.charAt(0).toUpperCase() + variableName.slice(1)) + " = " + variableName + "\n        ";
            }
            break;
        }
        case types_1.StepAction.EXTRACT_HREF: {
            if (step.totalSelected &&
                step.totalSelected > 1 &&
                amountToExtract !== "1") {
                command += "\n        const " + variableName + " = await page.evaluate(() => {\n          const elements = document.querySelectorAll(\"" + step.selector + "\")\n          return [...elements].map(element => element.href || null).slice(0," + amountToExtract + ");\n        });";
            }
            else {
                command += "\n        const " + variableName + "Eval = () => {\n          const element = document.querySelector(\"" + step.selector + "\")\n          return element.href || null;\n        }\n        let " + variableName + " = await page.evaluate(" + variableName + "Eval);\n        if(" + variableName + " === null || " + variableName + " === \"\"){\n          // The content could be dynamically loaded. Waiting a bit...\n          await page.waitForTimeout(4000)\n          " + variableName + " = await page.evaluate(" + variableName + "Eval);\n        }\n        let formatted" + (variableName.charAt(0).toUpperCase() + variableName.slice(1)) + " = " + variableName + "\n        ";
            }
            break;
        }
        case types_1.StepAction.RECORD_CLICKS_KEYS: {
            if (!step.recordedClicksAndKeys)
                return;
            command += "" + parseRecordingCommands(step.recordedClicksAndKeys);
            break;
        }
    }
    if (regexOption) {
        command += "const regex = new RegExp(\"" + regexOption.value + "\", \"gm\");\n    const matchedArray = [..." + variableName + ".matchAll(regex)];\n    let match = \"\"\n    try{\n      match = matchedArray[0][1];\n    } catch(e) {}\n    if (match !== \"\") {\n      formatted" + (variableName.charAt(0).toUpperCase() + variableName.slice(1)) + " = match\n    }\n    ";
    }
    return command;
};
var getAmountToExtract = function (step) {
    var optionIndex = step.options.findIndex(function (option) { return (option === null || option === void 0 ? void 0 : option.type) === types_1.OptionType.CUSTOM_AMOUNT_TO_EXTRACT; });
    var stepHasCustomAmountToExtract = optionIndex !== -1;
    if (stepHasCustomAmountToExtract) {
        var option = step.options[optionIndex];
        return option.value;
    }
    else {
        return "";
    }
};
var parseLoopFromStep = function (step) {
    var _a;
    var paginationOption = (_a = step.options) === null || _a === void 0 ? void 0 : _a.find(function (option) { return (option === null || option === void 0 ? void 0 : option.type) === types_1.OptionType.PAGINATION; });
    var amountToExtract = getAmountToExtract(step);
    var urlsExtractionCommand;
    if (paginationOption) {
        urlsExtractionCommand = "\n      await page.waitForSelector(\"" + step.selector + "\")\n      let urls = []\n      urls = await page.evaluate(() => {\n        return [...document.querySelectorAll(\"" + step.selector + "\")].map((node) => node.href);\n      });\n      if(" + (amountToExtract === "" ? "false" : "urls.length >= " + amountToExtract) + "){\n        urls = urls.slice(0, " + amountToExtract + ")\n      } else {\n        let i = 0\n        console.log(\"Extracting URLs\");\n        const paginationBar = new ProgressBar(\" scrapping [:bar] :rate/bps :percent :etas\", {\n          complete: \"=\",\n          incomplete: \" \",\n          width: 20,\n          total: 1000\n        });\n        let firstLinkInCurrentPage = urls[0]\n        while(i <= 1000){\n          paginationBar.tick()\n          i += 1\n          const nodes = await page.$$(\"" + (paginationOption === null || paginationOption === void 0 ? void 0 : paginationOption.value) + "\");\n          await nodes.pop().click();\n          await page.waitForTimeout(1000);\n          try{\n            await page.waitForSelector(\"" + step.selector + "\")\n          }catch{\n            break;\n          }\n          let firstLinkInNewPage = await page.evaluate(() => {return document.querySelector(\"" + step.selector + "\").href});\n          if (firstLinkInNewPage === firstLinkInCurrentPage) {\n            // There is some kind of loading state we need to wait for\n            await page.waitForTimeout(4000);\n            firstLinkInNewPage = await page.evaluate(() => {return document.querySelector(\"" + step.selector + "\").href});\n            if (firstLinkInNewPage === firstLinkInCurrentPage) {\n              break;\n            }\n          }\n          const newUrls = await page.evaluate(() => {\n            return [...document.querySelectorAll(\"" + step.selector + "\")].map(node => node.href);\n          })\n          urls = urls.concat(newUrls)\n          if (" + (amountToExtract === ""
            ? "false"
            : "urls.length >= " + amountToExtract) + ") {\n            urls = urls.slice(0, " + amountToExtract + ")\n            break;\n          }\n          firstLinkInCurrentPage = newUrls[0]\n        }\n      }\n    ";
    }
    else {
        urlsExtractionCommand = "let urls = await page.evaluate(() => {\n      return [...document.querySelectorAll(\"" + step.selector + "\")].map(node => node.href);\n    });";
    }
    switch (step.action) {
        case types_1.StepAction.NAVIGATE: {
            return "\n      " + urlsExtractionCommand + "\n      const bar = new ProgressBar(' scrapping [:bar] :rate/bps :percent :etas', {\n        complete: '=',\n        incomplete: ' ',\n        width: 20,\n        total: urls.length,\n      });\n      let promptContinue = false;\n      console.log('Found ' + urls.length + ' urls.');\n      data = []\n      for(let url of urls){\n        await page.goto(url)\n      ";
        }
    }
};
var parseUtilsFunctions = function (utils) {
    var functions = "";
    if (utils.toTitleCase) {
        functions += "const toTitleCase = (phrase) => {\n      if (!phrase) {\n      return null;\n      }\n      return phrase\n      .toLowerCase()\n      .split(' ')\n      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))\n      .join(' ');\n    };";
    }
    if (utils.infiniteScroll) {
        functions += "async function autoScroll(page) {\n      await page.evaluate(async () => {\n        await new Promise((resolve, _) => {\n          var totalHeight = 0;\n          var distance = 100;\n          var timer = setInterval(() => {\n            var scrollHeight = document.body.scrollHeight;\n            window.scrollBy(0, distance);\n            totalHeight += distance;\n    \n            if (totalHeight >= scrollHeight) {\n              clearInterval(timer);\n              resolve();\n            }\n          }, 100);\n        });\n      });}";
    }
    return functions;
};
var parseLibrarySettings = function (library) {
    if (library === "puppeteer") {
        return "const browser = await puppeteer.launch({\n      // Uncomment this line to open the browser \uD83D\uDC47\n      // headless: false,\n      defaultViewport: null,\n      args: [\n        \"--no-sandbox\",\n        \"--disable-setuid-sandbox\",\n        \"--disable-dev-shm-usage\",\n        \"--window-size=1300,1024\"\n      ],\n    });";
    }
    return "const browser = await chromium.launch({\n    // Uncomment this line to open the browser \uD83D\uDC47\n    // headless: false\n  });";
};
var parseRecordingCommands = function (recording) {
    var commands = "";
    for (var _i = 0, recording_1 = recording; _i < recording_1.length; _i++) {
        var record = recording_1[_i];
        if ("selector" in record) {
            commands += "await page.waitForSelector(\"" + record.selector + "\");\n      await page.click(\"" + record.selector + "\")\n      ";
        }
        else {
            commands += "await page.keyboard.type('" + record.input + "', {delay: 100})\n      ";
        }
    }
    return commands;
};
