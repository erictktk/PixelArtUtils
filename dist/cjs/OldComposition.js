'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//#region OffsetUtils

//#endregion

//#region Color
function getIndex(x, y, imagedataWidth) {
  return (x + y * imagedataWidth) * 4;
}

/** Sets color value in a Uint8Array
 * 
 * @param {Uint8Array} array 
 * @param {Array<int>} value 
 */
function setColorValue(x, y, width, array, value) {
  var index = getIndex(x, y, width);
  array[index + 0] = value[0];
  array[index + 1] = value[1];
  array[index + 2] = value[2];
  array[index + 3] = value[3];
}

/**
 * 
 * @param {Uint8ClampedArray} array 
 * @returns 
 */
function getColorValue(x, y, width, array) {
  var index = getIndex(x, y, width);
  return [array[index], array[index + 1], array[index + 2], array[index + 3]];
}
//#endregion

/**
 * 
 * @param {Array<Int>} color 
 * @returns {Array<Float>}
 */
function getParamColor(color) {
  return [color[0] / 255, color[1] / 255, color[2] / 255, color[3] / 255];
}

/**
 * 
 * @param {Array<Float>} paramColor 
 * @returns {Array<int>}
 */
function get32Color(paramColor) {
  return [Math.round(paramColor[0] * 255), Math.round(paramColor[1] * 255), Math.round(paramColor[2] * 255), Math.round(paramColor[3] * 255)];
}

/** Default blend mode
 * 
 * @param {Array<Number>} color1 
 * @param {Array<Number>} color2 
 * @returns {Array<Number>}
 */
function Over(color1, color2) {
  //e = (etop*atop + ebottom*abottom(1-atop)))  / divisor
  //color2 == top
  var pColor1 = getParamColor(color1);
  var pColor2 = getParamColor(color2);

  //console.log(pColor1);

  var a1 = pColor1[3];
  var a2 = pColor2[3];
  var divisor = a2 + a1 * (1 - a2);
  var r = (pColor2[0] * a2 + pColor1[0] * a1 * (1 - a2)) / divisor;
  var g = (pColor2[1] * a2 + pColor1[1] * a1 * (1 - a2)) / divisor;
  var b = (pColor2[2] * a2 + pColor1[2] * a1 * (1 - a2)) / divisor;
  var a = a2 + a1 * (1 - a2);

  //console.log("r = " + r);

  return get32Color([r, g, b, a]);
}

/** Over with custom alpha multiplier (which is independent)
 * 
 * @param {number} customAlphaMultiplier
 * @returns {Array[number]}
 */
function OverCustomAlpha(color1, color2, customAlphaMultiplier = 0.5) {
  //e = (etop*atop + ebottom*abottom(1-atop)))  / divisor
  //color2 == top
  var pColor1 = getParamColor(color1);
  var pColor2 = getParamColor(color2);

  //console.log(pColor1);

  var a1 = pColor1[3];
  var a2 = Math.round(pColor2[3]) * customAlphaMultiplier;
  var divisor = a2 + a1 * (1 - a2);
  var r = (pColor2[0] * a2 + pColor1[0] * a1 * (1 - a2)) / divisor;
  var g = (pColor2[1] * a2 + pColor1[1] * a1 * (1 - a2)) / divisor;
  var b = (pColor2[2] * a2 + pColor1[2] * a1 * (1 - a2)) / divisor;
  var a = a2 + a1 * (1 - a2);
  return get32Color([r, g, b, a]);
}

/** Overlay blend mode
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @param {Number|null} customAlpha blend from 0 to 1 if not null
 * @returns {Array<Int>}
 */
