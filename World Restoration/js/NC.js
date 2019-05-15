function gainedKarma() {
	return game.cakes.add(gainedCakes()).divide(1e9).pow(1/3).multiply(game.karmaMultiplier).floor();
}

function newContest() {
	if(gainedKarma().lt(1)) return;
	game.newContest = game.newContest.add(1);
	game.karma = game.karma.add(gainedKarma());
	prestige(2);
}

function getKarmaReduction() {
	return Decimal.pow(1/0.8, game.karmaReductionUpgrades)
}

game.ncUpgradeCosts = {0: "10", 1: "100", 2: "1000"}
for(i in game.ncUpgradeCosts) game.ncUpgradeCosts[i] = new Decimal(game.ncUpgradeCosts[i]);

function buyNCUpgrade(u) {
	if(game.ncUpgrades.includes(u)) return;
	if(game.karma.lt(game.ncUpgradeCosts[u])) return;
	game.ncUpgrades.push(u)
	game.karma = game.karma.subtract(game.ncUpgradeCosts[u]);
}

function getNCUpgradeEffect(u) {
	switch(u) {
		case 0:
			return game.karma.add(1).log10().divide(Math.log10(20)).add(1).pow(9)
		case 1:
			return Decimal.pow(1.15, game.totalFRBought.divide(50))
		case 2:
			return game.newContest.multiply(100).pow(0.5).max(1)
	}
}

function buyKarmaMultiplier(auto) {
	if(game.karma.lt(game.karmaMultiplierCost.multiply(1+!!auto*9))) return;
	game.karma = game.karma.subtract(game.karmaMultiplierCost);
	game.karmaMultiplier = game.karmaMultiplier.multiply(1.05);
	game.karmaMultiplierCost = game.karmaMultiplierCost.multiply(1.4);
}

function buyKarmaReduction(auto) {
	if(game.karma.lt(game.karmaReductionCost.multiply(1+!!auto*9))) return;
	game.karma = game.karma.subtract(game.karmaReductionCost);
	game.karmaReductionUpgrades = game.karmaReductionUpgrades.add(1)
	game.karmaReductionCost = game.karmaReductionCost.multiply(1.5);
	return true;
}