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
function OverCustomAlphaExport(customAlphaMultiplier) {
  return (a, b) => OverCustomAlpha(a, b, customAlphaMultiplier);
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

/** Difference blend mode 
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function Difference(color1, color2) {
  const p1 = getParamColor(color1);
  const p2 = getParamColor(color2);
  const r = Math.abs(p1[0] - p2[0]);
  const g = Math.abs(p1[1] - p2[1]);
  const b = Math.abs(p1[2] - p2[2]);
  const color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

/** Darken blend mode
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function Darken(color1, color2) {
  const p1 = getParamColor(color1);
  const p2 = getParamColor(color2);
  const r = Math.min(p1[0], p2[0]);
  const g = Math.min(p1[1], p2[1]);
  const b = Math.min(p1[2], p2[2]);
  const color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

/** Lighten blend mode
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function Lighten(color1, color2) {
  const p1 = getParamColor(color1);
  const p2 = getParamColor(color2);
  const r = Math.max(p1[0], p2[0]);
  const g = Math.max(p1[1], p2[1]);
  const b = Math.max(p1[2], p2[2]);
  const color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

/** SoftLight blend mode 
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function SoftLight(color1, color2) {
  const p1 = getParamColor(color1);
  const p2 = getParamColor(color2);
  const r = (1 - 2 * p2[0]) * p1[0] * p1[0] + 2 * p2[0] * p1[0];
  const g = (1 - 2 * p2[1]) * p1[1] * p1[1] + 2 * p2[1] * p1[1];
  const b = (1 - 2 * p2[2]) * p1[2] * p1[2] + 2 * p2[2] * p1[2];
  const color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

/** Hard Light blend mode 
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function HardLight(color1, color2) {
  const p1 = getParamColor(color1);
  const p2 = getParamColor(color2);
  const r = p2[0] < 0.5 ? 2 * p1[0] * p2[0] : 1 - 2 * (1 - p1[0]) * (1 - p2[0]);
  const g = p2[1] < 0.5 ? 2 * p1[1] * p2[1] : 1 - 2 * (1 - p1[1]) * (1 - p2[1]);
  const b = p2[2] < 0.5 ? 2 * p1[2] * p2[2] : 1 - 2 * (1 - p1[2]) * (1 - p2[2]);
  const color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

/** Color Dodge blend mode 
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function ColorDodge(color1, color2) {
  const p1 = getParamColor(color1);
  const p2 = getParamColor(color2);
  const r = p2[0] === 1 ? 1 : Math.min(1, p1[0] / (1 - p2[0]));
  const g = p2[1] === 1 ? 1 : Math.min(1, p1[1] / (1 - p2[1]));
  const b = p2[2] === 1 ? 1 : Math.min(1, p1[2] / (1 - p2[2]));
  const color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

/** Color Burn blend mode 
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function ColorBurn(color1, color2) {
  const p1 = getParamColor(color1);
  const p2 = getParamColor(color2);
  const r = p2[0] === 0 ? 0 : 1 - Math.min(1, (1 - p1[0]) / p2[0]);
  const g = p2[1] === 0 ? 0 : 1 - Math.min(1, (1 - p1[1]) / p2[1]);
  const b = p2[2] === 0 ? 0 : 1 - Math.min(1, (1 - p1[2]) / p2[2]);
  const color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

/** Pin Light blend mode 
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
function PinLight(color1, color2) {
  const p1 = getParamColor(color1);
  const p2 = getParamColor(color2);
  const r = p2[0] < 0.5 ? Math.min(p1[0], 2 * p2[0]) : Math.max(p1[0], 2 * p2[0] - 1);
  const g = p2[1] < 0.5 ? Math.min(p1[1], 2 * p2[1]) : Math.max(p1[1], 2 * p2[1] - 1);
  const b = p2[2] < 0.5 ? Math.min(p1[2], 2 * p2[2]) : Math.max(p1[2], 2 * p2[2] - 1);
  const color32 = get32Color([r, g, b, 1]);
  if (color2[3] >= 254) {
    return color32;
  } else {
    color32[3] = color2[3];
    return Over(color1, color32);
  }
}

var BlendModes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Over: Over,
  OverCustomAlpha: OverCustomAlpha,
  OverCustomAlphaExport: OverCustomAlphaExport,
  Overlay: Overlay,
  Screen: Screen,
  Multiply: Multiply,
  Difference: Difference,
  Darken: Darken,
  Lighten: Lighten,
  SoftLight: SoftLight,
  HardLight: HardLight,
  ColorDodge: ColorDodge,
  ColorBurn: ColorBurn,
  PinLight: PinLight
});

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

var PixelArray$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PixelArray: PixelArray
});

/**
 * 
 * @param {PixelArray} pArray 
 * @param {int} xOffset 
 * @param {int} yOffset 
 * @returns {PixelArray}
 */
function Offset(pArray, xOffset, yOffset) {
  const offsetPArray = new PixelArray(null, pArray.width, pArray.height);
  let width = pArray.width;
  let height = pArray.height;
  let newArr = offsetPArray.array;
  let oldArr = pArray.array;
  let rgba = [];
  for (let i = 0; i < pArray.width; i += 1) {
    for (let j = 0; j < pArray.height; j += 1) {
      rgba = getColorValue((i + xOffset) % width, (j + yOffset) % height, width, oldArr);
      setColorValue(i, j, width, newArr, rgba);
    }
  }
  return offsetPArray;
}
function scaleImageData$1(imageData, scale) {
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
*  pArray1 is bottom, pArray2 is top
* @param {PixelArray} pArray1
* @param {PixelArray} pArray2 
* @param {*} blendOp 
* @param {Uint8ClampedArray} newArray 
* @param {*} xMove 
* @param {*} yMove 
* @returns {PixelArray}
*/
function blendColorLayersPArray(pArray1, pArray2, blendOp = null, newArray = null, xMove = 0, yMove = 0) {
  const resultArray = blendColorLayers$1(pArray1, pArray2, blendOp, newArray, xMove, yMove);
  return new PixelArray(resultArray, pArray1.width);
}

/**
 *  pArray1 is bottom, pArray2 is top
 * @param {PixelArray} pArray1
 * @param {PixelArray} pArray2 
 * @param {*} blendOp 
 * @param {Uint8ClampedArray} newArray 
 * @param {*} xMove 
 * @param {*} yMove 
 * @returns {Uint8ClampedArray}
 */
function blendColorLayers$1(pArray1, pArray2, blendOp = null, newArray = null, xMove = 0, yMove = 0, mask = null) {
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
    } else if (blendOp === 'over' || blendOp === 'normal') {
      blendOp = (p1, p2) => {
        return Over(p1, p2);
      };
    } else if (blendOp === 'screen') {
      blendOp = (p1, p2) => {
        return Screen(p1, p2);
      };
    } else if (blendOp === 'multiply') {
      blendOp = (p1, p2) => {
        return Multiply(p1, p2);
      };
    }
  }

  //console.log(blendOp);

  let theArray = null;
  if (newArray === null) {
    theArray = new Uint8ClampedArray(pArray1.arr);
  } else {
    theArray = newArray;
  }
  var pixel1 = null;
  var pixel2 = null;
  var newValue = null;
  var newColor = [];

  /*
  console.log('startI = ' + startI);
  console.log('startJ = ' + startJ);
  console.log('height = ' + height);
  console.log('length = ' + length);
  */
  for (let i = startI; i < startI + length; i += 1) {
    for (let j = startJ; j < startJ + height; j += 1) {
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

/**
 * 
 * @param {PixelArray} pArray 
 * @param {PixelArray} maskArray 
 * @param {function} maskFunc 
 */
function MaskPArray(pArray, maskArray, maskFunc) {
  if (!maskFunc) {
    maskFunc = BlendMaskModes.AlphaMaskMode;
  }
  new PixelArray(null, pArray.width, pArray.height);
  return blendColorLayersPArray(pArray, maskArray, maskFunc);
}

//#region Interop
function imgToImgDataWrapper$1(img, imageDataW) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
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
function imgToImgData$1(img, imageData = null) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
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

function AlphaCompositionMask$1(pixelArray, alphaArray, minAlpha = 254) {
  for (let i = 0; i < pixelArray.width; i += 1) {
    for (let j = 0; j < pixelArray.height; j += 1) {
      if (alphaArray.getColorValue(i, j)[3] <= minAlpha) {
        pixelArray.setColorValue(i, j, [0, 0, 0, 0]);
      }
    }
  }
}
function AlphaCompositionMaskNew$1(pixelArray, alphaArray, minAlpha = 254) {
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

var Composition = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Offset: Offset,
  blendColorLayersPArray: blendColorLayersPArray,
  MaskPArray: MaskPArray,
  AlphaCompositionMask: AlphaCompositionMask$1,
  AlphaCompositionMaskNew: AlphaCompositionMaskNew$1,
  imgToImgDataWrapper: imgToImgDataWrapper$1,
  imgToImgData: imgToImgData$1,
  scaleImageData: scaleImageData$1,
  blendColorLayers: blendColorLayers$1
});

var HSVClasses = /*#__PURE__*/Object.freeze({
  __proto__: null
});

//switch
class HSVMod {
  /**
   * 
   * @param {*} name 
   * @param {*} values 
   * @param {*} tags 
   */
  constructor(name, values, tags = []) {
    this.name = name;
    this.hsv = {
      h: values[0],
      s: values[1],
      v: values[2]
    };
    this.tags = tags;
  }
}

/**
 * returns h [0, 360), s [0, 100), v [0, 100)
 * 
 * @param {Array<int>} color 
 * @returns 
 */

function rgb_to_hsv(color) {
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
  var h = -1,
    s = -1;

  // if cmax and cmax are equal then h = 0
  if (cmax === cmin) h = 0;

  // if cmax equal r then compute h
  else if (cmax === r) h = (60 * ((g - b) / diff) + 360) % 360;

  // if cmax equal g then compute h
  else if (cmax === g) h = (60 * ((b - r) / diff) + 120) % 360;

  // if cmax equal b then compute h
  else if (cmax === b) h = (60 * ((r - g) / diff) + 240) % 360;

  // if cmax equal zero
  if (cmax === 0) s = 0;else s = diff / cmax * 100;

  // compute v
  let v = cmax * 100;
  return [h, s, v];
}

/**
 * Hsv should be [0, 360), [0, 100) and 
 * 
 * returns an Array of RGB values
 * 
 * @param {Array<int>} hsv 
 * @returns {<Array<Number>}
 */
function hsv_to_rgb(hsv) {
  //0 <= h, s, v <= 1 needs to be

  let h = hsv[0];
  let s = hsv[1];
  let v = hsv[2];
  h = h / 360;
  s = s / 100;
  v = v / 100;
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
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function hsv2rgb(hsv) {
  let h = hsv[0];
  let s = hsv[1] / 100;
  let v = hsv[2] / 100;
  let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5) * 255, f(3) * 255, f(1) * 255];
}

/**
 * 
 * @param {Array<int>} rgb 
 * @param {Number} hueMod 
 * @param {Number} saturateMod 
 * @param {Number} valueMod 
 * @returns {Array<Number>} an array of new RGB values
 */
function HSVModSinglePixel(rgb, hueMod, saturateMod, valueMod) {
  let hsv = rgb_to_hsv(rgb);
  hsv[0] = hueMod;
  hsv[1] = Math.min(Math.max(hsv[1] + saturateMod, 0), 100);
  hsv[2] = Math.min(Math.max(hsv[2] + valueMod, 0), 100);
  let newRGB3 = hsv2rgb(hsv);
  let newRGB = [newRGB3[0], newRGB3[1], newRGB3[2], rgb[3]];
  return newRGB;
}

/**
 * 
 * @param {PixelArray} pArray 
 * @return {PixelArray}
 */
function HSVModPixelArray(pArray, hueMod, saturateMod, valueMod) {
  let hsv = [];
  let newRGB = [];
  const width = pArray.width;
  const array = pArray.array;
  const newArray = new PixelArray(null, width, pArray.height);
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < pArray.height; j += 1) {
      hsv = getColorValue(i, j, width, array);
      hsv[0] = (hsv[0] + hueMod) % 360;
      hsv[1] = Math.min(Math.max(hsv[1] + saturateMod, 0), 100);
      hsv[2] = Math.min(Math.max(hsv[2] + valueMod, 0), 100);
      newRGB = hsv_to_rgb(hsv);
      setColorValue(i, j, width, newArray.array, newRGB);
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
function HSVSaturate(pArray, hue, saturate, valueMod) {
  let hsv = [];
  let rgb = [];
  let newRGB = [];
  let newRGB3 = [];
  const width = pArray.width;
  const array = pArray.array;
  const newPArray = new PixelArray(null, width, pArray.height);
  for (let i = 0; i < width; i += 1) {
    //console.log(i);
    for (let j = 0; j < pArray.height; j += 1) {
      rgb = getColorValue(i, j, width, array);
      hsv = rgb_to_hsv(rgb);
      hsv[0] = hue;
      hsv[1] = Math.min(Math.max(saturate, 0), 100);
      hsv[2] = Math.min(Math.max(hsv[2] + valueMod, 0), 100);
      newRGB3 = hsv2rgb(hsv);
      newRGB = [newRGB3[0], newRGB3[1], newRGB3[2], rgb[3]];

      //console.log(newRGB);

      setColorValue(i, j, width, newPArray.arr, newRGB);
    }
    //console.log( PixelUtils.getColorValue(0, j, width, newPArray.arr) );
  }
  return newPArray;
}

var HSVUtils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  HSVMod: HSVMod,
  rgb_to_hsv: rgb_to_hsv,
  hsv_to_rgb: hsv_to_rgb,
  hsv2rgb: hsv2rgb,
  HSVModSinglePixel: HSVModSinglePixel,
  HSVModPixelArray: HSVModPixelArray,
  HSVSaturate: HSVSaturate
});

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