function Overlay(color1, color2, customAlpha = null) {
  var p1 = getParamColor(color1);
  var p2 = getParamColor(color2);
  var newColor = [];
  var valueUnit = null;
  var min = null;
  for (var i = 0; i < 3; i += 1) {
    if (p1[i] > 0.5) {
      valueUnit = (p2[i] - p1[i]) / 0.5;
      min = p1[i] - (p2[i] - p1[i]);
      newColor.push(p2[i] * valueUnit + min);
    } else {
      valueUnit = p1[i] / 0.5;
      newColor.push(p2[i] * valueUnit);
    }
  }
  var r = newColor[0];
  var g = newColor[1];
  var b = newColor;
  var color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    //alpha blending
    color32[3] = color2[3];
    if (customAlpha !== null) {
      return OverCustomAlpha(color1, color32, customAlpha);
    } else {
      return Over(color1, color32);
    }
  }
}

/** Screen overlay mode
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function Screen(color1, color2) {
  var p1 = getParamColor(color1);
  var p2 = getParamColor(color2);
  var r = 1 - (1 - p1[0]) * (1 - p2[0]);
  var g = 1 - (1 - p1[1]) * (1 - p2[1]);
  var b = 1 - (1 - p1[2]) * (1 - p2[2]);
  var color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    //alpha blending
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

/** Multiply color mode 
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function Multiply(color1, color2) {
  const p1 = getParamColor(color1);
  const p2 = getParamColor(color2);
  const r = p1[0] * p2[0];
  const g = p1[1] * p2[1];
  const b = p1[2] * p2[2];
  const color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

/**
 * A class that acts as a wrapper for a Uint8ClampedArray that represents an RGBA image.
 */

class PixelArray {
  constructor(array, initWidth, initHeight = null, xPos = 0, yPos = 0) {
    if (array !== null) {
      this.array = array;
    } else {
      this.array = new Uint8ClampedArray(initWidth * initHeight * 4);
    }
    this.width = initWidth;
    if (initWidth !== null) {
      this.height = this.array.length / (initWidth * 4);
    } else {
      this.height = initHeight;
    }
    this.xPos = xPos;
    this.yPos = yPos;
    this.xMin = xPos;
    this.xMax = xPos + this.width;
    this.yMin = yPos;
    this.yMax = yPos + this.height;

    //this.bounds = new Utils.Bounds(this.array, initWidth);
  }
  xOffset() {
    return this.xPos;
  }
  yOffset() {
    return this.yPos;
  }

  //alias
  get arr() {
    return this.array;
  }
  getIndex(x, y) {
    return (x + y * this.width) * 4;
  }

  /**
   * 
   * @param {Int} x 
   * @param {Int} y 
   * @param {Array<int>} value 
   */
  setColorValue(x, y, value) {
    var index = this.getIndex(x, y);
    this.array[index + 0] = value[0];
    this.array[index + 1] = value[1];
    this.array[index + 2] = value[2];
    this.array[index + 3] = value[3];
  }
  clip(x1, y1, x2, y2) {
    for (let i = 0; i < this.width; i += 1) {
      for (let j = 0; j < this.height; j += 1) {
        if (i < x1 || i >= x2 || j < y1 || j >= y2) {
          this.setColorValue(i, j, [0, 0, 0, 0]);
        }
      }
    }
  }
  copyFromArr(arr) {
    for (let i = 0; i < this.arr.length; i += 1) {
      this.arr[i] = arr[i];
    }
  }

  /** Makes a deep copy of a PixelArray
   *
   * @param {PixelArray} oldPixelArray
   * @returns {PixelArray}
   */
  static CopyPixelFactory(oldPixelArray) {
    //console.log(oldPixelArray.array);
    const copyArray = Uint8ClampedArray.from(oldPixelArray.array);
    return new PixelArray(copyArray, oldPixelArray.width, oldPixelArray.height, oldPixelArray.xPos, oldPixelArray.yPos);
  }

  /** Copys a Utin8ClampedArray, then puts it into a new PixelArray
   * 
   * @param {Uint8ClampedArray} array
   * @returns {PixelArray}
   */
  static CopyFactory(array, width) {
    const copyArray = Uint8ClampedArray.from(array);
    return new PixelArray(copyArray, width);
  }

