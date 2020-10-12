let paramsForWork = {
  cohesion: 7,
  separation: 22,
  alignment: 22,
  speciesSeparation: 1,
  maxForce: 0.7,
  maxSpeed: 3,
};

let radius = 8;

class Boid {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.color = pickColor();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    // this.addLine();
  }

  addLine() {
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(
      this.velocity.x * 10 + this.position.x,
      this.velocity.y * 10 + this.position.y
    );
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
  }

  random() {
    return Math.random();
  }

  //   checkSpace() {
  //     if (this.position.x > window.innerWidth - radius * 2) {
  //       this.velocity.x *= -1;
  //     } else if (this.position.x < radius * 2) {
  //       this.velocity.x *= -1;
  //     }

  //     if (this.position.y > window.innerHeight - radius * 2) {
  //       this.velocity.y *= -1;
  //     } else if (this.position.y < radius * 2) {
  //       this.velocity.y *= -1;
  //     }

  //     this.position.add(this.velocity);
  //     this.velocity.limit(paramsForWork.maxSpeed);
  //   }

  checkSpace() {
    if (this.position.x > window.innerWidth - 100) {
      this.avoidEdges(paramsForWork.maxSpeed, this.velocity.y, 1);
    } else if (this.position.x < 100) {
      this.avoidEdges(paramsForWork.maxSpeed, this.velocity.y, -1);
    }

    if (this.position.y > window.innerHeight - 100) {
      this.avoidEdges(this.velocity.x, paramsForWork.maxSpeed, 1);
    } else if (this.position.y < 100) {
      this.avoidEdges(this.velocity.x, paramsForWork.maxSpeed, -1);
    }
  }

  // My version
  // avoidEdges(x, y, factor) {
  //   let desiredVelocity = new Vector(x * factor, y * factor);
  //   this.velocity.subtract(desiredVelocity);
  //   this.velocity.limit(paramsForWork.maxForce);
  //   this.acceleration.add(this.velocity);
  // }

  // IMPORTANT
  // IMPORTANT
  // IMPORTANT

  avoidEdges(x, y, factor) {
    let desiredVelocity = new Vector(x * factor, y * factor);
    let steer = new Vector(0, 0);
    steer.add(this.velocity);
    steer.subtract(desiredVelocity);
    steer.limit(paramsForWork.maxSpeed);
    this.velocity.add(steer);
  }

  /////// AVOID WALLS ////////

  avoidWalls(walls) {
    for (let i = 0; i < walls.length; i++) {
      var dx = this.position.x - walls[i].x;
      var dy = this.position.y - walls[i].y;
      var distanceToColision = Math.sqrt(dx * dx + dy * dy);

      if (distanceToColision < walls[i].radius + radius * 2 + 10) {
        let steer = new Vector(dx, dy);
        steer.limit(paramsForWork.maxForce * 2);
        this.velocity.add(steer);
      }
    }
  }

  move() {
    this.checkSpace();
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(paramsForWork.maxSpeed);
    this.acceleration.multiplyBy(0);
  }

  flock(boids) {
    let flockingValues = this.flocking(boids);

    this.acceleration.add(flockingValues.alignment);
    this.acceleration.add(flockingValues.cohesion);
    this.acceleration.add(flockingValues.separation);
    this.acceleration.add(flockingValues.speciesSeparation);
  }

  flocking() {
    let values = {
      cohesion: new Vector(0, 0),
      alignment: new Vector(0, 0),
      separation: new Vector(0, 0),
      speciesSeparation: new Vector(0, 0),
    };

    let separationRadius = paramsForWork.separation;
    let cohesionRadius = paramsForWork.cohesion;
    let alignmentRadius = paramsForWork.alignment;
    let speciesSeparation = paramsForWork.speciesSeparation;

    let totalAlignmentCount = 0;
    let totalSeparationCount = 0;
    let totalCohesionCount = 0;
    let totalSpeciesSeparationCount = 0;

    for (let other of boids) {
      let distance = this.position.distance(other.position);

      if (other != this && distance < alignmentRadius) {
        values.alignment.add(other.velocity);
        totalAlignmentCount++;
      }

      if (other != this && distance < cohesionRadius) {
        values.cohesion.add(other.position);
        totalCohesionCount++;
      }

      if (other != this && distance < separationRadius) {
        let diference = new Vector(
          this.position.x - other.position.x,
          this.position.y - other.position.y
        );
        diference.divideBy(distance * distance);
        values.separation.add(diference);
        totalSeparationCount++;
      }

      if (
        other != this &&
        this.color !== other.color &&
        distance < speciesSeparation
      ) {
        let diference = new Vector(
          this.position.x - other.position.x,
          this.position.y - other.position.y
        );
        diference.divideBy(distance * distance);
        values.speciesSeparation.add(diference);
        totalSpeciesSeparationCount++;
      }
    }

    if (totalAlignmentCount > 0) {
      values.alignment.divideBy(totalAlignmentCount);
      values.alignment.setMagnitude(paramsForWork.maxSpeed);
      values.alignment.subtract(this.velocity);
      values.alignment.limit(paramsForWork.maxForce);
    }

    if (totalCohesionCount > 0) {
      values.cohesion.divideBy(totalCohesionCount);
      values.cohesion.subtract(this.position);
      values.cohesion.setMagnitude(paramsForWork.maxSpeed);
      values.cohesion.subtract(this.velocity);
      values.cohesion.limit(paramsForWork.maxForce);
    }

    if (totalSeparationCount > 0) {
      values.separation.divideBy(totalSeparationCount);
      values.separation.setMagnitude(paramsForWork.maxSpeed);
      values.separation.subtract(this.velocity);
      values.separation.limit(paramsForWork.maxForce);
    }

    if (totalSpeciesSeparationCount > 0) {
      values.speciesSeparation.divideBy(totalSpeciesSeparationCount);
      values.speciesSeparation.setMagnitude(paramsForWork.maxSpeed);
      values.speciesSeparation.subtract(this.velocity);
      values.speciesSeparation.limit(paramsForWork.maxForce);
      // values.speciesSeparation.multiplyBy(1 / paramsForWork.speciesSeparation);
    }

    return values;
  }
}

function pickColor() {
  let colors = ["red", "green", "white"];
  return colors[parseInt(Math.random() * colors.length)];
}

function pickBetweenTwoValues(valOne, valTwo) {
  return parseInt(Math.random() * 2) ? valOne : valTwo;
}

function pickRandomBetweenTwoValues(valOne, valTwo) {
  return valOne + Math.random() * (valTwo - valOne);
}

var gui = new dat.GUI();

gui.add(paramsForWork, "cohesion").min(0).max(100).step(1).listen();
gui.add(paramsForWork, "separation").min(0).max(100).step(1).listen();
gui.add(paramsForWork, "alignment").min(0).max(100).step(1).listen();
gui.add(paramsForWork, "speciesSeparation").min(0).max(100).step(1).listen();
gui.add(paramsForWork, "maxSpeed").min(0).max(10).step(0.1).listen();
gui.add(paramsForWork, "maxForce").min(0).max(5).step(0.01).listen();

gui.close();