var OldComposition = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AlphaCompositionMask: AlphaCompositionMask,
  AlphaCompositionMaskNew: AlphaCompositionMaskNew,
  imgToImgDataWrapper: imgToImgDataWrapper,
  imgToImgData: imgToImgData,
  scaleImageData: scaleImageData,
  blendColorLayers: blendColorLayers
});

/** Base function for loading an image from a url, returns a promise.
 * 
 * @param {String} url 
 * @returns {Promise}
 */
function loadImage(url, setAnonymous = false) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (setAnonymous) {
      image.crossOrigin = 'anonymous';
    }
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Couldn't load image!"));
    image.src = url;
  });
}

/** Async code for loading an image from a url.
 * 
 * @param {String} url 
 * @param {Function} callback 
 * @param {HTMLElement} element 
 * @returns {PixelArray}
 */
async function AsyncUrlToPixelArray(url, setAnonymous = false) {
  try {
    let image = await loadImage(url, setAnonymous);
    console.log(image.width);
    return ImgToPixelArray(image, null, null);
  } catch (err) {
    console.log("couldn't load image async!");
  }
}

/** Async function for loading an image from a URL. Returns a PixelArray by default.  If a callback is specified,
 * the function can return either the result from the callback or the PixelArray.
 * 
 * @param {String} url 
 * @param {Function} callback
 * @param {Boolean} returnFromCallback
 */