  /** Copy another PixelArray into this one
   * 
   * @param {PixelArray} otherPixelArray 
   * @param {Array<Int>} bounds 
   * @param {Int} xOffset 
   * @param {Int} yOffset 
   */
  copyInto(otherPixelArray, bounds, xOffset = 0, yOffset = 0) {
    for (let i = bounds[0]; i < bounds[2]; i += 1) {
      for (let j = bounds[1]; j < bounds[3]; j += 1) {
        const curValue = otherPixelArray.getColorValue(i, j);
        this.setColorValue(i + xOffset, j + yOffset, curValue);
      }
    }
  }

  /**Fills a pixel array with a color
   *
   * @param {Array<number>} color
   */
  fill(color) {
    for (let i = 0; i < this.width; i += 1) {
      for (let j = 0; j < this.height; j += 1) {
        this.setColorValue(i, j, color);
      }
    }
  }

  /** Fills a box with color
   *
   */
  fillBox(color, x1, x2, y1, y2) {
    for (let i = x1; i < x2; i += 1) {
      for (let j = y1; j < y2; j += 1) {
        this.setColorValue(i, j, color);
      }
    }
  }

  /**
   * Fills the pixel array with a specific color if passes alphaMin 
   */
  fillColorValue(color, alphaMin = 200) {
    for (let i = 0; i < this.width; i += 1) {
      for (let j = 0; j < this.height; j += 1) {
        if (this.getColorValue(i, j)[3] > alphaMin) {
          this.setColorValue(i, j, color);
        }
      }
    }
  }

  /**
   * @returns Array<int>
   */
  getColorValue(x, y) {
    var index = this.getIndex(x, y);
    return [this.array[index + 0], this.array[index + 1], this.array[index + 2], this.array[index + 3]];
  }

  /** Gets first found color from pixelArray
   * @returns {Array<Int>|null}
   */
  getFirstFoundColor() {
    for (let i = 0; i < this.width; i += 1) {
      for (let j = 0; j < this.height; j += 1) {
        //
        const color = this.getColorValue(i, j);
        if (color[3] >= 1) {
          return color;
        }
      }
    }
    return null;
  }

  /** Draws PixelArray to specified canvas element
   * 
   * @param {HTMLCanvasElement} canvas 
   */
  toCanvas(canvas) {
    /**@type{HTMLCanvasElement} */
    const context = canvas.getContext("2d");
    const imgData = new ImageData(this.arr, this.width);
    context.putImageData(imgData, 0, 0);
  }
}

function scaleImageData(imageData, scale) {
  var scaled = ctx.createImageData(imageData.width * scale, imageData.height * scale);
  var subLine = ctx.createImageData(scale, 1).data;
  for (var row = 0; row < imageData.height; row++) {
    for (var col = 0; col < imageData.width; col++) {
      var sourcePixel = imageData.data.subarray((row * imageData.width + col) * 4, (row * imageData.width + col) * 4 + 4);
      for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x * 4);
      for (var y = 0; y < scale; y++) {
        var destRow = row * scale + y;
        var destCol = col * scale;
        scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4);
      }
    }
  }
  return scaled;
}

/**
 *
 * @param {PixelArray} pArray1
 * @param {PixelArray} pArray2
 * @param {*} blendOp
 * @param {Uint8ClampedArray} newArray
 * @param {*} xMove
 * @param {*} yMove
 * @returns {Uint8ClampedArray}
 */
