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
  game.add.sprite(0, 0, 'sky');

  // Making group of platforms
  platforms = game.add.physicsGroup();
  platforms.enableBody = true;

  // Ground
  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;

  // Ledges
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  // Player
  player = game.add.sprite(32, game.world.height - 150, 'dude');
  // player aniamtions using spritesheet and applies game physics
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);
  game.physics.arcade.enable(player);

  // Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

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
    scorelabel = game.add.text(-55, 0, "Your score is: ", style);
    scoretext = game.add.text(55, 0, score, style);
    scorelabel.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    scoretext.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    //  We'll set the bounds to be from x0, y520 (top down) and be 800px wide by 100px high
    scorelabel.setTextBounds(0, 520, 800, 100);
    scoretext.setTextBounds(0, 520, 800, 100);

}

function update() {
  // Collide the player and the stars with the platforms
  game.physics.arcade.collide(player, platforms);
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
  // Collide with stars
  game.physics.arcade.collide(stars, platforms);
  // Calls collectStar function when overlaps
  game.physics.arcade.overlap(player, stars, collectStar, null, this);
  // Stars collide with platforms
  game.physics.arcade.collide(stars, platforms);
  // defining collectStar function
  function collectStar (player, star) {
 	 	// Removes the star from the screen
  	star.kill();
    score = score + 1;
    console.log("You got it!");
    console.log(score.toString());
    // Win at 12 stars collected (ask students - why is this repeating?)
    if (score == 12) {
      game.pause = true; // Have this commented out first
      console.log('You Win!!!')
    }
	}
}
