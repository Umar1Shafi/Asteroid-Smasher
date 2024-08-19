class BulletSystem {
  constructor() {
    this.bullets = []; // Array to store bullet locations
    this.explosionParticles = []; // Array to store explosion particles
    this.velocity = createVector(0, -5); // Velocity vector for bullet movement
    this.diam = 10; // Diameter of bullets
  }

  run() {
    this.move();
    this.draw();
    this.edges();
  }

  fire(x, y) {
    this.bullets.push(createVector(x, y)); // Add a new bullet at the specified location
  }

  draw() {
    fill(255);
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];

      ellipse(bullet.x, bullet.y, this.diam, this.diam);

      let indexToExplode = -1; // Variable to store the index of the asteroid to explode

      for (let j = asteroids.locations.length - 1; j >= 0; j--) {
        const asteroidLoc = asteroids.locations[j];
        const asteroidDiam = asteroids.diams[j];

        const bulletRadius = this.diam / 2;
        const asteroidRadius = asteroidDiam / 2;
        const distance = p5.Vector.dist(bullet, asteroidLoc);
        // ***************************************************************************************
        // // my code starts here
        // // ***************************************************************************************
        if (distance <= bulletRadius + asteroidRadius) {
          indexToExplode = j; // Store the index of the asteroid to explode
          this.bullets.splice(i, 1); // Remove the bullet from the array
          spaceship.score++; // Increment the spaceship's score
          break; // Break out of the inner loop
        }
      }

      if (indexToExplode !== -1) {
        this.explodeAsteroid(
          indexToExplode,
          asteroids.locations[indexToExplode]
        ); // Pass the asteroidLoc as an argument
        break; // Break out of the outer loop
      }
    }

    for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
      const particle = this.explosionParticles[i];
      if (particle.isDead()) {
        this.explosionParticles.splice(i, 1); // Remove dead particles from the array
      } else {
        particle.update();
        particle.draw();
      }
    }
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
  }

  move() {
    for (let i = 0; i < this.bullets.length; i++) {
      // Update the y-coordinate of each bullet to move it upwards
      this.bullets[i].y += this.velocity.y;
    }

    for (let i = 0; i < this.explosionParticles.length; i++) {
      const particle = this.explosionParticles[i];
      particle.update();
    }
  }

  edges() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      // Check if the y-coordinate of a bullet is less than 0 (above the screen)
      if (this.bullets[i].y < 0) {
        this.bullets.splice(i, 1); // Remove the bullet from the array
      }
    }
  }
  // ***************************************************************************************
  // // my code starts here
  // // ***************************************************************************************
  explodeAsteroid(index, asteroidPosition) {
    const asteroidDiam = asteroids.diams[index];

    if (
      asteroidDiam > asteroids.asteroidSplitThreshold &&
      !asteroids.splitted[index]
    ) {
      const smallerAsteroidCount = 2;
      const smallerAsteroidDiamFactor = 0.5;

      // Generate smaller asteroids
      for (let i = 0; i < smallerAsteroidCount; i++) {
        const smallerAsteroidDiam = asteroidDiam * smallerAsteroidDiamFactor;
        const originalAsteroidLoc = asteroids.locations[index].copy();
        const smallerAsteroidLoc = createVector(
          originalAsteroidLoc.x,
          originalAsteroidLoc.y
        );
        const smallerAsteroidVelocity = p5.Vector.random2D().mult(random(1, 3));
        const smallerAsteroidAcceleration = createVector(0, random(0.1, 1));

        asteroids.locations.push(smallerAsteroidLoc);
        asteroids.velocities.push(smallerAsteroidVelocity);
        asteroids.accelerations.push(smallerAsteroidAcceleration);
        asteroids.diams.push(smallerAsteroidDiam);
        asteroids.splitted.push(false);

        // Trigger explosion particles
        for (let j = 0; j < 10; j++) {
          const position = smallerAsteroidLoc.copy();
          const velocity = p5.Vector.random2D().mult(random(1, 3));
          const lifespan = random(50, 100);
          this.explosionParticles.push(
            new Particle(position, velocity, lifespan)
          );
          explosionParticles.addParticle(
            asteroidPosition.copy(),
            createVector(0, 0),
            100
          );
        }
      }

      // Mark the original asteroid as split
      asteroids.splitted[index] = true;
    }

    // Destroy the asteroid
    asteroids.destroy(index);
  }
}
// ***************************************************************************************
// // my code ends here
// // ***************************************************************************************
