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
// Event Badges by David
// 4 August, 2018
// Copyright (c) 2018 David Lee, davidlee.kr
var sketch = __webpack_require__(/*! sketch */ "sketch"); // log(sketch.version.api);
// log(sketch.version.sketch);


var document = sketch.getSelectedDocument();
var Artboard = sketch.Artboard;
var Group = sketch.Group;
var Shape = sketch.Shape;
var Rectangle = sketch.Rectangle;
var Text = sketch.Text;
var Style = sketch.Style;

var UI = __webpack_require__(/*! sketch/ui */ "sketch/ui"); // variables


var ARTBOARD_NAME = "paper";
var ARTBOARD_DISTANCE = 50;
var CUTTING_LINE_WIDTH = 1;
var CUTTING_LINE_HEIGHT = 547;
var Y_THRESHOLD_NUM = 10;
var selectedLayers = document.selectedLayers;
var page = document.selectedPage;
var NumOfArtboards = 1;
var NumOfNametagsInArtboard = 1;
var nameIndex = 0;
var counter = 0;
var paperWidth = 842;
var paperHeight = 595;
var cuttingLinesX = []; // Functions

function createFirstArtboardInPage() {
  return new Artboard({
    name: ARTBOARD_NAME + counter++,
    parent: document.selectedPage,
    frame: new Rectangle(0, 0, paperWidth, paperHeight)
  });
}

function moveSelectedNametagToArtboard(artboard) {
  selectedLayers.forEach(function (layer) {
    // calculate how many nametags fit in one artboard (= paper)
    NumOfNametagsInArtboard = Math.floor(artboard.frame.width / layer.frame.width);
    var edgeGutters = paperWidth - NumOfNametagsInArtboard * layer.frame.width;
    layer.parent = artboard;
    layer.frame.x = artboard.frame.x + edgeGutters / 2;
    layer.frame.y = artboard.frame.y + paperHeight / 2 - layer.frame.height / 2;
    return;
  }); // selectedLayers.clear();
}

function duplicateNametagInArtboard(artboard) {
  selectedLayers.forEach(function (layer) {
    cuttingLinesX.push(layer.frame.x - 0.5);
    cuttingLinesX.push(layer.frame.x + layer.frame.width + 0.5);

    for (var i = 1; i < NumOfNametagsInArtboard; i++) {
      var dupNametag = layer.duplicate();
      var rect = dupNametag.frame;
      rect.x += i * rect.width;
      dupNametag.frame = rect;
      cuttingLinesX.push(rect.x + rect.width - 0.5);
      dupNametag.moveToFront();
    }

    return;
  });
}

function duplicateArtboard(artboard, number) {
  var j = 0;

  for (var i = 0; i <= NumOfArtboards; i++) {
    var dupArtboard = artboard.duplicate();
    var rect = dupArtboard.frame;

    if (j % Y_THRESHOLD_NUM === 0) {
      j = 0;
    }

    rect.x += j++ * (rect.width + ARTBOARD_DISTANCE);
    rect.y = Math.floor(i / Y_THRESHOLD_NUM) * (rect.height + ARTBOARD_DISTANCE);
    dupArtboard.frame = rect;
    dupArtboard.name = ARTBOARD_NAME + counter++;
    dupArtboard.selected = true;
    dupArtboard.moveToFront();
  } // remove the first reference artboard


  var refArtboard = document.getLayersNamed('paper0');
  refArtboard[0].remove();
}

function addCuttingLines(artboard, cuttingLinesX) {
  // make a parent group of cutting lines
  var cuttingLinesGroup = new Group({
    parent: artboard,
    frame: artboard.frame,
    name: 'cuttingLines'
  });

  for (var i = 0; i < cuttingLinesX.length; i++) {
    var cuttingLine = new Shape({
      parent: cuttingLinesGroup,
      frame: new Rectangle(cuttingLinesX[i], (artboard.frame.height - CUTTING_LINE_HEIGHT) / 2, CUTTING_LINE_WIDTH, CUTTING_LINE_HEIGHT)
    });
    cuttingLine.style.fills = [{
      color: '#BEBEBE',
      fillType: Style.FillType.Color
    }];
  }

  cuttingLinesGroup.moveToBack();
}

function isLayerNameExist() {
  var namesText = document.getLayersNamed('name');

  if (namesText == '') {
    log("Can't find 'name' layer."); // UI.message("Can't find 'name' layer.");

    UI.alert("No Layer", "Can't find 'name' layer.");
    return false;
  }

  return true;
}

function changeNames(names) {
  var namesText = document.getLayersNamed('name');
  namesText.forEach(function (name, i) {
    // name.alignment = Text.Alignment.center;
    if (i >= names.length) {
      name.text = "";
      return;
    }

    name.text = names[i];
  });
}

/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  if (selectedLayers.length === 1) {
    if (!isLayerNameExist()) {
      return;
    } // get an array of names from the user


    var rawNames = UI.getStringFromUser("Insert names here.", '');

    if (rawNames == 'null') {
      // handle cancel button
      UI.message('Canceled');
      return;
    } else if (rawNames == '') {
      // handle empty input
      UI.alert('No Input', 'Please enter names.');
      return;
    } // split raw names into an array


    var names = rawNames.split("\n"); // create the first artboard in the current page
    // -> v0.7 make it customizable (ie. US Letter size)

    var paper = createFirstArtboardInPage(); // move the nametag group to the first artobard

    moveSelectedNametagToArtboard(paper); // measure the width of the nametag and duplicate as many to fit into the artboard

    duplicateNametagInArtboard(paper); // add cutting lines at the edges of nametags and place at the bottom

    addCuttingLines(paper, cuttingLinesX); // clear the first group selection

    selectedLayers.forEach(function (layer) {
      layer.parent.selected = true;
      layer.selected = false;
    }); // duplicate artboards based on the number of names

    NumOfArtboards = Math.floor((names.length - 1) / 3);
    duplicateArtboard(paper, NumOfArtboards); // change text ('name' layer) for all nametags

    changeNames(names);
  } else {
    UI.alert('Selection Error', 'Select a layer group first to duplicate.');
  }
});

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

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