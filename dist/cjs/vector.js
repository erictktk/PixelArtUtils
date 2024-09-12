'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distance(otherVec) {
    var difVec = Vector.subtract(this, otherVec);
    return difVec.length();
  }
  length() {
    var x = this.x;
    var y = this.y;
    return (x ** 2 + y ** 2) ** 0.5;
  }
  toStr() {
    return "x = " + this.x + " y = " + this.y;
  }
  normalized() {
    var x = this.x;
    var y = this.y;
    var length = (x ** 2 + y ** 2) ** 0.5;
    return new Vector(x / length, y / length);
  }
  static scalar(a, b) {
    return new Vector(a * b.x, a * b.y);
  }
  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  static add(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
  }
  static subtract(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
  }
}

exports.Vector = Vector;
