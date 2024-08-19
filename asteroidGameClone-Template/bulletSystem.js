class AsteroidSystem {
  constructor() {
    this.locations = []; // Array to store asteroid locations
    this.velocities = []; // Array to store asteroid velocities
    this.accelerations = []; // Array to store asteroid accelerations
    this.diams = []; // Array to store asteroid diameters
    this.spawnRate = 1.01; // Initial spawn rate of asteroids
    this.spawnRateIncrease = 0.001; // Rate at which the spawn rate increases over time
    this.lastSpawnTime = millis(); // Store the timestamp of the last asteroid spawn
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
    this.splitted = []; // Array to track if an asteroid is split
    this.asteroidSplitThreshold = 150; // Diameter threshold for asteroid splitting
    this.asteroids = []; // Array to store asteroids
    // ***************************************************************************************
    // // my code ends here
    // // ***************************************************************************************
  }

  // Get the asteroid locations
  getLocations() {
    return this.locations;
  }

  // Get the asteroid diameters
  getDiams() {
    return this.diams;
  }

  run() {
    this.spawn();
    this.move();
    this.draw();
  }

  // Spawn new asteroids
  spawn() {
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
    const currentTime = millis();
    const timeElapsed = currentTime - this.lastSpawnTime;

    if (timeElapsed > 1000 / this.spawnRate) {
      const newAsteroidDiam = random(30, 50);
      const newAsteroidLoc = createVector(random(width), 0);
      const newAsteroidVelocity = createVector(0, 0);
      const newAsteroidAcceleration = createVector(0, random(0.1, 1));

      this.locations.push(newAsteroidLoc);
      this.velocities.push(newAsteroidVelocity);
      this.accelerations.push(newAsteroidAcceleration);
      this.diams.push(newAsteroidDiam);
      this.splitted.push(false);

      this.lastSpawnTime = currentTime;
      this.spawnRate += this.spawnRateIncrease;
    }
    // ***************************************************************************************
    // // my code ends here
    // // ***************************************************************************************
  }

  // Move the asteroids
  move() {
    for (let i = 0; i < this.locations.length; i++) {
      // ***************************************************************************************
      // // my code starts here
      // // ***************************************************************************************
      this.velocities[i].add(this.accelerations[i]);
      this.locations[i].add(this.velocities[i]);
      this.accelerations[i].mult(0);
      // ***************************************************************************************
      // // my code starts here
      // // ***************************************************************************************
    }
  }

  // Apply force to the asteroids
  applyForce(f) {
    for (let i = 0; i < this.locations.length; i++) {
      // ***************************************************************************************
      // // my code starts here
      // // ***************************************************************************************
      this.accelerations[i].add(f);
      // ***************************************************************************************
      // // my code ends  here
      // // ***************************************************************************************
    }
  }

  // Create a new asteroid of a specific type
  createAsteroid(type) {
    // ***************************************************************************************
    // // my code starts  here
    // // ***************************************************************************************
    let asteroid;
    if (type === "type1") {
      // Define behavior for type1 asteroid
      const size = random(30, 50);
      const location = createVector(random(width), 0);
      const velocity = createVector(0, 0);
      const acceleration = createVector(0, random(0.1, 1));
      asteroid = new Asteroid(size, location, velocity, acceleration);
    } else if (type === "type2") {
      // Define behavior for type2 asteroid
      const size = random(50, 80);
      const location = createVector(random(width), 0);
      const velocity = createVector(random(-1, 1), random(1, 3));
      const acceleration = createVector(0, random(0.1, 1));
      asteroid = new Asteroid(size, location, velocity, acceleration);
    } else if (type === "type3") {
      // Define behavior for type3 asteroid
      const size = random(20, 40);
      const location = createVector(random(width), 0);
      const velocity = createVector(random(-2, 5), random(1, 5));
      const acceleration = createVector(random(-0.05, 0.05), random(0.1, 1));
      asteroid = new Asteroid(size, location, velocity, acceleration);
    }
    // Add more types of asteroids as needed

    return asteroid;
    // ***************************************************************************************
    // // my code ends here
    // // ***************************************************************************************
  }

  // Draw the asteroids
  draw() {
    for (let i = 0; i < this.locations.length; i++) {
      const asteroid = new Asteroid(
        this.diams[i],
        this.locations[i],
        this.velocities[i],
        this.accelerations[i]
      );
      asteroid.draw();
    }
  }

  // Destroy an asteroid at the given index
  destroy(index) {
    this.locations.splice(index, 1);
    this.velocities.splice(index, 1);
    this.accelerations.splice(index, 1);
    this.diams.splice(index, 1);
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
    explosionSound.play();
    // ***************************************************************************************
    // // my code ends here
    // // ***************************************************************************************
  }
  // ***************************************************************************************
  // // my code starts  here
  // // ***************************************************************************************
  // Explode an asteroid at the given index
  explodeAsteroid(index, asteroidPosition) {
    const asteroidDiam = this.diams[index];

    if (asteroidDiam > this.asteroidSplitThreshold && !this.splitted[index]) {
      const smallerAsteroidCount = 2;
      const smallerAsteroidDiamFactor = 0.5;

      for (let i = 0; i < smallerAsteroidCount; i++) {
        const smallerAsteroidDiam = asteroidDiam * smallerAsteroidDiamFactor;
        const originalAsteroidLoc = this.locations[index].copy();
        const smallerAsteroidLoc = createVector(
          originalAsteroidLoc.x,
          originalAsteroidLoc.y
        );
        const smallerAsteroidVelocity = p5.Vector.random2D().mult(random(1, 3));
        const smallerAsteroidAcceleration = createVector(0, random(0.1, 1));

        this.locations.push(smallerAsteroidLoc);
        this.velocities.push(smallerAsteroidVelocity);
        this.accelerations.push(smallerAsteroidAcceleration);
        this.diams.push(smallerAsteroidDiam);
        this.splitted.push(false);
      }

      triggerExplosion(asteroidPosition);
      this.splitted[index] = true;
    }

    this.destroy(index);
  }
}

class Asteroid {
  constructor(size, location, velocity, acceleration) {
    this.size = size;
    this.location = location.copy();
    this.velocity = velocity.copy();
    this.acceleration = acceleration.copy();
  }

  // Draw the asteroid
  draw() {
    noStroke();
    fill(150);
    const asteroidDetail = floor(random(5, 12));
    beginShape();
    for (let i = 0; i < asteroidDetail; i++) {
      const angle = map(i, 0, asteroidDetail, 0, TWO_PI);
      const radius = this.size / 2;
      const x = this.location.x + cos(angle) * radius;
      const y = this.location.y + sin(angle) * radius;

      if (i % 2 === 0) {
        const controlX = random(-radius / 2, radius / 2);
        const controlY = random(-radius / 2, radius);
        quadraticVertex(controlX, controlY, x, y);
      } else {
        vertex(x, y);
      }
    }
    endShape(CLOSE);

    this.location.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
  }
}
// ***************************************************************************************
// // my code ends here
// // ***************************************************************************************
