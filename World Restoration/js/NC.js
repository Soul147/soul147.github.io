function gainedKarma() {
	return game.cakes.divide(1e9).pow(1/3).multiply(game.karmaMultiplier).floor();
}

function newContest() {
	if(gainedKarma().lt(1)) return;
	game.newContest = game.newContest.add(1);
	game.karma = game.karma.add(gainedKarma());
	prestige(2);
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
			return game.karma.add(1).log10().divide(Math.log10(20)).add(1).pow(6)
		case 1:
			return Decimal.pow(1.45, game.totalFRBought.divide(50))
		case 2:
			return game.newEpisode.pow(0.5)
	}
}

function buyKarmaMultiplier(auto) {
	if(game.karma.lt(game.karmaMultiplierCost.multiply(1+!!auto*9))) return;
	game.karma = game.karma.subtract(game.karmaMultiplierCost);
	game.karmaMultiplier = game.karmaMultiplier.multiply(1.05);
	game.karmaMultiplierCost = game.karmaMultiplierCost.multiply(1.2);
}