async function AsyncUrlToPixelArrayCallback(url, callback = null, returnFromCallback = false) {
  try {
    let image = await loadImage(url);
    const pixelArray = ImgToPixelArray(image);
    if (callback) {
      const result = callback(pixelArray);
      if (returnFromCallback) {
        return result;
      } else {
        return pixelArray;
      }
    } else {
      return pixelArray;
    }
  } catch (err) {
    console.log(err);
  }
}

/** Takes an HTMLImageElement then converts it to a PixelArray. 
 * 
 * @param {HTMLImageElement} img 
 * @param {ImageData} imageData 
 * @param {String} elementName 
 * @returns {PixelArray}
 */
function ImgToPixelArray(img, imageData = null, elementName = null) {
  try {
    /** @type {HTMLCanvasElement} */
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    //document.body.append(canvas);
    if (elementName) {
      document.getElementById(elementName).append(canvas);
    }
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    const imgData = context.getImageData(0, 0, img.width, img.height);
    const pixelArray = new PixelArray(imgData.data, img.width);
    //canvas.remove();
    return pixelArray;
  } catch (err) {
    console.log("error!");
    console.log(img.src);
    console.log(err);
  }
}

/** Returns a promise that you can .then and do a callback
 * 
 * @param {*} urls 
 * @returns 
 */
