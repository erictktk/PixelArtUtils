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

export { HSVMod, HSVModPixelArray, HSVModSinglePixel, HSVSaturate, hsv2rgb, hsv_to_rgb, rgb_to_hsv };
