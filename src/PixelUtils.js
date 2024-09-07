//#region OffsetUtils
export function moveRightProtected(index, width, height){
    var next = index + 1;
    if (next >= width){
      return null;
    }
    
    return index
  }
  
export function moveLeftProtected(index, width, height){
  if (index - 1 < 0){
    return null;
  }
  return index-1;
}

export function moveDown(index, imageDataWidth){
  return index += imageDataWidth*4;
}

export function moveUp(index, imageDataWidth){
  return index -= imageDataWidth*4;
}

export function moveLeft(index, imageDataWidth){
  return index -=4;
}

export function moveRight(index, imageDataWidth){
  return index += 4;
}

export function moveDiagUpLeft(index, imageDataWidth){
  return index -= (imageDataWidth*4 - 4);
}

export function moveDiagUpRight(index, imageDataWidth){
  return index -= (imageDataWidth*4 + 4);
}

export function moveDiagDownRight(index, imageDataWidth){
  return index += imageDataWidth*4 + 4;
}

export function moveDiagDownLeft(index, imageDataWidth){
  return index += imageDataWidth*4 - 4;
}
//#endregion


//#region Single
export function getSingleIndex(x, y, imagedataWidth){
  return (x+y*imagedataWidth);
}

export  function getSingleValue(x, y, imagedataWidth, array){
  return array[x+y*imagedataWidth];
}

export  function setSingleValue(x, y, width, array, value){
  array[getSingleIndex(x, y, width)] = value;
}

//#endregion


//#region Color
export function getIndex(x, y, imagedataWidth){
  return (x + y * imagedataWidth) * 4;
}

/** Sets color value in a Uint8Array
 * 
 * @param {Uint8Array} array 
 * @param {Array<int>} value 
 */
export function setColorValue(x, y, width, array, value){
  var index = getIndex(x, y, width);
  array[index+0] = value[0];
  array[index+1] = value[1];
  array[index+2] = value[2];
  array[index+3] = value[3];
}

/** Sets color value in a Uint8Array, checks for width and height
 * 
 * @param {Uint8Array} array 
 * @param {Array<int>} value 
 */
export function setColorValueProtected(x, y, width, height, array, value){
  if( x >= width || x < 0){
    return;
  }
  else if (y >= height || y < 0){
    return;
  }
  setColorValue(x, y, width, array, value);
}

export function getColorIndex(x, y, imagedataWidth){
  return getIndex(x, y, imagedataWidth);
}

/**
 * 
 * @param {Uint8ClampedArray} array 
 * @returns 
 */
export function getColorValue(x, y, width, array){
  var index = getIndex(x, y, width);
  return [array[index], array[index+1], array[index+2], array[index+3]];
}

/**
* @param {Uint8ClampedArray} array
*/
export function setPixelXOffset(x, y, offset, color, imagedataWidth, imagedataHeight, array, testForAlpha=false){
  let newX = x+offset;
  if (newX >= imagedataWidth){
    return null;
  }
  if (newX < 0){
    return null;
  }
  
  let index = getIndex(newX, y);
  
  if (testForAlpha){
    if (array[index+3] = 0){
      return null;
    }
  }
  
  array[index+0] = color[0];
  array[index+1] = color[1];
  array[index+2] = color[2];
  array[index+3] = color[3];
  
}
//#endregion