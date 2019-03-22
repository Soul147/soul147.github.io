function gainedCakes() {
	return game.keys.divide(1e6).pow(1/2.5).multiply(game.cakeMultiplier);
}

function newCakeAtStake() {
	if(gainedCakes().lt(1)) return;
	game.newCakeAtStake = game.newCakeAtStake.add(1);
	game.cakes = game.cakes.add(gainedCakes());
	reset(2);
}

game.ncaUpgradeCosts = {0: "10", 1: "100"}
for(i in game.ncaUpgradeCosts) game.ncaUpgradeCosts[i] = new Decimal(game.ncaUpgradeCosts[i]);

function buyNCaUpgrade(u) {
	if(game.ncaUpgrades.includes(u)) return;
	if(game.cakes.lt(game.ncaUpgradeCosts[u])) return;
	game.ncaUpgrades.push(u)
	game.cakes = game.cakes.subtract(game.ncaUpgradeCosts[u]);
}

function getNCaUpgradeEffect(u) {
	switch(u) {
		case 0:
			return game.cakes.add(1).log10().divide(Math.log10(15)).add(1).pow(4)
		case 1:
			return Decimal.pow(1.16, game.totalFRBought.divide(25))
	}
}

function buyCakeMultiplier() {
	if(game.cakes.lt(game.cakeMultiplierCost)) return;
	game.cakes = game.keys.subtract(game.cakeMultiplierCost);
	game.cakeMultiplier = game.cakeMultiplier.multiply(1.05);
	game.cakeMultiplierCost = game.cakeMultiplierCost.multiply(1.3);
}

function buyCakeMultiplier2() {
	if(game.cakes.lt(game.cakeMultiplier2Cost)) return;
	game.cakes = game.keys.subtract(game.cakeMultiplier2Cost);
	game.cakeMultiplier2 = game.cakeMultiplier2.multiply(1.1);
	game.cakeMultiplier2Cost = game.cakeMultiplier2Cost.multiply(25);
}