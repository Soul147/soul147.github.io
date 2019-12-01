var timeDimensionBaseCosts = [0, 1, 10, 100, 1000, 1e90, 1e140, 1e200, 1e280, 1e280]
var timeDimensionCostMults = [0, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683]
var timeDimensionBuyMults = [0, 4, 4, 4, 4, 4, 4, 4, 4, 4]

function TimeDimension(i) {
	this.id = game.timeDimensions.length;
	this.amount = new Decimal(0);
	this.bought = new Decimal(0);
	this.multiplier = new Decimal(1);
	this.cost = new Decimal(timeDimensionBaseCosts[i]);
	this.costMult = new Decimal(timeDimensionCostMults[i]);
}

function resetTimeDimensions() {
	game.timeDimensions = [];

	for(var i = 0; i <= 10; i++) {
		game.timeDimensions[i] = new TimeDimension(i);
	}
	
	game.timeDimensions[0].amount = new Decimal(0);
}

function getTimeDimensionProduction(i) {
	var dim = game.timeDimensions[i];
	
	dim.multiplier = Decimal.pow(timeDimensionBuyMults[dim.id], dim.bought)
	if(tree.hasStudy("t11") && i == 1) dim.multiplier = dim.multiplier.multiply(tree.getEff("t11"))
	if(tree.hasStudy("t21")) dim.multiplier = dim.multiplier.multiply(tree.getEff("t21"))
	
	return dim.amount.multiply(dim.multiplier);
}

function canBuyTimeDimension(i) {
	return game.timeDimensions[i].cost.lte(game.eternityPoints);
}

function buyTimeDimension(i) {
	var dim = game.timeDimensions[i];
	
	dim.cost = dim.costMult.pow(dim.bought).multiply(timeDimensionBaseCosts[i]);
	if(!canBuyTimeDimension(i)) return;
	game.eternityPoints = game.eternityPoints.subtract(dim.cost);
	
	dim.amount = dim.amount.add(1);
	dim.bought = dim.bought.add(1);
	
	dim.cost = dim.costMult.pow(dim.bought).multiply(timeDimensionBaseCosts[i]);
	
	return true;
}

function maxTimeDimension(i) {
	var dim = game.timeDimensions[i];
	if(!canBuyTimeDimension(i)) return;
	
	dim.bought = game.eternityPoints.divide(timeDimensionBaseCosts[i]).log10().divide(Decimal.log10(timeDimensionCostMults[i])).add(1).floor();
	dim.amount = dim.amount.max(dim.bought)
	dim.cost = dim.costMult.pow(dim.bought).multiply(timeDimensionBaseCosts[i]);
	if(game.eternityPoints.lt("eee1")) game.eternityPoints = game.eternityPoints.subtract(dim.cost.divide(timeDimensionCostMults[i]));
}

function maxAllTimeDimensions() {
	for(var i = 1; i < 10; i++) maxTimeDimension(i);
}

function getFreeTickspeedMult() {
	return new Decimal(4/3);
}

function getFreeTickspeedUpgrades() {
	var a = game.timeDimensions[0].amount;
	return a.gt(0) ? a.log10().divide(getFreeTickspeedMult().log10()).ceil().max(0) : new Decimal(0);
}

function getFreeTickspeedThreshold() {
	return getFreeTickspeedMult().pow(getFreeTickspeedUpgrades())
}

function getInfinityPowerEffect() {
	return game.infinityDimensions[0].amount.pow(getInfinityPowerPower()).max(1)
}