async function AsyncUrlsToImages(urls) {
  const results = await Promise.allSettled(urls.map(url => {
    return loadImage(url);
  }));
  return results;
}

/** Returns a promise that you can .then and do a callback
 * 
 * @param {Array<String>} urls 
 * @returns 
 */
async function AsyncUrlsToPixelArrays(urls) {
  const results = await Promise.allSettled(urls.map(url => {
    console.log(url);
    return loadImage(url).then(value => ImgToPixelArray(value));
  }));
  return results;
}

/**
 * 
 * @param {Array<string>} urls 
 * @param {function} finalCallback
 */
async function AsyncUrlsToPixelArrayCallback(urls, finalCallbackTemplate) {
  try {
    const pixelArrayList = [];
    let finalCallback = () => {
      finalCallbackTemplate(pixelArrayList);
    };
    const locks = new Locks(urls.length, finalCallback);
    let callbackTemplate = (i, pixelArray) => {
      locks.unlock(i);
      pixelArrayList[i] = pixelArray;
      console.log(pixelArrayList[i]);
      console.log(pixelArray.getColorValue(3, 3));
    };
    for (let i = 0; i < urls.length; i += 1) {
      pixelArrayList.push(null);
      let curCallback = pixelArray => {
        callbackTemplate(i, pixelArray);
      };
      AsyncUrlToPixelArrayCallback(urls[i], curCallback);
    }
  } catch (err) {
    console.log(err);
  }
}

