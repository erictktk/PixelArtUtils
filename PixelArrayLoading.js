import { PixelArray } from "./PixelArray.js";

/** Base function for loading an image from a url, returns a promise.
 * 
 * @param {String} url 
 * @returns {Promise}
 */
export function loadImage(url){
  return new Promise( (resolve, reject) =>{
    const image = new Image();
    
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
export async function AsyncUrlToPixelArray(url, setAnonymous=false){
  try{
    let image = await loadImage(url);
    console.log(image.width);
    return ImgToPixelArray(image, null, null, setAnonymous);
  }
  catch(err){
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
export async function AsyncUrlToPixelArrayCallback(url, callback=null, returnFromCallback=false){
  try{
    let image = await loadImage(url);
    const pixelArray = ImgToPixelArray(image);
    if (callback){
      const result = callback(pixelArray);
      if (returnFromCallback){
        return result;
      }
      else{
        return pixelArray;
      }
    }
    else{
      return pixelArray;
    }
  }
  catch(err){
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
export function ImgToPixelArray(img, imageData=null, elementName=null, setAnonymous=false){
  try {
      /** @type {HTMLCanvasElement} */
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');

      if (setAnonymous){
        img.crossOrigin = `Anonymous`;
      }

      //document.body.append(canvas);
      if (elementName){
        document.getElementById(elementName).append(canvas);
      }
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0 );
      const imgData = context.getImageData(0, 0, img.width, img.height);
      const pixelArray = new PixelArray(imgData.data, img.width);
      //canvas.remove();
      return pixelArray;
  }
  catch (err){
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
export async function AsyncUrlsToImages(urls){
  const results = await Promise.allSettled( urls.map( url => {
    return loadImage(url); 
  }));

  return results;
}

/** Returns a promise that you can .then and do a callback
 * 
 * @param {Array<String>} urls 
 * @returns 
 */
 export async function AsyncUrlsToPixelArrays(urls){
  const results = await Promise.allSettled( urls.map( url => {
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
export async function AsyncUrlsToPixelArrayCallback(urls, finalCallbackTemplate){
    try{
        
        const pixelArrayList = [];

        let finalCallback = () => {
            finalCallbackTemplate(pixelArrayList);
        }

        const locks = new Locks(urls.length, finalCallback);

        let callbackTemplate = (i, pixelArray) => {
            locks.unlock(i);
            pixelArrayList[i] = pixelArray;
            console.log(pixelArrayList[i]);
            console.log(pixelArray.getColorValue(3, 3));
        }

        for(let i = 0; i < urls.length; i += 1){
            pixelArrayList.push(null);

            let curCallback = (pixelArray) => {
                callbackTemplate(i, pixelArray);
            }

            AsyncUrlToPixelArrayCallback(urls[i], curCallback)
        }
    } 
    catch(err){
        console.log(err);
    }
}


/** Creates a canvas and puts a PixelArray there.
 * 
 * @param {PixelArray} pixelArray 
 * @param {Int} zoom 
 * @returns {HTMLCanvasElement}
 */
export function PixelArrayToCanvas(pixelArray, zoom=1){
  /** @type {HTMLCanvasElement} */
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  const imgData = new ImageData(pixelArray.arr, pixelArray.width);

  //console.log(img.width);
  canvas.width = pixelArray.width*zoom;
  canvas.height = pixelArray.height*zoom;
  context.putImageData(imgData, 0, 0);

  return canvas;
}


//#region old
export class Locks{
  constructor(numLocks, callback){
      /**
       * 
       */
      this._unlocked = [];
      for(let i = 0; i < numLocks; i += 1){
        this._unlocked.push(false);
      }
      this.callback = callback;
  }

  unlock(index){
      this._unlocked[index] = true;
      if (this._unlocked.includes(false)){
      return;
      }
      else{
          this.callback();
      }
  }
}
//#endregion