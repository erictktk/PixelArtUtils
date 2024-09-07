export class Vector {
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

function DistFromLine(a, b, c) {
  var closestPoint = ClosestPointOnLine(a, b, c);
  let difVec = Vector.subtract(c, closestPoint);

  return difVec.length();
}

function ClosestPointOnLine(a, b, c) {
  var difVec = Vector.subtract(b, a);
  var n = difVec.normalized();

  var dot = Vector.subtract(c, a);
  dot = Vector.dot(dot, n);

  var posPart1 = a;
  var posPart2 = Vector.scalar(dot, n);
  var pos = Vector.add(posPart1, posPart2);

  if (dot > difVec.length()) {
    return b;
  } else if (dot <= 0) {
    return a;
  } else {
    return pos;
  }
}
