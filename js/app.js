console.log('hey hey it works');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platforms
var cursors

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'sky');

  // Making group of platforms
  platforms = game.add.group();
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
      player.body.velocity.y = -350;
    }

}
