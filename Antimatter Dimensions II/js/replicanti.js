function resetReplicanti() {
	game.replicanti = {
		amount: new Decimal(1),
		ticks: 0,
		galaxies: new Decimal(0),
		upgrades: [new Decimal(0), new Decimal(0), new Decimal(0)]
	}
}

const replUpgIncs = ["10", "100", "1e5"];

function getReplUpgradeCost(i) {
	return new Decimal(replUpgIncs[i]).pow(game.replicanti.upgrades[i].add(1));
}

function canBuyReplUpgrade(i) {
	return game.eternityPoints.gte(getReplUpgradeCost(i));
}

function buyReplUpgrade(i) {
	if(!canBuyReplUpgrade(i)) return;
	var inc = new Decimal(replUpgIncs[i]);
	var bought = Decimal.affordGeometricSeries(game.eternityPoints, inc, inc, game.replicanti.upgrades[i])
	game.replicanti.upgrades[i] = game.replicanti.upgrades[i].add(bought);
	if(game.eternityPoints.lt(infp())) game.eternityPoints = game.eternityPoints.subtract(getReplUpgradeCost(i).divide(inc))
}

function getReplEffect() {
	return game.replicanti.amount.floor().log2().pow(4).max(1);
}

function getReplChance() {
	var r = game.replicanti.upgrades[0].divide(100).add(1)
	
	return r;
}

function getReplSpeed() {
	var r = game.replicanti.upgrades[1].divide(10).add(1)
	if(tree.hasStudy("r22")) r = r.multiply(3)
	
	return r;
}

function getReplLimit() {
	return infp(game.replicanti.upgrades[2].max(1))
}

function getMaxReplGalaxies() {
	return game.replicanti.upgrades[2]; // cap this at some point
}

function canReplGalaxy() {
	return game.replicanti.amount.gte(infp(game.replicanti.galaxies.add(1))) && game.replicanti.galaxies.lt(getMaxReplGalaxies())
}

function replGalaxy() {
	game.replicanti.galaxies = game.replicanti.amount.log(infp()).max(getMaxReplGalaxies());
	game.replicanti.amount = game.replicanti.amount.divide(infp());
}