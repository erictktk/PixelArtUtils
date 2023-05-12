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
  return [
    Math.round(paramColor[0] * 255),
    Math.round(paramColor[1] * 255),
    Math.round(paramColor[2] * 255),
    Math.round(paramColor[3] * 255)
  ];
}

/** Default blend mode
 * 
 * @param {Array<Number>} color1 
 * @param {Array<Number>} color2 
 * @returns {Array<Number>}
 */
export function Over(color1, color2) {
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
export function OverCustomAlpha(color1, color2, customAlphaMultiplier = 0.5) {
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


export function OverCustomAlphaExport(customAlphaMultiplier) {
  return (a, b) => OverCustomAlpha(a, b, customAlphaMultiplier);
}


/** Overlay blend mode
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
export function Overlay(color1, color2) {
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
    return Over(color1, color32);
  }
}


/** Screen overlay mode
 * 
 * @param {Array<Int>} color1 
 * @param {Array<Int>} color2 
 * @returns {Array<Int>}
 */
export function Screen(color1, color2) {
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
export function Multiply(color1, color2) {
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
