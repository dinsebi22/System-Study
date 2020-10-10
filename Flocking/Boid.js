class Boid {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(
      pickBetweenTwoValues(-1 * this.random(), 1 * this.random()),
      pickBetweenTwoValues(-1 * this.random(), 1 * this.random())
    );
    this.velocity.setMagnitude(pickRandomBetweenTwoValues(11, 22));
    this.acceleration = new Vector(0, 0);
    this.maxForce = 1;
    this.maxSpeed = 3;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }

  random() {
    return Math.random();
  }

  move() {
    if (this.position.x > innerWidth) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = window.innerWidth;
    }

    if (this.position.y > innerHeight) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = window.innerHeight;
    }

    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.multiplyBy(0);
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  align(boids) {
    let perceptionRadius = 100;
    let totalCount = 0;
    let steering = new Vector(0, 0);

    for (let other of boids) {
      let distance = this.position.distance(other.position);

      if (other != this && distance < perceptionRadius) {
        steering.add(other.velocity);
        totalCount++;
      }
    }
    if (totalCount > 0) {
      steering.divideBy(totalCount);
      steering.setMagnitude(this.maxSpeed);
      steering.subtract(this.velocity);
      steering.limit(this.maxForce);
      return steering;
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 100;
    let totalCount = 0;
    let steering = new Vector(0, 0);

    for (let other of boids) {
      let distance = this.position.distance(other.position);

      if (other != this && distance < perceptionRadius) {
        steering.add(other.position);
        totalCount++;
      }
    }
    if (totalCount > 0) {
      steering.divideBy(totalCount);
      steering.subtract(this.position);
      steering.setMagnitude(this.maxSpeed);
      steering.subtract(this.velocity);
      steering.limit(this.maxForce);

      return steering;
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 100;
    let totalCount = 0;
    let steering = new Vector(0, 0);

    for (let other of boids) {
      let distance = this.position.distance(other.position);

      if (other != this && distance < perceptionRadius) {
        let diference = new Vector(
          this.position.x - other.position.x,
          this.position.y - other.position.y
        );
        diference.divideBy(distance);
        steering.add(diference);
        totalCount++;
      }
    }
    if (totalCount > 0) {
      steering.divideBy(totalCount);
      steering.setMagnitude(this.maxSpeed);
      steering.subtract(this.velocity);
      steering.limit(this.maxForce);

      return steering;
    }
    return steering;
  }
}

function pickBetweenTwoValues(valOne, valTwo) {
  return parseInt(Math.random() * 2) ? valOne : valTwo;
}

function pickRandomBetweenTwoValues(valOne, valTwo) {
  return valOne + Math.random() * (valTwo - valOne);
}
