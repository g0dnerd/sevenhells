export default class GemData {
   	static get colors() {
		return ['white', 'yellow', 'green', 'blue', 'pink', 'cyan', 'red'];
	}

	static baseDamage = {
		0: 10, // White
        1: 5,  // Yellow
        2: 8,  // Green
        3: 8,  // Blue
        4: 12, // Pink
        5: 3,  // Cyan
        6: 10  // Red
	};

    static baseRange = {
		0: 100, // White
        1: 60,  // Yellow
        2: 100,  // Green
        3: 100,  // Blue
        4: 150, // Pink
        5: 100,  // Cyan
        6: 80  // Red
    };

    static baseAttackSpeed = {
		0: 1000, // White
        1: 800,  // Yellow
        2: 1000,  // Green
        3: 1000,  // Blue
        4: 900, // Pink
        5: 900,  // Cyan
        6: 1000  // Red
    };

    static calculateDamage(rarity, colorIndex) {
        const base = GemData.baseDamage[colorIndex];
        if (base === undefined) {
            throw new Error(`Invalid color index: ${colorIndex}`);
        }
        return base + 5 * (rarity + 1);
    }

    static calculateRange(rarity, colorIndex) {
        const base = GemData.baseRange[colorIndex];
        if (base === undefined) {
            throw new Error(`Invalid color index: ${colorIndex}`);
        }
        return base + 10 * (rarity + 1);
    }

    static calculateAttackSpeed(rarity, colorIndex) {
        const base = GemData.baseAttackSpeed[colorIndex];
        if (base === undefined) {
            throw new Error(`Invalid color index: ${colorIndex}`);
        }
        return base + 50 * (rarity + 1);
    }
}