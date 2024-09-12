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

export { PixelArray };
