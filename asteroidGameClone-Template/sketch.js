// In this game extension, several modifications and enhancements were made to improve the gameplay experience. Firstly, the rocket and its thrusters were modified to have a visually appealing design. The rocket's body was drawn using shapes and bezier curves, and the thrusters were implemented to display flames when the rocket moves in different directions.

// Additionally, a score counter was added to keep track of the player's score. The score increases whenever the rocket destroys an asteroid, providing a sense of achievement and progress throughout the game. Furthermore, a high score functionality was implemented, which stores the player's highest score in the browser's local storage. This feature allows players to challenge themselves and aim for a new personal best.

// The design of the asteroids was also modified to make them visually distinct. Three types of asteroids were introduced, each differing in speed, size, and location. This variation adds more challenge and excitement to the gameplay, as players need to adapt to different asteroid behaviors.

// To enhance the overall game experience, sound effects were incorporated. Bullet and explosion sounds were added to create an immersive atmosphere and make the game more engaging for players.

// Although an attempt was made to add a particle system for an explosion effect when an asteroid is destroyed, it wasn't successfully implemented. However, the groundwork for the particle system was laid, and it can be further developed in the future to enhance the visual effects of the game.

// Overall, these extensions and enhancements aim to make the game more visually appealing, challenging, and immersive, providing an enjoyable gaming experience for players.

var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];
// ***************************************************************************************
// my code starts here
// ***************************************************************************************
let explosionParticles;
let thrusterParticles;
let bulletSound;
let explosionSound;
let GameOverSound;
// ***************************************************************************************
// my codeends here
// ***************************************************************************************
// SETUP FUNCTION
function setup() {
  createCanvas(1200, 800);
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();
  // ***************************************************************************************
  // // my code starts here
  // // ***************************************************************************************
  explosionParticles = new ParticleSystem();
  thrusterParticles = new ParticleSystem();

  // my code starts here
  bullet = new BulletSystem();
  // my code ends here
  // ***************************************************************************************
  // // my code ends here
  // // ***************************************************************************************
  // Location and size of earth and its atmosphere
  atmosphereLoc = createVector(width / 2, height * 2.9);
  atmosphereSize = createVector(width * 3, width * 3);
  earthLoc = createVector(width / 2, height * 3.1);
  earthSize = createVector(width * 3, width * 3);
  // ***************************************************************************************
  // // my code starts here
  // // ***************************************************************************************
  bulletSound = loadSound("/Music/bullet-sound.mp3");
  bulletSound.setVolume(0.05);
  explosionSound = loadSound("/Music/explosion-sound.mp3");
  GameOverSound = loadSound("/Music/gameover-sound.mp3");
  // ***************************************************************************************
  // // my code ends here
  // // ***************************************************************************************
}

// DRAW FUNCTION
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  drawEarth();

  // my code starts here
  showScore();
  // ***************************************************************************************
  // // my code starts here
  // // ***************************************************************************************
  explosionParticles.update();
  explosionParticles.draw();

  thrusterParticles.update();
  thrusterParticles.draw();

  spaceship.showScore();
  // ***************************************************************************************
  // // my code starts here
  // // ***************************************************************************************
  checkCollisions(); // Function that checks collision between various elements
  // my code ends here
}

