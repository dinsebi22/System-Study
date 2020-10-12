//////////////////////////////////////////////////////////////////////////////////

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(otherVector) {
    this.x = this.x + otherVector.x;
    this.y = this.y + otherVector.y;
    return this;
  }

  subtract(otherVector) {
    this.x = this.x - otherVector.x;
    this.y = this.y - otherVector.y;
    return this;
  }

  divideBy(scalar) {
    this.x = this.x / scalar;
    this.y = this.y / scalar;
    return this;
  }

  distance(otherVector) {
    let copy = new Vector(this.x, this.y);
    copy.subtract(otherVector);
    return copy.magnitude();
  }

  multiplyBy(scalar) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
    return this;
  }

  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }

  magnitude() {
    return Math.sqrt(this.magnitudeSquared());
  }

  setMagnitude(multiplier) {
    this.normalize();
    this.multiplyBy(multiplier);
  }

  normalize() {
    var magnitude = this.magnitude();
    if (magnitude !== 0) {
      this.divideBy(magnitude);
    }
  }

  limit(value) {
    let magnitudeSq = this.magnitudeSquared();
    if (magnitudeSq > value * value) {
      this.divideBy(Math.sqrt(magnitudeSq));
      this.multiplyBy(value);
    }
  }

  angle() {
    return Math.atan(this.y / this.y);
  }
}

////////////////////////////////////////////////////////////////////////////////
