'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.ColorBurn = ColorBurn;
exports.ColorDodge = ColorDodge;
exports.Darken = Darken;
exports.Difference = Difference;
exports.HardLight = HardLight;
exports.Lighten = Lighten;
exports.Multiply = Multiply;
exports.Over = Over;
exports.OverCustomAlpha = OverCustomAlpha;
exports.OverCustomAlphaExport = OverCustomAlphaExport;
exports.Overlay = Overlay;
exports.PinLight = PinLight;
exports.Screen = Screen;
exports.SoftLight = SoftLight;
