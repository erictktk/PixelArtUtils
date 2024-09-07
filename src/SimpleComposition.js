import * as BlendModes from "./BlendModes.js";
import { PixelArray } from "./PixelArray.js";

//pixel1 = getColorValue(i, j, width1, theArray);

/**
 * 
 * @param {*} i 
 * @param {*} j 
 * @param {Number} width 
 * @param {Uint8ClampedArray} pixelArrayArr 
 */
function GetColorValue(i, j, width, pixelArrayArr){
    const index = i*width + j;
    const r = pixelArrayArr[index+0];
    const g = pixelArrayArr[index+1];
    const b = pixelArrayArr[index+2];
    const a = pixelArrayArr[index+3];

    return [r, g, b, a];
}

/**
 * 
 * @param {*} i 
 * @param {*} j 
 * @param {Number} width 
 * @param {Uint8ClampedArray} pixelArrayArr 
 * @param {*} newColorValue 
 */
function SetColorValue(i, j, width, pixelArrayArr, newColorValue){
    const index = i*width + j;

    let [r, g, b, a] = newColorValue;

    pixelArrayArr[index+0] = r;
    pixelArrayArr[index+1] = g;
    pixelArrayArr[index+2] = b;
    pixelArrayArr[index+3] = a;
}

/**
 * 
 * @param {PixelArray} bottomPArray 
 * @param {PixelArray} topPArray 
 */
export function SimpleBlendColorLayers(bottomPArray, topPArray, resultPArray, blendOp){
    let index = 0;

    const width = bottomPArray.width;
    const height = bottomPArray.height;

    let bottomColor = null;
    let topColor = null
    let pixel1 = null;
    let pixel2 = null;
    let newPixel = null;

    for(let i = 0; i < bottomPArray.width; i += 1){
        for(let j = 0; j < bottomPArray.height; i += 1){
            index = i*width + j;

            pixel1 = GetColorValue(i, j, width, bottomPArray.arr);
            pixel2 = GetColorValue(i, j, width, topPArray.arr);

            newPixel = blendOp(pixel1, pixel2);

            SetColorValue(i, j, width, resultPArray.arr, newPixel);
        }
    }
}