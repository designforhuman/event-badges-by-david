var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/generate.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/generate.js":
/*!*************************!*\
  !*** ./src/generate.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// NameTag Generator v0.5
// Designed and Coded by David Lee @DesignSpectrum, @Daylight Design
// 26 June, 2018
var document = __webpack_require__(/*! sketch/dom */ "sketch/dom").getSelectedDocument();

var UI = __webpack_require__(/*! sketch/ui */ "sketch/ui");

/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  var selectedLayers = document.selectedLayers;
  var selectedCount = selectedLayers.length;
  var nameIndex = 0;
  var TOTAL_ARTBOARD = 1;
  var DISTANCE_ARTBOARD = 50;
  var DISTANCE_NAMETAG = 0;

  if (selectedCount === 0) {
    UI.alert('Layer Selection Error', 'Please select one artboard first to copy and generate nametags.'); // var rect = new Rectangle(0, 0, 100, 100)
  } else if (selectedCount > 1) {
    UI.alert('Layer Selection Error', 'Please select only one artboard.');
  } else {
    // UI.message(`${selectedCount} layers selected.`)
    // var result = document.askForUserInput("How many?")
    // UI.alert(`${result}`, 'hi')
    // UI.message(artboard)
    var namesRaw = UI.getStringFromUser("Insert names here.");
    var names = namesRaw.split("\n"); // log(names.toString())

    TOTAL_ARTBOARD = Math.ceil(names.length / 3); // log('artboard: ' + TOTAL_ARTBOARD)
    // get the artboard

    selectedLayers.map(function (artboard) {
      for (var i = 0; i < TOTAL_ARTBOARD; i++) {
        var dupArtboard = artboard.duplicate();
        var rect = dupArtboard.frame;
        rect.x += i * (rect.width + DISTANCE_ARTBOARD);
        dupArtboard.frame = rect;
        dupArtboard.layers.map(function (nametag) {
          for (var j = 0; j < 3; j++) {
            if (nameIndex > names.length - 1) {
              nametag.remove();
              return;
            } // duplicate


            var dupNametag = nametag.duplicate();
            var rect = dupNametag.frame;
            rect.x += j * (rect.width + DISTANCE_NAMETAG);
            dupNametag.frame = rect; // find name layer and replace it

            dupNametag.layers.map(function (layer) {
              if (layer.name.toLowerCase() == "name") {
                layer.text = names[nameIndex];
                nameIndex++;
                return;
              }
            });
            log("INDEX: " + nameIndex);
            log("NAMES: " + names.length);
          }

          nametag.remove();
        });
      }

      artboard.remove();
    });
  }
});

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=generate.js.map