// DRAW EARTH FUNCTION
// Draws earth and atmosphere
function drawEarth() {
  noStroke();
  // Draw atmosphere
  fill(0, 0, 255, 50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x, atmosphereSize.y);
  // Draw earth
  fill(100, 255);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

// CHECK COLLISIONS FUNCTION
// Checks collisions between all types of bodies
function checkCollisions() {
  // Spaceship-asteroid collisions
  // ***************************************************************************************
  // // my code starts here
  // // ***************************************************************************************
  for (var i = 0; i < asteroids.locations.length; i++) {
    if (
      isInside(
        asteroids.locations[i],
        createVector(asteroids.diams[i], asteroids.diams[i]),
        spaceship.location,
        createVector(spaceship.size, spaceship.size)
      )
    ) {
      gameOver();
      return; // Exit the function early if there's a collision
    }
  }

  // Asteroid-earth collisions
  for (var i = 0; i < asteroids.locations.length; i++) {
    if (
      isInside(
        asteroids.locations[i],
        createVector(asteroids.diams[i], asteroids.diams[i]),
        earthLoc,
        earthSize
      )
    ) {
      gameOver();
      return; // Exit the function early if there's a collision
    }
  }

  // Spaceship-earth collision
  if (
    isInside(
      spaceship.location,
      createVector(spaceship.size, spaceship.size),
      earthLoc,
      earthSize
    )
  ) {
    gameOver();
    return; // Exit the function early if there's a collision
  }

  // Spaceship-atmosphere collision
  if (
    isInside(
      spaceship.location,
      createVector(spaceship.size, spaceship.size),
      atmosphereLoc,
      atmosphereSize
    )
  ) {
    spaceship.setNearEarth();
  }

  // Bullet collisions
  // my code starts here
  for (let i = spaceship.bulletSys.bullets.length - 1; i >= 0; i--) {
    const bullet = spaceship.bulletSys.bullets[i];

    for (let j = asteroids.locations.length - 1; j >= 0; j--) {
      const asteroidLoc = asteroids.locations[j];
      const asteroidDiam = asteroids.diams[j];

      const bulletRadius = spaceship.bulletSys.diam / 2;
      const asteroidRadius = asteroidDiam / 2;
      const distance = p5.Vector.dist(bullet, asteroidLoc);
      if (distance <= bulletRadius + asteroidRadius) {
        spaceship.bulletSys.bullets.splice(i, 1);
        spaceship.score++;
        asteroids.destroy(j);
        break;
      }
    }
  }
  // ***************************************************************************************
  // // my codeends here
  // // ***************************************************************************************
}

// HELPER FUNCTION
// Checks if there's a collision between object A and object B
function isInside(locA, sizeA, locB, sizeB) {
  var distance = p5.Vector.dist(locA, locB);
  var radiusA = sizeA.x / 2;
  var radiusB = sizeB.x / 2;
  // ***************************************************************************************
  // // my code ends here
  // // ***************************************************************************************
  if (distance <= radiusA + radiusB) {
    return true;
  } else {
    return false;
  }
  // ***************************************************************************************
  // // my code ends here
  // // ***************************************************************************************
}

// KEY PRESSED FUNCTION
function keyPressed() {
  if (keyIsPressed && keyCode === 32) {
    // ***************************************************************************************
    // // my code starts here
    // // ***************************************************************************************
    // if spacebar is pressed, fire!
    spaceship.fire();
    bulletSound.play();
    // ***************************************************************************************
    // // my code ends here
    // // ***************************************************************************************
  }
}

// GAME OVER FUNCTION
// Ends the game by stopping the loops and displaying "Game Over"
function gameOver() {
  // ***************************************************************************************
  // // my code starts here
  // // ***************************************************************************************
  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2);
  text("Your Score: ", width / 2, height / 2 + 100);
  text(spaceship.score, width / 2 + 220, height / 2 + 100);
  noLoop();
  spaceship.gameOver(); // Call the method to update the high score
  GameOverSound.play();
  // ***************************************************************************************
  // // my code ends here
  // // ***************************************************************************************
}

// SKY FUNCTION
// Creates a star-lit sky
function sky() {
  push();
  while (starLocs.length < 300) {
    starLocs.push(createVector(random(width), random(height)));
  }
  fill(255);
  for (var i = 0; i < starLocs.length; i++) {
    rect(starLocs[i].x, starLocs[i].y, 2, 2);
  }

  if (random(1) < 0.3) starLocs.splice(int(random(starLocs.length)), 1);
  pop();
}

// SHOW SCORE FUNCTION
// Displays the score on the canvas
// ***************************************************************************************
// // my code starts here
// // ***************************************************************************************
function showScore() {
  fill(255);
  textSize(30);
  textAlign(LEFT, TOP);
  text("Score: " + spaceship.score, 10, 10);
}

function triggerExplosion(position) {
  const velocity = createVector(0, -2); // Set the initial velocity of the particle
  const lifespan = 100; // Set the lifespan of the particle

  // Add the explosion particle to the particle system
  explosionParticles.addParticle(position, velocity, lifespan);
}

// Example: Trigger thruster particles
function triggerThruster(position) {
  for (let i = 0; i < numberOfParticles; i++) {
    const velocity = createVector(0, random(1, 5)); // Customize thruster particle movement
    const lifespan = random(50, 100);
    thrusterParticles.addParticle(position, velocity, lifespan);
  }
}
// ***************************************************************************************
// // my code starts here
// // ***************************************************************************************