/** Creates a canvas and puts a PixelArray there.
 * 
 * @param {PixelArray} pixelArray 
 * @param {Int} zoom 
 * @returns {HTMLCanvasElement}
 */
function PixelArrayToCanvas(pixelArray, zoom = 1) {
  /** @type {HTMLCanvasElement} */
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const imgData = new ImageData(pixelArray.arr, pixelArray.width);

  //console.log(img.width);
  canvas.width = pixelArray.width * zoom;
  canvas.height = pixelArray.height * zoom;
  context.putImageData(imgData, 0, 0);
  return canvas;
}

//#region old
class Locks {
  constructor(numLocks, callback) {
    /**
     * 
     */
    this._unlocked = [];
    for (let i = 0; i < numLocks; i += 1) {
      this._unlocked.push(false);
    }
    this.callback = callback;
  }
  unlock(index) {
    this._unlocked[index] = true;
    if (this._unlocked.includes(false)) {
      return;
    } else {
      this.callback();
    }
  }
}
//#endregion

var PixelArrayLoading = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadImage: loadImage,
  AsyncUrlToPixelArray: AsyncUrlToPixelArray,
  AsyncUrlToPixelArrayCallback: AsyncUrlToPixelArrayCallback,
  ImgToPixelArray: ImgToPixelArray,
  AsyncUrlsToImages: AsyncUrlsToImages,
  AsyncUrlsToPixelArrays: AsyncUrlsToPixelArrays,
  AsyncUrlsToPixelArrayCallback: AsyncUrlsToPixelArrayCallback,
  PixelArrayToCanvas: PixelArrayToCanvas,
  Locks: Locks
});

function EnlargeCanvasStretch(pixelArray, left, right, bottom, top) {}

/**
 * 
 * @param {PixelArray} pixelArray 
 * @param {*} left 
 * @param {*} right 
 * @param {*} bottom 
 * @param {*} top 
 * @return {PixelArray}
 */
function EnlargeCanvasEmpty(pixelArray, left, right, bottom, top) {
  const width = pixelArray.width + left + right;
  const height = pixelArray.height + bottom + top;
  const newPixelArray = new PixelArray(null, width, height);
  for (let i = 0; i < pixelArray.width; i += 1) {
    for (let j = 0; j < pixelArray.height; j += 1) {
      const color = pixelArray.getColorValue(i, j);
      newPixelArray.setColorValue(i, j, color);
    }
  }
  return newPixelArrays;
}

var PixelArrayResizing = /*#__PURE__*/Object.freeze({
  __proto__: null,
  EnlargeCanvasStretch: EnlargeCanvasStretch,
  EnlargeCanvasEmpty: EnlargeCanvasEmpty
});

/**
 * 
 * @param {Array<PixelArray>} listPixelArrays 
 */
function GetDuplicateIslands(listPixelArrays) {
  const sizes = [];
  const sets = [];
  s;
  const firstPixelArray = listPixelArrays[0];
  sizes.push({
    width: firstPixelArray.width,
    height: firstPixelArray.height
  });
  sets.push([firstPixelArray]);
  for (let i = 1; i < listPixelArrays.length; i += 1) {
    const curPixelArray = listPixelArrays[i];
    let added = false;
    for (let j = 0; j < sizes.length; j += 1) {
      const curSize = sizes[j];
      if (curSize.width === curPixelArray.width && curSize.height === curPixelArray.height) {
        added = true;
        sets[j].push(curPixelArray);
        break;
      }
    }
    if (!added) {
      sizes.push({
        width: curPixelArray.width,
        height: curPixelArray.height
      });
      sets.push([curPixelArray]);
    }
  }
  return sets;
}

