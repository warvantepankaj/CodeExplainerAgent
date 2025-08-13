"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-alphabetical@1.0.4";
exports.ids = ["vendor-chunks/is-alphabetical@1.0.4"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/is-alphabetical@1.0.4/node_modules/is-alphabetical/index.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/is-alphabetical@1.0.4/node_modules/is-alphabetical/index.js ***!
  \****************************************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = alphabetical\n\n// Check if the given character code, or the character code at the first\n// character, is alphabetical.\nfunction alphabetical(character) {\n  var code = typeof character === 'string' ? character.charCodeAt(0) : character\n\n  return (\n    (code >= 97 && code <= 122) /* a-z */ ||\n    (code >= 65 && code <= 90) /* A-Z */\n  )\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vaXMtYWxwaGFiZXRpY2FsQDEuMC40L25vZGVfbW9kdWxlcy9pcy1hbHBoYWJldGljYWwvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQVk7O0FBRVo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiQzpcXFBhbmthaidzIFNwYWNlXFxQcm9qZWN0c1xcQ29kZUV4cGxhaW5lclxcQWdlbnRcXG5vZGVfbW9kdWxlc1xcLnBucG1cXGlzLWFscGhhYmV0aWNhbEAxLjAuNFxcbm9kZV9tb2R1bGVzXFxpcy1hbHBoYWJldGljYWxcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFscGhhYmV0aWNhbFxuXG4vLyBDaGVjayBpZiB0aGUgZ2l2ZW4gY2hhcmFjdGVyIGNvZGUsIG9yIHRoZSBjaGFyYWN0ZXIgY29kZSBhdCB0aGUgZmlyc3Rcbi8vIGNoYXJhY3RlciwgaXMgYWxwaGFiZXRpY2FsLlxuZnVuY3Rpb24gYWxwaGFiZXRpY2FsKGNoYXJhY3Rlcikge1xuICB2YXIgY29kZSA9IHR5cGVvZiBjaGFyYWN0ZXIgPT09ICdzdHJpbmcnID8gY2hhcmFjdGVyLmNoYXJDb2RlQXQoMCkgOiBjaGFyYWN0ZXJcblxuICByZXR1cm4gKFxuICAgIChjb2RlID49IDk3ICYmIGNvZGUgPD0gMTIyKSAvKiBhLXogKi8gfHxcbiAgICAoY29kZSA+PSA2NSAmJiBjb2RlIDw9IDkwKSAvKiBBLVogKi9cbiAgKVxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/is-alphabetical@1.0.4/node_modules/is-alphabetical/index.js\n");

/***/ })

};
;