'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//#region OffsetUtils
function moveRightProtected(index, width, height) {
  var next = index + 1;
  if (next >= width) {
    return null;
  }
  return index;
}
function moveLeftProtected(index, width, height) {
  if (index - 1 < 0) {
    return null;
  }
  return index - 1;
}
function moveDown(index, imageDataWidth) {
  return index += imageDataWidth * 4;
}
function moveUp(index, imageDataWidth) {
  return index -= imageDataWidth * 4;
}
function moveLeft(index, imageDataWidth) {
  return index -= 4;
}
function moveRight(index, imageDataWidth) {
  return index += 4;
}
function moveDiagUpLeft(index, imageDataWidth) {
  return index -= imageDataWidth * 4 - 4;
}
function moveDiagUpRight(index, imageDataWidth) {
  return index -= imageDataWidth * 4 + 4;
}
function moveDiagDownRight(index, imageDataWidth) {
  return index += imageDataWidth * 4 + 4;
}
function moveDiagDownLeft(index, imageDataWidth) {
  return index += imageDataWidth * 4 - 4;
}
//#endregion

//#region Single
function getSingleIndex(x, y, imagedataWidth) {
  return x + y * imagedataWidth;
}
function getSingleValue(x, y, imagedataWidth, array) {
  return array[x + y * imagedataWidth];
}
function setSingleValue(x, y, width, array, value) {
  array[getSingleIndex(x, y, width)] = value;
}

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

/** Sets color value in a Uint8Array, checks for width and height
 * 
 * @param {Uint8Array} array 
 * @param {Array<int>} value 
 */
function setColorValueProtected(x, y, width, height, array, value) {
  if (x >= width || x < 0) {
    return;
  } else if (y >= height || y < 0) {
    return;
  }
  setColorValue(x, y, width, array, value);
}
function getColorIndex(x, y, imagedataWidth) {
  return getIndex(x, y, imagedataWidth);
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

/**
* @param {Uint8ClampedArray} array
*/
function setPixelXOffset(x, y, offset, color, imagedataWidth, imagedataHeight, array, testForAlpha = false) {
  let newX = x + offset;
  if (newX >= imagedataWidth) {
    return null;
  }
  if (newX < 0) {
    return null;
  }
  let index = getIndex(newX, y);
  if (testForAlpha) {
    if (array[index + 3] = 0) {
      return null;
    }
  }
  array[index + 0] = color[0];
  array[index + 1] = color[1];
  array[index + 2] = color[2];
  array[index + 3] = color[3];
}
//#endregion

exports.getColorIndex = getColorIndex;
exports.getColorValue = getColorValue;
exports.getIndex = getIndex;
exports.getSingleIndex = getSingleIndex;
exports.getSingleValue = getSingleValue;
exports.moveDiagDownLeft = moveDiagDownLeft;
exports.moveDiagDownRight = moveDiagDownRight;
exports.moveDiagUpLeft = moveDiagUpLeft;
exports.moveDiagUpRight = moveDiagUpRight;
exports.moveDown = moveDown;
exports.moveLeft = moveLeft;
exports.moveLeftProtected = moveLeftProtected;
exports.moveRight = moveRight;
exports.moveRightProtected = moveRightProtected;
exports.moveUp = moveUp;
exports.setColorValue = setColorValue;
exports.setColorValueProtected = setColorValueProtected;
exports.setPixelXOffset = setPixelXOffset;
exports.setSingleValue = setSingleValue;