/**
 * 
 * @param {PixelArray} pixelArray 
 * @returns {Array<Int>} color
 */
function GetColorFromIslandPArray(pixelArray) {
  //
  for (let i = 0; i < pixelArray.width; i += 1) {
    for (let j = 0; j < pixelArray.height; j += 1) {
      //
      const color = pixelArray.getColorValue(i, j);
      if (color[3] >= 1) {
        return color;
      }
    }
  }
  return null;
}

/**Returns an array of arrays of int
 * 
 * @param {PixelArray} pixelArray 
 * @return {Array<Array<Int>>}
 */
function PixelArrayToIslands(pixelArray, anyColor = false, testAlpha = true, minAlpha = 1) {
  const width = pixelArray.width;
  const height = pixelArray.height;
  console.log(width + ', ' + height);
  const visitedArray = new Uint8ClampedArray(width * height);
  const islands = [];
  //let curIsland = null;
  //let placesToVisit = [];

  for (let i = 0; i < pixelArray.width; i += 1) {
    for (let j = 0; j < pixelArray.height; j += 1) {
      if (visitedArray[i + j * width] !== 0) {
        continue;
      }
      //console.log(pixelArray.getColorValue(i, j)[3]);

      if (pixelArray.getColorValue(i, j)[3] >= minAlpha) {
        const curIsland = FloodFillSelect(pixelArray, i, j, visitedArray, anyColor = false, testAlpha = true);
        visitedArray[i + j * width] = 1;
        islands.push(curIsland);
      }
    }
  }
  return islands;
}

/**
 * 
 * @param {Array<Array<Int>>} islandArray 
 * @return {Array<Int>} returns bounds [xMin, xMax, yMin, yMax]
 */
function GetIslandBounds(islandArray) {
  let [xMin, xMax, yMin, yMax] = [100000, -100000, 100000, -100000];
  for (let i = 0; i < islandArray.length; i += 1) {
    const x = islandArray[i][0];
    const y = islandArray[i][1];
    if (x < xMin) {
      xMin = x;
    }
    if (x > xMax) {
      xMax = x;
    }
    if (y < yMin) {
      yMin = y;
    }
    if (y > yMax) {
      yMax = y;
    }
  }
  return [xMin, xMax, yMin, yMax];
}

/** Returns an array of pixelArrays
 * 
 * @param {PixelArray} pixelArray 
 * @param {Boolean} anyColor 
 * @param {Boolean} testAlpha 
 * @param {Int} minAlpha 
 */
function PixelArrayToPArrayIslands(pixelArray, anyColor = false, testAlpha = true, minAlpha = 1) {
  const islands = PixelArrayToIslands(pixelArray, anyColor = false, testAlpha = true, minAlpha = 1);
  console.log(islands.length);
  const island0 = islands[0];
  console.log(island0);
  //

  /**@type{Array<PixelArray>} */
  const pixelArrays = [];
  for (let i = 0; i < islands.length; i += 1) {
    const bounds = GetIslandBounds(islands[i]);
    console.log(bounds);
    const xOffset = bounds[0];
    const yOffset = bounds[2];
    const width = bounds[1] - bounds[0] + 1; //add 1 because the bounds are inclusive
    const height = bounds[3] - bounds[2] + 1; //add 1 because the bounds are inclusive

    const curPixelArray = new PixelArray(null, width, height);
    let oldX = -1;
    let oldY = -1;
    let curX = -1;
    let curY = -1;
    let curColor = null;
    let newColor = null;
    for (let j = 0; j < islands[i].length; j += 1) {
      //console.log(j);
      curX = islands[i][j][0] - xOffset;
      curY = islands[i][j][1] - yOffset;
      oldX = islands[i][j][0];
      oldY = islands[i][j][1];

      //console.log(curX);
      curColor = pixelArray.getColorValue(oldX, oldY);
      //console.log(curColor);

      newColor = [curColor[0], curColor[1], curColor[2], curColor[3]];
      curPixelArray.xPos = xOffset;
      curPixelArray.yPos = yOffset;

      //
      curPixelArray.setColorValue(curX, curY, newColor);
    }
    pixelArrays.push(curPixelArray);
  }
  return pixelArrays;
}

