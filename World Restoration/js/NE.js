function gainedKeys() {
	return game.forks.divide(1e3).pow(1/2).multiply(getKeyMultiplier()).floor();
}

function getKeyMultiplier() {
	if(game.brake) return new Decimal(1)
	return game.keyMultiplier
}

function getKeyReduction() {
	if(game.brake) return new Decimal(1)
	return Decimal.pow(1/0.85, game.keyReductionUpgrades)
}

function newEpisode() {
	if(gainedKeys().lt(1)) return;
	game.newEpisode = game.newEpisode.add(1);
	game.keys = game.keys.add(gainedKeys());
	prestige(0);
}

game.neUpgradeCosts = {0: "10", 1: "100", 2: "1000"}
for(i in game.neUpgradeCosts) game.neUpgradeCosts[i] = new Decimal(game.neUpgradeCosts[i]);

function buyNEUpgrade(u) {
	if(game.neUpgrades.includes(u)) return;
	if(game.keys.lt(game.neUpgradeCosts[u])) return;
	game.neUpgrades.push(u)
	game.keys = game.keys.subtract(game.neUpgradeCosts[u]);
}

function getNEUpgradeEffect(u) {
	switch(u) {
		case 0:
			return game.keys.add(1).log10().add(1).pow(3)
		case 1:
			return Decimal.pow(1.05, game.totalFRBought.divide(10))
		case 2:
			return game.newEpisode.pow(0.5)
	}
}

function buyKeyMultiplier(auto) {
	if(game.brake) return;
	if(game.keys.lt(game.keyMultiplierCost.multiply(1+!!auto*9))) return;
	game.keys = game.keys.subtract(game.keyMultiplierCost);
	game.keyMultiplier = game.keyMultiplier.multiply(1.05);
	game.keyMultiplierCost = game.keyMultiplierCost.multiply(1.2);
	return true;
}

function buyKeyReduction(auto) {
	if(game.brake) return;
	if(game.keys.lt(game.keyReductionCost.multiply(1+!!auto*9))) return;
	game.keys = game.keys.subtract(game.keyReductionCost);
	game.keyReductionUpgrades = game.keyReductionUpgrades.add(1)
	game.keyReductionCost = game.keyReductionCost.multiply(1.5);
	return true;
}