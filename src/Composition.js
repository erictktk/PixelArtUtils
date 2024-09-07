import { getColorValue, setColorValue } from './PixelUtils.js';
//import * as Utils from './Utils.js';
import * as BlendModes from './BlendModes.js';
import {PixelArray} from "./PixelArray.js";
import * as PixelUtils from "./PixelUtils.js";
//import * as BlendMaskModes from "./BlendMaskModes.js";


  class BoundsHelperObject{
    constructor(startI, startJ, endX, endY, length, height){
      this.startI = startI;
      this.startJ = startJ;
      this.endX = endX;
      this.endY = endY;
      this.length = length;
      this.height = height;
    }
  }
  
  function getBoundsForComp(pArray1, pArray2){
    var x1 = pArray1.xPos;
    var x2 = pArray2.xPos;
    var y1 = pArray1.yPos;
    var y2 = pArray2.yPos;
    var xOffset = x1-x2;
    var yOffset = y1-y2;
    var width1 = pArray1.width;
    var height1 = pArray1.height;
    var width2 = pArray2.width;
    var height2 = pArray2.height;
    
    var startI = Math.max(0, x2-x1);
    var startJ = Math.max(0, y2-y1);
    var endX = Math.min(x1+pArray1.width, x2+pArray2.width);
    var length = Math.max(0, x1-endX);
    var endY = Math.min(y1+pArray1.height, y2+pArray2.height);
    var height = Math.max(0, y1-endY);
    
    return new BoundsHelperObject(startI, startJ, endX, endY, length, height);
  }
  

  /**
   * 
   * @param {PixelArray} pArray 
   * @param {int} xOffset 
   * @param {int} yOffset 
   * @returns {PixelArray}
   */
  export function Offset(pArray, xOffset, yOffset){
    const offsetPArray = new PixelArray(null, pArray.width, pArray.height);
    let width = pArray.width;
    let height = pArray.height;
    let newArr = offsetPArray.array;
    let oldArr = pArray.array;
    let rgba = [];
    for(let i = 0; i < pArray.width; i += 1){
      for(let j = 0; j < pArray.height; j += 1){
        rgba = PixelUtils.getColorValue((i+xOffset)%width, (j+yOffset)%height, width, oldArr);
        PixelUtils.setColorValue(i, j, width, newArr, rgba);
      }
    }

    return offsetPArray;
  }
  
  function scaleImageData(imageData, scale) {
      var scaled = ctx.createImageData(imageData.width * scale, imageData.height * scale);
      var subLine = ctx.createImageData(scale, 1).data
      for (var row = 0; row < imageData.height; row++) {
          for (var col = 0; col < imageData.width; col++) {
              var sourcePixel = imageData.data.subarray(
                  (row * imageData.width + col) * 4,
                  (row * imageData.width + col) * 4 + 4
              );
              for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x*4)
              for (var y = 0; y < scale; y++) {
                  var destRow = row * scale + y;
                  var destCol = col * scale;
                  scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4)
              }
          }
      }
  
      return scaled;
  }

  function blendColorTransform(pArray1, pArray2, xMove=0, yMove=0, blendOp=null, newArray=null){
    pArray2.xPos = pArray2.xPos + xMove;
    pArray2.yPos = pArray2.yPos + yMove;
    var theArray = blendColorLayers(pArray1, pArray2, blendOp, newArray);
    pArray2.xPos = pArray2.xPos - xMove;
    pArray2.yPos = pArray2.yPos - yMove;
    return theArray;
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
  export function blendColorLayersPArray(pArray1, pArray2, blendOp=null, newArray=null, xMove=0, yMove=0){
    const resultArray = blendColorLayers(pArray1, pArray2, blendOp, newArray, xMove, yMove)
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
  function blendColorLayers(pArray1, pArray2, blendOp=null, newArray=null, xMove=0, yMove=0, mask=null){
    pArray2.xPos = pArray2.xPos + xMove;
    pArray2.yPos = pArray2.yPos + yMove;

    var x1 = pArray1.xPos;
    var x2 = pArray2.xPos;
    var y1 = pArray1.yPos;
    var y2 = pArray2.yPos;
    var xOffset = x1-x2;
    var yOffset = y1-y2;
    var width1 = pArray1.width;
    var height1 = pArray1.height;
    var width2 = pArray2.width;
    var height2 = pArray2.height;
    
    var startI = Math.max(0, x2-x1);
    var startJ = Math.max(0, y2-y1);
    var endX = Math.min(x1+pArray1.width, x2+pArray2.width);
    var length = Math.max(0, endX-startI);
    var endY = Math.min(y1+pArray1.height, y2+pArray2.height);
    var height = Math.max(0, endY-startJ);
    
    if (blendOp === null){
      blendOp = (pixel1, pixel2) => {return BlendModes.Over(pixel1, pixel2);};
    }
    else if (typeof(blendOp) === "string"){
      blendOp = blendOp.toLowerCase();
      if (blendOp === "overlay"){
        blendOp = (p1, p2) => {return BlendModes.Overlay(p1, p2);};
      }
      else if(blendOp === 'over' || blendOp === 'normal'){
        blendOp = (p1, p2) => {return BlendModes.Over(p1, p2);};
      }
      else if (blendOp === 'screen'){
        blendOp = (p1, p2) => {return BlendModes.Screen(p1, p2);};
      }
      else if (blendOp === 'multiply'){
        blendOp = (p1, p2) => {return BlendModes.Multiply(p1, p2);};
      }
    }

    //console.log(blendOp);
    
    let theArray = null;
    if(newArray === null){
      theArray = new Uint8ClampedArray(pArray1.arr);
    }
    else{
      theArray = newArray;
    }
  
    var pixel1 = null;
    var pixel2 = null;
    var newValue = null;
    
    var newR = 0;
    var newG = 0;
    var newB = 0;
    var newA = 0;
    var coeff = 0;
    var newColor = [];
    var otherCoeff = 0;

    /*
    console.log('startI = ' + startI);
    console.log('startJ = ' + startJ);
    console.log('height = ' + height);
    console.log('length = ' + length);
    */
    for(let i = startI; i < startI+length; i += 1 ){
      for(let j = startJ; j < startJ+height; j += 1){
        pixel1 = getColorValue(i, j, width1, theArray);
        pixel2 = getColorValue(i+xOffset, j+yOffset, width2, pArray2.arr);
        
        if (blendOp === null){
          if (pixel2[3] >= 254){
            setColorValue(i, j, width1, theArray, pixel2);
          }
          else{
            newColor = blendOp(pixel1, pixel2);
            setColorValue(i, j, width1, theArray, newColor);
          }
        }
        else{
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
export function MaskPArray(pArray, maskArray, maskFunc){
  if (!maskFunc){
    maskFunc = BlendMaskModes.AlphaMaskMode;
  }

  const newPArray = new PixelArray(null, pArray.width, pArray.height);

  return blendColorLayersPArray(pArray, maskArray, maskFunc);
}

//#region Interop
function imgToImgDataWrapper(img, imageDataW){
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  
  try {
    context.drawImage(img, 0, 0 );
    imageDataW.imageData = context.getImageData(0, 0, img.width, img.height);
  }
  catch (err){
    console.log("error!");
    console.log(err);
  }
}

function imgToImgData(img, imageData=null){
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0 );
  try {
    return context.getImageData(0, 0, img.width, img.height);
  }
  catch (err){
    console.log("error!");
    console.log(err);
  }
}

//#endregion

export function AlphaCompositionMask(pixelArray, alphaArray, minAlpha=254){
  for(let i = 0; i < pixelArray.width; i += 1){
    for(let j = 0; j < pixelArray.height; j += 1){
      if (alphaArray.getColorValue(i, j)[3] <= minAlpha){
        pixelArray.setColorValue(i, j, [0, 0, 0, 0])
      }
    }
  }
}

export function AlphaCompositionMaskNew(pixelArray, alphaArray, minAlpha=254){
  let resultArray = new PixelArray(null, pixelArray.width, pixelArray.height);

  for(let i = 0; i < pixelArray.width; i += 1){
    for(let j = 0; j < pixelArray.height; j += 1){
      if (alphaArray.getColorValue(i, j)[3] >= minAlpha){
        resultArray.setColorValue(i, j, pixelArray.getColorValue(i, j));
      }
    }
  }
  return resultArray;
}

export {imgToImgDataWrapper, imgToImgData, scaleImageData, blendColorLayers};