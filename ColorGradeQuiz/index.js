import { PixelArray } from "../PixelArray.js";
import * as PixelArrayLoading from "../PixelArrayLoading.js";
import * as HSVUtils from "../HSVUtils.js";

const pArray = new PixelArray(null, 32, 32);

/**@type {PixelArray} */
let originalPixelArray = null;
let canvas = null;

async function main(){
    originalPixelArray = await PixelArrayLoading.AsyncUrlToPixelArray('NES_02.gif');
    canvas = PixelArrayLoading.PixelArrayToCanvas(originalPixelArray);
    document.body.append(canvas);
}

main();

const callback = (e) => {
    const value = input.value;
    const pixelArray = HSVUtils.HSVSaturate(originalPixelArray, value, 50, 0);
    pixelArray.toCanvas(canvas);
}


const input = document.createElement('input');
input.type = "range";
input.min = 0;
input.max = 360
input.addEventListener('input', (e)=>callback(e))
document.body.append(input);