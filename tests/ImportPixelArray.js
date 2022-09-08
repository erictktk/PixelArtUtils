//import defaultJSONObject from "./initial_title.json" assert { type: "json"};
import defaultJSONObject from "./initial_title.json" assert { type: "json"};
import { PixelArray } from "../PixelArray.js";


export function PixelArrayFromJSON(jsonObj){
    if (!jsonObj){
        jsonObj = defaultJSONObject;
    }
    const colorArr = jsonObj['document']['colorArr'];
    console.log(colorArr);

    let [width, height] = [32, 32];
    if (jsonObj['document']['width']){
        width = jsonObj['document']['width'];
        height = jsonObj['document']['height'];
    }

    const pixelArray = new PixelArray(null, width, height);

    let curColor = null;
    for(let i = 0; i < width; i += 1){
        for(let j = 0; j < height; j += 1){
            curColor = colorArr[j + i*width];
            pixelArray.setColorValue(i, j, curColor);
        }
    }

    return pixelArray;
}