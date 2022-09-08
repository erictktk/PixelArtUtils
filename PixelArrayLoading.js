import { PixelArray } from "./PixelArray.js";

/** Base function for loading an image from a url, returns a promise
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
    //console.log(image.src);
    //console.log(image);

  });
}

/** Async code for loading an image from a url
 * 
 * @param {String} url 
 * @param {Function} callback 
 * @param {*} element 
 * @returns {PixelArray}
 */
export async function AsyncUrlToPixelArray(url, callback, element=null){
  try{
    let image = await loadImage(url);
    console.log(image.width);
    return ImgToPixelArray(image);
  }
  catch(err){
    console.log("couldn't load image async!");
  }
}

/**Async function for loading an image from a url
 * 
 * @param {String} url 
 * @param {Function} callback 
 */
export async function AsyncUrlToPixelArrayCallback(url, callback){
  try{
    let image = await loadImage(url);
    const pixelArray = ImgToPixelArray(image);
    if (callback){
      callback(pixelArray);
    }
  }
  catch(err){
    console.log(err);
  }
}
  
/** Takes an HTMLImageElement then converts it to pixelArray 
 * 
 * @param {HTMLImageElement} img 
 * @param {ImageData} imageData 
 * @param {*} elementName 
 * @returns {PixelArray}
 */ 
export function ImgToPixelArray(img, imageData=null, elementName=null){
  try {
      /** @type {HTMLCanvasElement} */
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      document.body.append(canvas);
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
 * @param {*} urls 
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