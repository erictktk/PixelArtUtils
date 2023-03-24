import { PixelArray } from "./PixelArray.js";
import * as PixelUtils from "./PixelUtils.js";

export class HSVMod{
    /**
     * 
     * @param {*} name 
     * @param {*} values 
     * @param {*} tags 
     */
    constructor(name, values, tags=[]){
        this.name = name;
        this.hsv = {h: values[0], s: values[1], v: values[2]};
        this.tags = tags;
    }
}

/**
 * returns h [0, 360), s [0, 100), v [0, 100)
 * 
 * @param {Array<int>} color 
 * @returns 
 */

export function rgb_to_hsv(color) {
    let r = color[0];
    let g = color[1];
    let b = color[2];
 
    // R, G, B values are divided by 255
    // to change the range from 0..255 to 0..1
    r = r / 255.0;
    g = g / 255.0;
    b = b / 255.0;

    // h, s, v = hue, saturation, value
    var cmax = Math.max(r, Math.max(g, b)); // maximum of r, g, b
    var cmin = Math.min(r, Math.min(g, b)); // minimum of r, g, b
    var diff = cmax - cmin; // diff of cmax and cmin.
    var h = -1, s = -1;

    // if cmax and cmax are equal then h = 0
    if (cmax === cmin)
        h = 0;

    // if cmax equal r then compute h
    else if (cmax === r)
        h = (60 * ((g - b) / diff) + 360) % 360;

    // if cmax equal g then compute h
    else if (cmax === g)
        h = (60 * ((b - r) / diff) + 120) % 360;

    // if cmax equal b then compute h
    else if (cmax === b)
        h = (60 * ((r - g) / diff) + 240) % 360;

    // if cmax equal zero
    if (cmax === 0)
        s = 0;
    else
        s = (diff / cmax) * 100;

    // compute v
    let v = cmax * 100;
    
    return [h, s, v];
}

/**
 * hsv should be [0, 360), [0, 100) and 
 * 
 * @param {Array<int>} hsv 
 * @returns 
 */
export function hsv_to_rgb(hsv){
    //0 <= h, s, v <= 1 needs to be

    let h = hsv[0];
    let s = hsv[1];
    let v = hsv[2];

    h = h/360;
    s = s/100;
    v = v/100;

    let r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}



export function hsv2rgb(hsv) { 
    let h = hsv[0];
    let s = hsv[1]/100;
    let v = hsv[2]/100;                       
    let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
    return [f(5)*255,f(3)*255,f(1)*255];       
}   

/**
 * 
 * @param {Array<int>} rgb 
 * @param {*} hueMod 
 * @param {*} saturateMod 
 * @param {*} valueMod 
 */
export function HSVModSinglePixel(rgb, hueMod, saturateMod, valueMod){
    let hsv = rgb_to_hsv(rgb);

    hsv[0] = hueMod;
    
    hsv[1] = Math.min(Math.max((hsv[1] + saturateMod), 0), 100);
    
    hsv[2] = Math.min(Math.max((hsv[2] + valueMod), 0 ), 100);
    let newRGB3 = hsv2rgb(hsv);

    let newRGB = [newRGB3[0], newRGB3[1], newRGB3[2], rgb[3]];

    return newRGB;
}

/**
 * 
 * @param {PixelArray} pArray 
 * @return {PixelArray}
 */
export function HSVModPixelArray(pArray, hueMod, saturateMod, valueMod){
    let hsv = [];
    let newRGB = [];
    const width = pArray.width;
    const array = pArray.array;
    const newArray = new PixelArray(null, width, pArray.height);
    for(let i = 0; i < width; i += 1){
        for(let j = 0; j < pArray.height; j += 1){
            hsv = PixelUtils.getColorValue(i, j, width, array);

            hsv[0] = (hsv[0] + hueMod)%360;
            hsv[1] = Math.min(Math.max((hsv[1] + saturateMod), 0), 100);
            hsv[2] = Math.min(Math.max((hsv[2] + valueMod), 0 ), 100);

            newRGB = hsv_to_rgb(hsv);

            PixelUtils.setColorValue(i, j, width, newArray.array, newRGB);
        }
    }
    
    return newArray;
}

/**
 * @param {PixelArray} pArray 
 * @param {hue} Number
 * @param {saturate} Number
 * @param {valueMod} Number
 * @returns {PixelArray}
 */
export function HSVSaturate(pArray, hue, saturate, valueMod){
    let hsv = [];
    let rgb = [];
    let newRGB = [];
    let newRGB3 = [];
    const width = pArray.width;
    const array = pArray.array;
    const newPArray = new PixelArray(null, width, pArray.height);
    for(let i = 0; i < width; i += 1){
        //console.log(i);
        for(let j = 0; j < pArray.height; j += 1){
            
            rgb = PixelUtils.getColorValue(i, j, width, array);

            hsv = rgb_to_hsv(rgb);

            hsv[0] = hue;
            hsv[1] = Math.min(Math.max(saturate, 0), 100);
            hsv[2] = Math.min(Math.max((hsv[2] + valueMod), 0 ), 100);
            newRGB3 = hsv2rgb(hsv);

            newRGB = [newRGB3[0], newRGB3[1], newRGB3[2], rgb[3]];

            //console.log(newRGB);

            PixelUtils.setColorValue(i, j, width, newPArray.arr, newRGB);
        }
        //console.log( PixelUtils.getColorValue(0, j, width, newPArray.arr) );
    }

    return newPArray;
}