// Event Badges by David
// 4 August, 2018
// Copyright (c) 2018 David Lee, davidlee.kr



const sketch = require('sketch');
// log(sketch.version.api);
// log(sketch.version.sketch);
const document = sketch.getSelectedDocument();
const Page = sketch.Page;
const Artboard = sketch.Artboard;
const Group = sketch.Group;
const Shape = sketch.Shape;
const Rectangle = sketch.Rectangle;
const Text = sketch.Text;
const Style = sketch.Style;
const UI = require('sketch/ui');



// variables
const ARTBOARD_NAME = "paper";
const ARTBOARD_DISTANCE = 50;
const CUTTING_LINE_WIDTH = 1;
const CUTTING_LINE_HEIGHT = 547;
const Y_THRESHOLD_NUM = 10;
let selectedLayers = document.selectedLayers;
let page = document.selectedPage;
let NumOfArtboards = 1;
let NumOfNametagsInArtboard = 1
let nameIndex = 0;
let counter = 0;
let paperWidth = 842;
let paperHeight = 595;
let cuttingLinesX = [];




// Functions
function createFirstArtboardInPage() {
  return new Artboard({
    name: ARTBOARD_NAME + counter++,
    parent: document.selectedPage,
    frame: new Rectangle(0, 0, paperWidth, paperHeight),
  });
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
    cuttingLinesX.push(layer.frame.x - 0.5);
    cuttingLinesX.push(layer.frame.x + layer.frame.width + 0.5);
    for (let i = 1; i < NumOfNametagsInArtboard; i++) {
      const dupNametag = layer.duplicate();
      const rect = dupNametag.frame;
      rect.x += i * rect.width;
      dupNametag.frame = rect;
      cuttingLinesX.push(rect.x + rect.width - 0.5);
      dupNametag.moveToFront();
    }
    return;
  });
}

function duplicateArtboard(artboard, number) {
  let j = 0;
  for (let i = 0; i <= NumOfArtboards; i++) {
    const dupArtboard = artboard.duplicate();
    const rect = dupArtboard.frame;
    if (j % Y_THRESHOLD_NUM === 0) {
      j = 0;
    }
    rect.x += j++ * (rect.width + ARTBOARD_DISTANCE);
    rect.y = Math.floor(i / Y_THRESHOLD_NUM) * (rect.height + ARTBOARD_DISTANCE);
    dupArtboard.frame = rect;
    dupArtboard.name = ARTBOARD_NAME + counter++;
    dupArtboard.selected = true;
    dupArtboard.moveToFront();
  }
  // remove the first reference artboard
  let refArtboard = document.getLayersNamed('paper0');
  refArtboard[0].remove();
}

function addCuttingLines(artboard, cuttingLinesX) {
  // make a parent group of cutting lines
  let cuttingLinesGroup = new Group({
    parent: artboard,
    frame: artboard.frame,
    name: 'cuttingLines',
  });

  for (let i = 0; i < cuttingLinesX.length; i++) {
    let cuttingLine = new Shape({
      parent: cuttingLinesGroup,
      frame: new Rectangle(cuttingLinesX[i], (artboard.frame.height - CUTTING_LINE_HEIGHT) / 2, CUTTING_LINE_WIDTH, CUTTING_LINE_HEIGHT),
    });
    cuttingLine.style.fills = [
      {
        color: '#BEBEBE',
        fillType: Style.FillType.Color,
      },
    ]
  }
  cuttingLinesGroup.moveToBack();
}

function isLayerNameExist() {
  let namesText = document.getLayersNamed('name');
  if (namesText == '') {
    UI.alert("No Layer", "Can't find 'name' layer.");
    return false;
  }
  return true;
}

function changeNames(names) {
  let namesText = document.getLayersNamed('name');
  namesText.forEach((name, i) => {
    // name.alignment = Text.Alignment.center;
    if (i >= names.length) {
      name.text = "";
      return;
    }
    name.text = names[i];
  });
}




export default function(context) {
  if (selectedLayers.length === 1) {
    if (!isLayerNameExist()) {
      return;
    }

    // get an array of names from the user
    let rawNames = UI.getStringFromUser("Insert names here.", '');

    if (rawNames == 'null') {
      // handle cancel button
      UI.message('Canceled');
      return;
    } else if (rawNames == '') {
      // handle empty input
      UI.alert('No Input', 'Please enter names.');
      return;
    }

    // split raw names into an array
    const names = rawNames.split("\n");

    // create the first artboard in the current page
    // -> v0.7 make it customizable (ie. US Letter size)
    let paper = createFirstArtboardInPage();

    // move the nametag group to the first artobard
    moveSelectedNametagToArtboard(paper);

    // measure the width of the nametag and duplicate as many to fit into the artboard
    duplicateNametagInArtboard(paper);

    // add cutting lines at the edges of nametags and place at the bottom
    addCuttingLines(paper, cuttingLinesX);

    // clear the first group selection
    selectedLayers.forEach(layer => {
      layer.parent.selected = true;
      layer.selected = false;
    });

    // duplicate artboards based on the number of names
    NumOfArtboards = Math.floor((names.length - 1) / NumOfNametagsInArtboard);
    duplicateArtboard(paper, NumOfArtboards);

    // change text ('name' layer) for all nametags
    changeNames(names);

  } else {
    UI.alert('Selection Error', 'Select a layer group first to duplicate.');
  }



}
