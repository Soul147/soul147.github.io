function gainedCakes() {
	if(game.brake) return game.keys.divide(1e6).pow(1/2.5).multiply(game.cakeMultiplier2).floor().subtract(game.empoweredCakes).max(0);
	return game.keys.divide(1e6).pow(1/2.5).multiply(game.cakeMultiplier).floor();
}

function getECReq() {
	return game.empoweredCakes.divide(game.cakeMultiplier2).pow(2.5).multiply(1e6); // god I hope that's it
}

function newCakeAtStake(force) {
	if(gainedCakes().lt(1) && !force) return;
	game.newCakeAtStake = game.newCakeAtStake.add(1);
	if(game.brake) game.empoweredCakes = game.empoweredCakes.add(gainedCakes());
	else game.cakes = game.cakes.add(gainedCakes());
	game.brake = game.brakeNext;
	game.brakeNext = false;
	reset(2);
}

function toggleBrakeAtFlake() {
	game.brakeNext = !game.brakeNext;
}

function getEmpoweredCakeEffect() {
	return game.empoweredCakes.pow(0.5).multiply(1e6).max(1)
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
	if(game.brake) return new Decimal(1)
	switch(u) {
		case 0:
			return game.cakes.add(1).log10().divide(Math.log10(15)).add(1).pow(4)
		case 1:
			return Decimal.pow(1.15, game.totalFRBought.divide(25))
	}
}

function buyCakeMultiplier() {
	if(game.cakes.lt(game.cakeMultiplierCost)) return;
	game.cakes = game.cakes.subtract(game.cakeMultiplierCost);
	game.cakeMultiplier = game.cakeMultiplier.multiply(1.05);
	game.cakeMultiplierCost = game.cakeMultiplierCost.multiply(1.3);
}

function buyCakeMultiplier2() {
	if(game.cakes.lt(game.cakeMultiplier2Cost)) return;
	game.cakes = game.cakes.subtract(game.cakeMultiplier2Cost);
	game.cakeMultiplier2 = game.cakeMultiplier2.multiply(1.5);
	game.cakeMultiplier2Cost = game.cakeMultiplier2Cost.multiply(25);
}