export default class Stone extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'stone');

        this.scene = scene;

        scene.add.existing(this);
        this.setOrigin(0,0);
    }
}