function blendColorLayers(pArray1, pArray2, blendOp = null, newArray = null, xMove = 0, yMove = 0) {
  pArray2.xPos = pArray2.xPos + xMove;
  pArray2.yPos = pArray2.yPos + yMove;
  var x1 = pArray1.xPos;
  var x2 = pArray2.xPos;
  var y1 = pArray1.yPos;
  var y2 = pArray2.yPos;
  var xOffset = x1 - x2;
  var yOffset = y1 - y2;
  var width1 = pArray1.width;
  pArray1.height;
  var width2 = pArray2.width;
  pArray2.height;
  var startI = Math.max(0, x2 - x1);
  var startJ = Math.max(0, y2 - y1);
  var endX = Math.min(x1 + pArray1.width, x2 + pArray2.width);
  var length = Math.max(0, endX - startI);
  var endY = Math.min(y1 + pArray1.height, y2 + pArray2.height);
  var height = Math.max(0, endY - startJ);
  if (blendOp === null) {
    blendOp = (pixel1, pixel2) => {
      return Over(pixel1, pixel2);
    };
  } else if (typeof blendOp === "string") {
    blendOp = blendOp.toLowerCase();
    if (blendOp === "overlay") {
      blendOp = (p1, p2) => {
        return Overlay(p1, p2);
      };
    } else if (blendOp === "over" || blendOp === "normal") {
      blendOp = (p1, p2) => {
        return Over(p1, p2);
      };
    } else if (blendOp === "screen") {
      blendOp = (p1, p2) => {
        return Screen(p1, p2);
      };
    } else if (blendOp === "multiply") {
      blendOp = (p1, p2) => {
        return Multiply(p1, p2);
      };
    }
  }
  var theArray = null;
  if (newArray === null) {
    theArray = new Uint8ClampedArray(pArray1.arr);
  } else {
    theArray = newArray;
  }
  var pixel1 = null;
  var pixel2 = null;
  var newValue = null;
  var newColor = [];
  for (var i = startI; i < startI + length; i += 1) {
    for (var j = startJ; j < startJ + height; j += 1) {
      pixel1 = getColorValue(i, j, width1, theArray);
      pixel2 = getColorValue(i + xOffset, j + yOffset, width2, pArray2.arr);
      if (blendOp === null) {
        if (pixel2[3] >= 254) {
          setColorValue(i, j, width1, theArray, pixel2);
        } else {
          newColor = blendOp(pixel1, pixel2);
          setColorValue(i, j, width1, theArray, newColor);
        }
      } else {
        newValue = blendOp(pixel1, pixel2);
        setColorValue(i, j, width1, theArray, newValue);
      }
    }
  }
  pArray2.xPos = pArray2.xPos - xMove;
  pArray2.yPos = pArray2.yPos - yMove;
  return theArray;
}

//#region Interop
function imgToImgDataWrapper(img, imageDataW) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  try {
    context.drawImage(img, 0, 0);
    imageDataW.imageData = context.getImageData(0, 0, img.width, img.height);
  } catch (err) {
    console.log("error!");
    console.log(err);
  }
}
function imgToImgData(img, imageData = null) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
  try {
    return context.getImageData(0, 0, img.width, img.height);
  } catch (err) {
    console.log("error!");
    console.log(err);
  }
}

//#endregion

function AlphaCompositionMask(pixelArray, alphaArray, minAlpha = 254) {
  for (let i = 0; i < pixelArray.width; i += 1) {
    for (let j = 0; j < pixelArray.height; j += 1) {
      if (alphaArray.getColorValue(i, j)[3] <= minAlpha) {
        pixelArray.setColorValue(i, j, [0, 0, 0, 0]);
      }
    }
  }
}
function AlphaCompositionMaskNew(pixelArray, alphaArray, minAlpha = 254) {
  let resultArray = new PixelArray(null, pixelArray.width, pixelArray.height);
  for (let i = 0; i < pixelArray.width; i += 1) {
    for (let j = 0; j < pixelArray.height; j += 1) {
      if (alphaArray.getColorValue(i, j)[3] >= minAlpha) {
        resultArray.setColorValue(i, j, pixelArray.getColorValue(i, j));
      }
    }
  }
  return resultArray;
}

exports.AlphaCompositionMask = AlphaCompositionMask;
exports.AlphaCompositionMaskNew = AlphaCompositionMaskNew;
exports.blendColorLayers = blendColorLayers;
exports.imgToImgData = imgToImgData;
exports.imgToImgDataWrapper = imgToImgDataWrapper;
exports.scaleImageData = scaleImageData;
