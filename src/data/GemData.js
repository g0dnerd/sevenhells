export default class GemData {
   	static get colors() {
		return ['white', 'yellow', 'green', 'blue', 'pink', 'cyan', 'red'];
	}

	static get baseDamage() {
        return [
            10, // White
            12,  // Yellow
            8,  // Green
            8,  // Blue
            12, // Pink
            8,  // Cyan
            10  // Red
        ];
	}

    static get baseRange() {
        return [
            100, // White
            70,  // Yellow
            100,  // Green
            100,  // Blue
            60, // Pink
            100,  // Cyan
            80  // Red
        ]
    }

    static get baseAttackSpeed() {
        return[ 
            1000, // White
            800,  // Yellow
            1000,  // Green
            1000,  // Blue
            900, // Pink
            900,  // Cyan
            1000  // Red
        ];
    }

    static get levelUpThresholds() {
        return[
            100,
            300,
            600,
            1000
        ]
    };

    static get gemChanceTiers() {
        return[
            [1, 0, 0, 0, 0, 0, 0],
            [0.7, 0.3, 0, 0, 0, 0, 0],
            [0.6, 0.3, 0.1, 0, 0, 0, 0],
            [0.5, 0.3, 0.2, 0, 0, 0, 0],
            [0.4, 0.3, 0.2, 0.1, 0, 0, 0],
            [0.3, 0.3, 0.3, 0.1, 0, 0, 0],
            [0.2, 0.3, 0,3, 0.2, 0, 0, 0],
            [0.1, 0.3, 0.3, 0.3, 0, 0, 0],
            [0, 0.3, 0.3, 0.3, 0.1, 0, 0]
        ]
    };

    static ChanceTierUpgradeCosts(tier) {
        return 20 + 30 * tier;
    }

    static calculateDamage(rarity, colorIndex, level) {
        const base = GemData.baseDamage[colorIndex];
        if (base === undefined) {
            throw new Error(`Invalid color index: ${colorIndex}`);
        }
        return base + 5 * (rarity * 2 + level + 1);
    }

    static calculateRange(rarity, colorIndex) {
        const base = GemData.baseRange[colorIndex];
        if (base === undefined) {
            throw new Error(`Invalid color index: ${colorIndex}`);
        }
        return base + 10 * (rarity + 1);
    }

    static calculateAttackSpeed(rarity, colorIndex, level) {
        const base = GemData.baseAttackSpeed[colorIndex];
        if (base === undefined) {
            throw new Error(`Invalid color index: ${colorIndex}`);
        }
        return base + 50 * (rarity * 2 + level + 1);
    }
}