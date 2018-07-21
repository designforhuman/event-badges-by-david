// NameTag Generator v0.5
// Designed and Coded by David Lee @DesignSpectrum, @Daylight Design
// 26 June, 2018


var document = require('sketch/dom').getSelectedDocument()
var UI = require('sketch/ui')




export default function(context) {

  var selectedLayers = document.selectedLayers
  var selectedCount = selectedLayers.length
  var nameIndex = 0
  var TOTAL_ARTBOARD = 1
  var DISTANCE_ARTBOARD = 50
  var DISTANCE_NAMETAG = 0




  if (selectedCount === 0) {
    UI.alert('Layer Selection Error', 'Please select one artboard first to copy and generate nametags.')
    // var rect = new Rectangle(0, 0, 100, 100)
  } else if (selectedCount > 1) {
    UI.alert('Layer Selection Error', 'Please select only one artboard.')
  } else {

    // UI.message(`${selectedCount} layers selected.`)
    // var result = document.askForUserInput("How many?")
    // UI.alert(`${result}`, 'hi')
    // UI.message(artboard)
    var namesRaw = UI.getStringFromUser("Insert names here.")

    var names = namesRaw.split("\n")
    // log(names.toString())

    TOTAL_ARTBOARD = Math.ceil(names.length/3)
    // log('artboard: ' + TOTAL_ARTBOARD)


    // get the artboard
    selectedLayers.map(artboard => {
      for(var i = 0; i < TOTAL_ARTBOARD; i++) {

        var dupArtboard = artboard.duplicate()
        var rect = dupArtboard.frame
        rect.x += i * (rect.width + DISTANCE_ARTBOARD)
        dupArtboard.frame = rect

        dupArtboard.layers.map(nametag => {
          for(var j = 0; j < 3; j++) {

            if(nameIndex > names.length - 1) {
              nametag.remove()
              return
            }

            // duplicate
            var dupNametag = nametag.duplicate()
            var rect = dupNametag.frame
            rect.x += j * (rect.width + DISTANCE_NAMETAG)
            dupNametag.frame = rect

            // find name layer and replace it
            dupNametag.layers.map(layer => {
              if(layer.name.toLowerCase() == "name") {
                layer.text = names[nameIndex]
                nameIndex++
                return
              }
            })
            log("INDEX: " + nameIndex)
            log("NAMES: " + names.length)

          }
          nametag.remove()
        })

      }
      artboard.remove()
    })

  }


}
