import { PixelArray } from "./PixelArray.js";

export function EnlargeCanvasStretch(pixelArray, left, right, bottom, top){

}


/**
 * 
 * @param {PixelArray} pixelArray 
 * @param {*} left 
 * @param {*} right 
 * @param {*} bottom 
 * @param {*} top 
 * @return {PixelArray}
 */
export function EnlargeCanvasEmpty(pixelArray, left, right, bottom, top){
    const width = pixelArray.width + left + right;
    const height = pixelArray.height + bottom + top;

    const newPixelArray = new PixelArray(null, width, height);

    for(let i = 0; i < pixelArray.width; i += 1){
        for(let j = 0; j < pixelArray.height; j += 1){
            const newI = i + left;
            const newJ = j + top;

            const color = pixelArray.getColorValue(i, j);
            newPixelArray.setColorValue(i, j, color);
        }
    }

    return newPixelArray;
}