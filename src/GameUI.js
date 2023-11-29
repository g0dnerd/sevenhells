export default class GameUI {
    constructor(scene) {
        this.scene = scene;

        // Initialize UI elements
        this.startButton = null;
        this.placementButton = null;
        this.gemChancesText = null;
        this.goldText = null;
        this.gemInfoText = null;
        this.combineTextColor = '#E3E3E3';
    }

    createStartButton() {
        this.startButton = this.scene.add.text(1300, 10, 'Start Level', 
            { font: '20px Arial', fill: '#0000FF', backgroundColor: '#FFFFFF', padding: { left: 5, right: 5, top: 5, bottom: 5 } })
            .setInteractive()
            .on('pointerdown', () => this.scene.startLevel(this.scene.currentLevel))
            .on('pointerover', () => this.startButton.setStyle({ fill: '#FF0000' }))
            .on('pointerout', () => this.startButton.setStyle({ fill: '#0000FF' }));
    }

    createPlacementButton() {
        this.placementButton = this.scene.add.text(1300, 260, 'Place Gems', 
            { font: '18px Arial', fill: '#0000FF', backgroundColor: '#FFFFFF', padding: { left: 5, right: 5, top: 5, bottom: 5 } })
            .setInteractive()
            .on('pointerdown', () => this.scene.startPlacementPhase())
            .on('pointerover', () => this.placementButton.setStyle({ fill: '#FF0000' }))
            .on('pointerout', () => this.placementButton.setStyle({ fill: '#0000FF' }));
    }

    createKeepButton() {
        this.keepGemButton = this.scene.add.text(1300, 300, 'Keep Gem',
			{ font: '18px Arial', fill: '#0000FF', backgroundColor: '#FFFFFF', padding: { left: 5, right: 5, top: 5, bottom: 5 } })
            .setInteractive()
            .on('pointerdown', () => this.scene.keepGem())
            .on('pointerover', () => this.keepGemButton.setStyle({ fill: '#FF0000' }))
            .on('pointerout', () => this.keepGemButton.setStyle({ fill: '#0000FF' }));
    }

    createCombineButton() {
        this.combineGemsButton = this.scene.add.text(1300, 340, 'Combine Gems',
			{ font: '18px Arial', fill: '#E3E3E3', backgroundColor: '#FFFFFF', padding: { left: 5, right: 5, top: 5, bottom: 5 } })
            .setInteractive()
            .on('pointerdown', () => this.scene.combineGems())
            .on('pointerover', () => this.combineGemsButton.setStyle({ fill: '#FF0000' }))
            .on('pointerout', () => this.combineGemsButton.setStyle({ fill: this.combineTextColor }));
    }

    createGemChanceText() {
        // Initialize gem chance text
		this.scene.add.text(1300, 50, 'Gem Chances:',
        { font: '18px Arial', fill: '#000000'});

        this.gemTier0Text = this.scene.add.text(1300, 75, `${this.scene.gemTiers[0]}: ${this.scene.gemChances[0]*100}%`,
            { font: '16px Arial', fill: '#000000' });

        this.gemTier1Text = this.scene.add.text(1300, 100, `${this.scene.gemTiers[1]}: ${this.scene.gemChances[1]*100}%`,
            { font: '16px Arial', fill: '#000000' });

        this.gemTier2Text = this.scene.add.text(1300, 125, `${this.scene.gemTiers[2]}: ${this.scene.gemChances[2]*100}%`,
        { font: '16px Arial', fill: '#000000' });

        this.gemTier3Text = this.scene.add.text(1300, 150, `${this.scene.gemTiers[3]}: ${this.scene.gemChances[3]*100}%`,
            { font: '16px Arial', fill: '#000000' });

        this.gemTier4Text = this.scene.add.text(1300, 175, `${this.scene.gemTiers[4]}: ${this.scene.gemChances[4]*100}%`,
            { font: '16px Arial', fill: '#000000' });

        this.gemTier5Text = this.scene.add.text(1300, 200, `${this.scene.gemTiers[5]}: ${this.scene.gemChances[5]*100}%`,
        { font: '16px Arial', fill: '#000000' });

        this.gemTier6Text = this.scene.add.text(1300, 225, `${this.scene.gemTiers[6]}: ${this.scene.gemChances[6]*100}%`,
        { font: '16px Arial', fill: '#000000' });
    }

    createStatusTexts() {
        this.hpText = this.scene.add.text(1300, 375, 'Lives: 0',
        { font: '18px Arial', fill: '#000000' });
        this.goldText = this.scene.add.text(1300, 400, 'Embers: 0',
        { font: '18px Arial', fill: '#000000' });
        this.gemInfoText = this.scene.add.text(1300, 450, '',
        { font: '16px Arial', fill: '#000000' });
    }

    updateHpText(lives) {
        // Update the text for HP amount
        this.hpText.setText(`Lives: ${lives}`);
    }

    updateGemChancesText(chances) {
        // Update the text for gem chances
    }

    updateGoldText(goldAmount) {
        // Update the text for gold amount
        this.goldText.setText(`Embers: ${goldAmount}`);
    }

    updateGemInfoText(gem) {
        // Update gem information text
		const info = `${this.scene.gemTiers[gem.rarity]} ${gem.color}\nDamage: ${gem.damage}\nRange: ${gem.range}\nAttack Speed: ${gem.attackSpeed}`;
		this.gemInfoText.setText(info);
    }

    setCombineButtonActive(status = true) {
        if (status) {
            this.combineTextColor = '#0000FF';
        } else {
            this.combineTextColor = '#E3E3E3';
        }
        this.combineGemsButton.setStyle(
            { font: '18px Arial', fill: this.combineTextColor });
    }

    // Call this method in the GameScene's create method to set up the UI
    setup() {
        this.createStartButton();
        this.createPlacementButton();
        this.createKeepButton();
        this.createCombineButton();
        this.createGemChanceText();
        this.createStatusTexts();
    }
}
