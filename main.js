const gameConfig = {
    type: Phaser.AUTO,
    width: 800,  // adjust as needed
    height: 600, // adjust as needed
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(gameConfig);

function preload() {
    // Import image assets
    this.load.image('map', 'assets/images/map.png');
    this.load.spritesheet('basic_human', 'assets/images/enemy_basic_spritesheet.png',
        { frameWidth: 32, frameHeight: 32 });
}


function create() {
    // Add the map
    this.add.image(400, 300, 'map');

    // Create walking animations for each direction from the spritesheet
    this.anims.create({
        key: 'enemy_walk_down',
        frames: this.anims.generateFrameNumbers('basic_human', {
            start: 0, end: 3}),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'enemy_walk_down_left',
        frames: this.anims.generateFrameNumbers('basic_human', {
            start: 4, end: 7}),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'enemy_walk_left',
        frames: this.anims.generateFrameNumbers('basic_human', {
            start: 8, end: 11}),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'enemy_walk_up_left',
        frames: this.anims.generateFrameNumbers('basic_human', {
            start: 12, end: 15}),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'enemy_walk_up',
        frames: this.anims.generateFrameNumbers('basic_human', {
            start: 16, end: 19}),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'enemy_walk_up_right',
        frames: this.anims.generateFrameNumbers('basic_human', {
            start: 20, end: 23}),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'enemy_walk_right',
        frames: this.anims.generateFrameNumbers('basic_human', {
            start: 24, end: 27}),
        frameRate: 3,
        repeat: -1
    });
    this.anims.create({
        key: 'enemy_walk_down_right',
        frames: this.anims.generateFrameNumbers('basic_human', {
            start: 28, end: 31}),
        frameRate: 7,
        repeat: -1
    });

    let enemy = this.add.sprite(0, 116, 'basic_human');
    enemy.play('enemy_walk_right')

    // Move the enemy right for a certain distance
    let moveRight = this.tweens.add({
        targets: enemy,
        x: { value: 225, duration: 5000 },
        onComplete: function () {
            // Play the walk down animation
            enemy.play('enemy-walk-down');
        }
    });

    // Start the initial move right tween
    moveRight.start();

}
