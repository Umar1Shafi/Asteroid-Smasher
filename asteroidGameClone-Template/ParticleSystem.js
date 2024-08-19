// ***************************************************************************************
// // my code starts here
// // ***************************************************************************************
class ParticleSystem {
  constructor() {
    this.particles = []; // Array to store the particles
  }

  // Add a new particle to the system
  addParticle(position, velocity, lifespan) {
    const particle = new Particle(position, velocity, lifespan);
    this.particles.push(particle);
  }

  // Update the particles in the system
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update();
      if (particle.isDead()) {
        this.particles.splice(i, 1); // Remove dead particles from the array
      }
    }
  }

  // Draw the particles in the system
  draw() {
    for (const particle of this.particles) {
      particle.draw();
    }
  }
}

class Particle {
  constructor(position, velocity, lifespan) {
    this.position = position.copy(); // Initial position of the particle
    this.velocity = velocity.copy(); // Velocity of the particle
    this.lifespan = lifespan; // Remaining lifespan of the particle
    this.alpha = 255; // Current alpha value of the particle
  }

  // Update the particle's position, velocity, and lifespan
  update() {
    this.position.add(this.velocity);
    this.lifespan--;
    this.alpha = map(this.lifespan, 0, 255, 0, 255); // Adjust alpha based on lifespan
  }

  // Check if the particle is dead (lifespan reaches 0)
  isDead() {
    return this.lifespan <= 0;
  }

  // Draw the particle
  draw() {
    noStroke();
    fill(255, this.alpha); // Apply alpha to particle color
    ellipse(this.position.x, this.position.y, 5, 5); // Customize particle shape
  }
}
// ***************************************************************************************
// // my code ends here
// // ***************************************************************************************
