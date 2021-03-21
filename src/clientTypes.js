"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionType = exports.StepAction = exports.TagType = void 0;
var TagType;
(function (TagType) {
    TagType["CONTAINER"] = "container";
    TagType["LINK"] = "link";
    TagType["IMAGE"] = "image";
})(TagType = exports.TagType || (exports.TagType = {}));
var StepAction;
(function (StepAction) {
    StepAction["NAVIGATE"] = "Navigate to link";
    StepAction["EXTRACT_TEXT"] = "Extract text";
    StepAction["EXTRACT_HREF"] = "Extract URL";
    StepAction["EXTRACT_IMAGE_SRC"] = "Extract image URL";
    StepAction["RECORD_CLICKS_KEYS"] = "Record clicks and keys";
})(StepAction = exports.StepAction || (exports.StepAction = {}));
var OptionType;
(function (OptionType) {
    OptionType["INFINITE_SCROLL"] = "Infinite Scroll";
    OptionType["PAGINATION"] = "Pagination";
    OptionType["REGEX"] = "Regex";
    OptionType["CUSTOM_AMOUNT_TO_EXTRACT"] = "Custom amount to extract";
})(OptionType = exports.OptionType || (exports.OptionType = {}));
