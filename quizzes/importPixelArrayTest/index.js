import InteractiveCanvas from "../../../Canvases/InteractiveCanvas.js";
import { PixelArray } from "../../PixelArray.js";
import * as ImportPixelArray from "../../tests/ImportPixelArray.js";
import * as Islands from "../../Islands.js";

const importedPArray = ImportPixelArray.PixelArrayFromJSON();

const canvas = new InteractiveCanvas(importedPArray, null, null);
canvas.isEnabled = false;
document.body.append(canvas.element);

//get pixel Islands
const islands = Islands.PixelArrayToPArrayIslands(importedPArray);

console.log(islands.length);

//color = [255, 207, 145, 255];
let theIsland = null;
for(let i = 0; i < islands.length; i += 1){
    const color = Islands.GetColorFromIslandPArray(islands[i]);
    if (color[0] === 255 && color[1] === 207){
        theIsland = islands[i];
        break;
    }
}

console.log(theIsland.xOffset());

const nullPA = new PixelArray(null, 64, 64)
const secondCanvas = new InteractiveCanvas(nullPA);
secondCanvas.isEnabled = false;
document.body.append(secondCanvas.element);
