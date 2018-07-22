// NameTag Generator
// 26 June, 2018
// Copyright (c) 2018 David Lee, davidlee.kr



var sketch = require('sketch/dom');
var document = require('sketch/dom').getSelectedDocument();
var Artboard = require('sketch/dom').Artboard;
var Rectangle = require('sketch/dom').Rectangle;
var Text = require('sketch/dom').Text;
var UI = require('sketch/ui');



// variables
const DISTANCE_ARTBOARD = 50;
const ARTBOARD_NAME = "paper";
// const DISTANCE_NAMETAG = 0;
let selectedLayers = document.selectedLayers;
let page = document.selectedPage;
let NumOfArtboards = 1;
let NumOfNametagsInArtboard = 1
let nameIndex = 0;
let counter = 0;
let paperWidth = 842;
let paperHeight = 595;

// var file_path = selectFolder();




// Functions
function createArtboardInPage() {
  return new Artboard({
    name: ARTBOARD_NAME + counter++,
    // name: ARTBOARD_NAME,
    parent: document.selectedPage,
    frame: new Rectangle(0, 0, paperWidth, paperHeight),
  });
  // return newArtboard;
}

function moveSelectedNametagToArtboard(artboard) {
  selectedLayers.forEach(layer => {
    // calculate how many nametags fit in one artboard (= paper)
    NumOfNametagsInArtboard = Math.floor(artboard.frame.width / layer.frame.width);
    const edgeGutters = paperWidth - (NumOfNametagsInArtboard * layer.frame.width);
    layer.parent = artboard;
    layer.frame.x = artboard.frame.x + edgeGutters/2;
    layer.frame.y = artboard.frame.y + paperHeight/2 - layer.frame.height/2;
    return;
  });
  // selectedLayers.clear();
}

function duplicateNametagInArtboard(artboard) {
  selectedLayers.forEach(layer => {
    for (let i = 1; i < NumOfNametagsInArtboard; i++) {
      const dupNametag = layer.duplicate();
      const rect = dupNametag.frame;
      rect.x += i * rect.width;
      dupNametag.frame = rect;
    }
    return;
  });
}

function duplicateArtboard(artboard, number) {
  for (let i = 1; i < NumOfArtboards; i++) {
    const dupArtboard = artboard.duplicate();
    const rect = dupArtboard.frame;
    rect.x += i * (rect.width + DISTANCE_ARTBOARD);
    dupArtboard.frame = rect;
    dupArtboard.name = ARTBOARD_NAME + counter++;
    dupArtboard.selected = true;
  }
}

function changeNames(names) {
  var namesText = document.getLayersNamed('name');
  // for(var i = 0; i < namesText.length; i++) {
  //   namesText[i].text = names[i];
  // }
  namesText.forEach((name, i) => {
    // name.alignment = Text.Alignment.center;
    if (i >= names.length) {
      name.text = "";
      return;
    }
    name.text = names[i];
  });
}

function exportAsPDF() {
  selectedLayers.forEach(paper => {
    const options = {formats: 'pdf'};
    sketch.export(paper, options);
  });
  // selectedLayers.clear();
}







export default function(context) {

  // test layer type
  // selectedLayers.map(layer => {
  //   UI.alert('layer type', layer.name + ' ' + layer.frame)
  // })

  if (selectedLayers.length === 1) {
    // get an array of names from the user
    let rawNames = UI.getStringFromUser("Insert names here.");
    const names = rawNames.split("\n");

    // create the first artboard in A4 size
    // -> make it customizable (ie. US Letter size)
    let paper = createArtboardInPage();

    // move the nametag group to the first artobard
    moveSelectedNametagToArtboard(paper);
    duplicateNametagInArtboard(paper);

    // clear the first selection
    selectedLayers.forEach(layer => {
      layer.parent.selected = true;
      layer.selected = false;
    });

    // duplicate artboards based on the number of names
    NumOfArtboards = Math.ceil(names.length/3);
    duplicateArtboard(paper, NumOfArtboards);

    // change text ('name' layer) for all nametags
    changeNames(names);

    // export
    exportAsPDF();

  } else {
    UI.alert('Selection Error', 'Please select an origin layer group to duplicate.');
  }





}
