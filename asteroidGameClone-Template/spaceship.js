class Spaceship {
  constructor() {
    this.velocity = new createVector(0, 0); // Velocity vector for spaceship movement
    this.location = new createVector(width / 2, height / 2); // Starting location of the spaceship
    this.acceleration = new createVector(0, 0); // Acceleration vector for spaceship movement
    this.maxVelocity = 5; // Maximum velocity of the spaceship
    this.bulletSys = new BulletSystem(); // Bullet system for firing bullets
    this.size = 50; // Size of the spaceship
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
    this.score = 0; // Score variable to keep track of the number of destroyed asteroids
    this.highScore = localStorage.getItem("highScore") || 0; // Load high score from localStorage or set to 0
    // ***************************************************************************************
    // // my code ends here
    // // ***************************************************************************************
  }

  run() {
    this.bulletSys.run(); // Run the bullet system
    this.draw(); // Draw the spaceship
    this.move(); // Move the spaceship
    this.edges(); // Handle edges of the canvas
    this.interaction(); // Handle user interaction
  }

  // Draw the spaceship
  draw() {
    // Draw the spaceship body
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
    fill(0, 100, 200);
    stroke(255);
    strokeWeight(2);

    push();
    translate(this.location.x, this.location.y);
    rotate(this.velocity.heading() + PI / 2);

    // Body
    beginShape();
    vertex(-this.size / 2, this.size / 4);
    bezierVertex(
      -this.size / 2,
      -this.size / 2,
      this.size / 2,
      -this.size / 2,
      this.size / 2,
      this.size / 4
    );
    bezierVertex(
      this.size / 3,
      this.size / 2,
      -this.size / 3,
      this.size / 2,
      -this.size / 2,
      this.size / 4
    );
    endShape(CLOSE);

    // Cockpit
    fill(255);
    noStroke();
    ellipse(0, -this.size / 4, this.size / 3, this.size / 3);

    // Wings
    fill(0, 100, 200);
    triangle(
      -this.size / 2,
      this.size / 4,
      this.size / 2,
      this.size / 4,
      0,
      this.size / 2
    );

    pop();

    // Draw thrusters based on user input
    if (keyIsDown(LEFT_ARROW)) {
      this.drawThruster(-1);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.drawThruster(1);
    }
    if (keyIsDown(UP_ARROW)) {
      this.drawThruster(0);
    }
  }

  // Draw thrusters to show spaceship movement
  drawThruster(direction) {
    fill(255, 0, 0); // Red color for thrusters
    noStroke();

    // Calculate thruster position based on spaceship size and direction
    var thrusterX = this.location.x - direction * (this.size / 2);
    var thrusterY = this.location.y + this.size / 2;

    // Calculate thruster size
    var thrusterSize = this.size / 4;

    // Draw thruster flames
    for (var i = 0; i < 3; i++) {
      var offsetX = random(-thrusterSize / 2, thrusterSize / 2);
      var offsetY = random(thrusterSize / 2, thrusterSize);

      ellipse(
        thrusterX + direction * offsetX,
        thrusterY + offsetY,
        thrusterSize / 2,
        thrusterSize / 2
      );
    }

    // Additional condition for upward thruster
    if (direction === 0) {
      // Calculate upward thruster position
      var thrusterUpX = this.location.x;
      var thrusterUpY = this.location.y + this.size / 2;

      // Draw upward thruster flame
      for (var i = 0; i < 3; i++) {
        var offsetX = random(-thrusterSize / 2, thrusterSize / 2);
        var offsetY = random(thrusterSize / 2, thrusterSize);

        ellipse(
          thrusterUpX + offsetX,
          thrusterUpY + offsetY,
          thrusterSize / 2,
          thrusterSize / 2
        );
      }
    }
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
  }

  // Move the spaceship
  move() {
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
    this.velocity.add(this.acceleration); // Add acceleration to velocity
    this.velocity.limit(this.maxVelocity); // Limit the velocity to the maximum velocity
    this.location.add(this.velocity); // Add velocity to location
    this.acceleration.mult(0); // Reset acceleration to zero
    // ***************************************************************************************
    // // my code ends here
    // // ***************************************************************************************
  }

  // Apply a force to the spaceship
  applyForce(f) {
    this.acceleration.add(f); // Add a force to the acceleration
  }

  // Handle user interaction to control spaceship movement
  interaction() {
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
    if (keyIsDown(LEFT_ARROW)) {
      this.applyForce(createVector(-0.1, 0)); // Apply force to move left
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.applyForce(createVector(0.1, 0)); // Apply force to move right
    }
    if (keyIsDown(UP_ARROW)) {
      this.applyForce(createVector(0, -0.1)); // Apply force to move up
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.applyForce(createVector(0, 0.1)); // Apply force to move down
    }
  }

  // Fire a bullet from the spaceship
  fire() {
    this.bulletSys.fire(this.location.x, this.location.y);
  }
  // ***************************************************************************************
  // // my code ends here
  // // ***************************************************************************************

  // Handle the spaceship going off the edges of the canvas
  edges() {
    if (this.location.x < 0) this.location.x = width;
    else if (this.location.x > width) this.location.x = 0;
    else if (this.location.y < 0) this.location.y = height;
    else if (this.location.y > height) this.location.y = 0;
  }

  // Apply forces to the spaceship when it is near the earth
  setNearEarth() {
    var gravity = createVector(0, 0.05); // Gravity force
    this.applyForce(gravity);

    var friction = this.velocity.copy(); // Friction force
    friction.normalize();
    friction.mult(-0.03); // 30 times smaller than velocity
    this.applyForce(friction);
  }
  // ***************************************************************************************
  // // my code starts here
  // // ***************************************************************************************
  // Display the score on the screen
  showScore() {
    fill(255);
    textSize(30);
    textAlign(LEFT, TOP);
    text("Score: " + this.score, 10, 10);
    text("High Score: " + spaceship.highScore, 10, 50); // Display high score
  }

  // Update the high score and save it to localStorage
  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", spaceship.highScore); // Save high score in localStorage
    }
  }

  // Game over logic
  gameOver() {
    this.updateHighScore(); // Call the method to update the high score
  }
  // ***************************************************************************************
  // // my code ends here
  // // ***************************************************************************************
}