/**
 * 
 * @param {PixelArray} pixelArray 
 * @param {Int} x 
 * @param {Int} y 
 * @param {Array<Int>} visitedArray 
 * @param {*} anyColor 
 * @param {*} testAlpha 
 * @param {*} minAlpha 
 * @param {Boolean} noWhite 
 * @returns 
 */
function FloodFillSelect(pixelArray, x, y, visitedArray = null, anyColor = false, testAlpha = false, minAlpha = 1, noWhite = false) {
  /**@type{Array<Int>} */
  const color = pixelArray.getColorValue(x, y);

  //console.log(color);

  // #region funcs
  let func = curColor => {
    if (curColor[0] !== color[0]) {
      return false;
    }
    if (curColor[1] !== color[1]) {
      return false;
    }
    if (curColor[2] !== color[2]) {
      return false;
    }
    if (testAlpha) {
      if (curColor[3] !== color[3]) {
        return false;
      }
    }
    return true;
  };
  if (anyColor) {
    func = curColor => {
      if (curColor[3] >= minAlpha) {
        return true;
      }
      return false;
    };
  }
  //#endregion

  const getIndex = (x, y, width) => {
    return x + y * width;
  };
  const width = pixelArray.width;
  const height = pixelArray.height;
  let actualVisitedArray = visitedArray;
  if (actualVisitedArray === null) {
    console.log('ava is null!');
    for (let i = 0; i < width * height; i += 1) {
      actualVisitedArray.push(0);
    }
  }
  const placesToVisit = [[x, y]];
  const island = [[x, y]];
  let iters = 0;
  while (placesToVisit.length !== 0 && iters < 100000000) {
    let curPlace = placesToVisit[0];
    placesToVisit.splice(0, 1);
    let curX = curPlace[0];
    let curY = curPlace[1];
    if (actualVisitedArray[getIndex(curX, curY, width)] === 1) {
      continue;
    }
    actualVisitedArray[getIndex(curX, curY, width)] = 1;
    //console.log(visitedArray);
    for (let a = -1; a < 2; a += 1) {
      let visitX = curX + a;
      if (visitX < 0 || visitX >= width) {
        continue;
      }
      for (let b = -1; b < 2; b += 1) {
        let visitY = curY + b;
        if (visitY < 0 || visitY >= height) {
          continue;
        }
        const nextColor = pixelArray.getColorValue(visitX, visitY);
        //actualVisitedArray[getIndex(visitX, visitY, width)] === 0
        {
          if (func(nextColor)) {
            island.push([visitX, visitY]);
            placesToVisit.push([visitX, visitY]);
          }
        }
      }
    }
    iters += 1;
  }
  //console.log(iters);
  return island;
}

/**
 * 
 * @param {PixelArray} pixelArray 
 * @param {Array<Array<Int>>} indices
 * @param {Array<Int>} color
 */
function FloodFill(pixelArray, indices, color) {
  for (let i = 0; i < indices.length; i += 1) {
    const [x, y] = [...indices[i]];
    pixelArray.setColorValue(x, y, color);
  }
}

/**
 * 
 * @param {PixelArray} pixelArray 
 * @param {Array<Array<Int>>} indices 
 * @param {Array<Int>} color 
 * @returns 
 */
function FloodFillNew(pixelArray, indices, color) {
  const newPixelArray = PixelArray.CopyPixelFactory(pixelArray);
  FloodFill(newPixelArray, indices, color);
  return newPixelArray;
}

var Islands = /*#__PURE__*/Object.freeze({
  __proto__: null,
  GetDuplicateIslands: GetDuplicateIslands,
  GetColorFromIslandPArray: GetColorFromIslandPArray,
  PixelArrayToIslands: PixelArrayToIslands,
  GetIslandBounds: GetIslandBounds,
  PixelArrayToPArrayIslands: PixelArrayToPArrayIslands,
  FloodFillSelect: FloodFillSelect,
  FloodFill: FloodFill,
  FloodFillNew: FloodFillNew
});

export { BlendModes as Blendmodes, Composition, HSVClasses, HSVUtils, Islands, OldComposition, PixelArray$1 as PixelArray, PixelArrayLoading, PixelArrayResizing };
//# sourceMappingURL=index.js.map
