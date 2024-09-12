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

export { AsyncUrlToPixelArray, AsyncUrlToPixelArrayCallback, AsyncUrlsToImages, AsyncUrlsToPixelArrayCallback, AsyncUrlsToPixelArrays, ImgToPixelArray, Locks, PixelArrayToCanvas, loadImage };
