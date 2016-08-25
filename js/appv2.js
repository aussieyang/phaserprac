console.log('hey hey it works');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var score = 0

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Add margin to the world, so the camera can move (for quake effect)
  var margin = 50;
  // Set the world's bounds according to the given margin
  var x = -margin;
  var y = -margin;
  var w = game.world.width + margin * 2;
  var h = game.world.height + margin * 2;
  // Not necessary to increase height, we do it to keep uniformity
  game.world.setBounds(x, y, w, h);
  // Make sure camera is at position (0,0)
  game.world.camera.position.set(0);

  game.add.sprite(0, 0, 'sky');

  // Making group of platforms
  platforms = game.add.physicsGroup();
  platforms.enableBody = true;

  // Ground
  var ground = platforms.create(0, game.world.height - 120, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;

  // Ledges
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  // Player
  player = game.add.sprite(32, game.world.height - 180, 'dude');
    // player animations using spritesheet and applies game physics
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    game.physics.arcade.enable(player);
    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

  // Enemy
  enemy1 = game.add.sprite(760, 20, 'baddie')
    // Enemy animations using spritesheet and applies game physics
    enemy1.animations.add('left', [0, 1], 10, true);
    enemy1.animations.add('right', [2, 3], 10, true);
    game.physics.arcade.enable(enemy1);
    // Enemy physics properties.
    enemy1.body.bounce.y = 0.2;
    enemy1.body.gravity.y = 500;
    enemy1.body.collideWorldBounds = true;

  // Creating keyboard entry
  cursors = game.input.keyboard.createCursorKeys();

  // Creating stars
  stars = game.add.physicsGroup();
  stars.enableBody = true;
  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++){
    //  Create a star inside of the 'stars' group
    var star = stars.create(i * 70, 0, 'star');
    //  Let gravity do its thing
    star.body.gravity.y = 200;
    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  // Setting style for text
  var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    //  The Text is positioned at these coorindates within textbound
    scorelabel = game.add.text(-60, 0, "Your score is: ", style);
    scoretext = game.add.text(65, 0, score, style);
    scorelabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    scoretext.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    //  We'll set the bounds to be from x0, y520 (top down) and be 800px wide by 100px high
    scorelabel.setTextBounds(0, 520, 800, 100);
    scoretext.setTextBounds(0, 520, 800, 100);

}

function update() {
  // Collide the player and the stars with the platforms
  game.physics.arcade.collide(player, platforms);
  // Collide the enemies and the stars with the platforms
  game.physics.arcade.collide(enemy1, platforms);
  // Reset the player’s velocity (movement) if no events
  player.body.velocity.x = 0;

  // Left key pressed
  if (cursors.left.isDown){
        // Move to the left
        player.body.velocity.x = -150;
        // Play animation
        player.animations.play('left');
    } else if (cursors.right.isDown) {
      	player.body.velocity.x = 150;
      	player.animations.play('right');
  	} else {
      //  Stand still
      player.animations.stop();
      player.frame = 4;
    }
  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down){
    player.body.velocity.y = -300;
  }

  // Enemy AI
  if (enemy1.x > 759){
    enemy1.animations.play('left');
    enemy1.body.velocity.x = -120;
  } else if (enemy1.x < 405) {
    enemy1.animations.play('right');
    enemy1.body.velocity.x = 120;
  }

  // Collide with stars
  game.physics.arcade.collide(stars, platforms);
  // Calls collectStar function when overlaps
  game.physics.arcade.overlap(player, stars, collectStar, null, this);
  // Stars collide with platforms
  game.physics.arcade.collide(stars, platforms);
  // Player triggers gameover when contact with enemy1
  game.physics.arcade.overlap(player, enemy1, gameOver, null, this)

  // Defining collectStar function
  function collectStar (player, star) {
 	 	// Removes the star from the screen
  	star.kill();
    // Updating score variable
    score = score + 1;
    // Reflecting in the text
    scoretext.setText(score);

    // Create new star
    star = stars.create(Math.floor(Math.random() * 750), 0, 'star');
    //  Let gravity do its thing
    star.body.gravity.y = 200;
    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}
}

// Quake!!
function addQuake() {
  // Define the camera offset for the quake
  var rumbleOffset = 10;
  // Move according to the camera's current position
  var properties = {
    x: game.camera.x - rumbleOffset
  };
  // Really fast movement
  var duration = 100;
  // Repeat
  var repeat = 4;
  // Use bounce in-out to soften it a little bit
  var ease = Phaser.Easing.Bounce.InOut;
  var autoStart = false;
  // Delay because we will run it indefinitely
  var delay = 1000;
  // we want to go back to the original position
  var yoyo = true;
  var quake = game.add.tween(game.camera)
    .to(properties, duration, ease, autoStart, delay, 4, yoyo);
  // Recursion to run indefinitely
  quake.onComplete.addOnce(addQuake);
  // Let the earthquake begin!
  quake.start();
}

// Defining gameOver
function gameOver (player, enemy1) {
  console.log('gameOver triggered');
  // Quake!
  addQuake();
}
