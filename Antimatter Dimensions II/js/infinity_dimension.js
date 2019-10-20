var infDimensionBaseCosts = [0, 1e4, 1e6, 1e10, 1e15, 1e90, 1e130, 1e180, 1e240, 1e300]
var infDimensionCostMults = [0, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30, 1e35]
var infDimensionBuyMults = [0, 50, 30, 10, 5, 5, 5, 5, 5, 5]

function InfinityDimension(i) {
	this.id = game.infinityDimensions.length;
	this.amount = new Decimal(0);
	this.bought = new Decimal(0);
	this.boughtOverInf = new Decimal(0);
	this.multiplier = new Decimal(1);
	this.cost = new Decimal(infDimensionBaseCosts[i]);
	this.costMult = new Decimal(infDimensionCostMults[i]);
}

function getInfinityShiftCost() {
	return Decimal.pow(Number.MAX_VALUE, game.infinityShifts.multiply(game.infinityShifts.add(1)).divide(2).add(3))
}

function canInfinityShift() {
	return game.dimensions[0].amount.gte(getInfinityShiftCost()) && (game.infinityShifts.lt(4) || getChallengeCompletions(1) > 11);
}

function infinityShift() {
	if(!canInfinityShift()) return;
	if(game.infinityShifts.eq(9)) return;
	game.infinityShifts = game.infinityShifts.add(1);
	for(var i = 1; i <= 10; i++) {
		game.infinityDimensions[i].amount = game.infinityDimensions[i].bought;
	}
	game.infinityDimensions[0].amount = new Decimal(1);
}

function resetInfinityDimensions() {
	game.infinityDimensions = [];
	game.infinityShifts = new Decimal(0);

	for(var i = 0; i <= 10; i++) {
		game.infinityDimensions[i] = new InfinityDimension(i);
	}
	
	game.infinityDimensions[0].amount = new Decimal(1);
}

function getInfinityDimensionProduction(i) {
	var dim = game.infinityDimensions[i];
	
	dim.multiplier = Decimal.pow(infDimensionBuyMults[dim.id], dim.bought).multiply(Decimal.pow(10, game.infinityShifts.subtract(i).add(game.infinityUpgrades.includes(23)*(9-i)*0.5)))
	if(challengeCompleted(1, 1)) dim.multiplier = dim.multiplier.multiply(getChallengeReward(1, 1))
	if(game.achievements.includes(39)) dim.multiplier = dim.multiplier.multiply(1.01);
	
	return dim.amount.multiply(dim.multiplier);
}

function canBuyInfinityDimension(i) {
	return game.infinityDimensions[i].cost.lte(game.infinityPoints)
}

function buyInfinityDimension(i) {
	var dim = game.infinityDimensions[i];
	
	dim.cost = dim.costMult.pow(dim.bought).multiply(infDimensionBaseCosts[i]);
	if(!canBuyInfinityDimension(i)) return;
	game.infinityPoints = game.infinityPoints.subtract(dim.cost);
	
	dim.amount = dim.amount.add(1);
	dim.bought = dim.bought.add(1);
	
	dim.cost = dim.costMult.pow(dim.bought).multiply(infDimensionBaseCosts[i]);
	
	return true;
}

function maxInfinityDimension(i) {
	var dim = game.infinityDimensions[i];
	if(!canBuyInfinityDimension(i)) return;
	
	dim.bought = game.infinityPoints.divide(infDimensionBaseCosts[i]).log10().divide(Decimal.log10(infDimensionCostMults[i])).add(1).floor();
	dim.amount = dim.amount.max(dim.bought)
	dim.cost = dim.costMult.pow(dim.bought).multiply(infDimensionBaseCosts[i]);
	if(game.infinityPoints.lt("eee1")) game.infinityPoints = game.infinityPoints.subtract(dim.cost.divide(infDimensionCostMults[i]));
}

function maxAllInfinityDimensions() {
	for(var i = 1; i < 10; i++) maxInfinityDimension(i);
}

function getInfinityPowerPower() { // ...bruh
	return 3
}

function getInfinityPowerEffect() {
	return game.infinityDimensions[0].amount.pow(getInfinityPowerPower()).max(1)
}