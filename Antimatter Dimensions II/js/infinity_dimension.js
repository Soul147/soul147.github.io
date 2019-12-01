var infDimensionBaseCosts = [0, 1e8, 1e10, 1e12, 1e15, 1e90, 1e140, 1e200, 1e280, "1e400"]
var infDimensionCostMults = [0, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30, 1e35]
var infDimensionBuyMults = [0, 50, 30, 10, 5, 5, 5, 5, 5, 5]

function InfinityDimension(i) {
	this.id = game.infinityDimensions.length;
	this.amount = new Decimal(0);
	this.bought = new Decimal(0);
	this.multiplier = new Decimal(1);
	this.cost = new Decimal(infDimensionBaseCosts[i]);
	this.costMult = new Decimal(infDimensionCostMults[i]);
}

function getInfinityShiftCost() {
	if(game.infinityShifts.lt(4)) return infp(game.infinityShifts.add(2).multiply(2))
	return infp(game.infinityShifts.multiply(2).pow(2));
}

function canInfinityShift() {
	return game.dimensions[0].amount.gte(getInfinityShiftCost()) && (game.infinityShifts.lt(4) || getChallengeCompletions(1) > 5);
}

function infinityShift() {
	if(!canInfinityShift()) return;
	game.infinityShifts = game.infinityShifts.add(1);
	for(var i = 1; i <= 10; i++) {
		game.infinityDimensions[i].amount = game.infinityDimensions[i].bought;
	}
	game.infinityDimensions[0].amount = new Decimal(1);
	return true;
}

function maxInfinityShift() {
	if(!canInfinityShift()) return;
	while(canInfinityShift() && game.infinityShifts.lt(4)) infinityShift();
	var bought = game.dimensions[0].amount.log10().divide(infp().log10()).sqrt().divide(2).ceil()
	game.infinityShifts = bought;
	return true;
}

function resetInfinityDimensions() {
	game.infinityDimensions = [];
	game.infinityShifts = new Decimal(0);

	for(var i = 0; i <= 10; i++) {
		game.infinityDimensions[i] = new InfinityDimension(i);
	}
	
	game.infinityDimensions[0].amount = new Decimal(1);
}

function getInfinityShiftPower() {
	var r = new Decimal(10);
	if(challengeCompleted(12, 1)) r = r.pow(4);
	if(tree.hasStudy("i22")) r = r.multiply(tree.getEff("i22"));
	return r;
}

function getInfinityDimensionProduction(i) {
	var dim = game.infinityDimensions[i];
	
	dim.multiplier = Decimal.pow(infDimensionBuyMults[dim.id], dim.bought).multiply(Decimal.pow(getInfinityShiftPower(), game.infinityShifts.subtract(i)))
	dim.multiplier = dim.multiplier.multiply(getReplEffect());
	if(challengeCompleted(1, 1)) dim.multiplier = dim.multiplier.multiply(getChallengeReward(1, 1))
	if(challengeCompleted(9, 1)) dim.multiplier = dim.multiplier.multiply(getAchievementMultiplier())
	if(challengeCompleted(10, 1)) dim.multiplier = dim.multiplier.multiply(getChallengeReward(10, 1))
	if(game.achievements.includes(50)) dim.multiplier = dim.multiplier.multiply(1.01);
	if(game.infinityUpgrades.includes(23)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(23))
	if(game.infinityUpgrades.includes(24)) dim.multiplier = dim.multiplier.multiply((challengeCompleted(11, 1) ? 10 : 2.5) ** (10 - i))
	if(game.infinityUpgrades.includes(25)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(25))
	if(game.eternityUpgrades.includes(0)) dim.multiplier = dim.multiplier.multiply(getEternityUpgradeEffect(0))
	if(game.eternityUpgrades.includes(1)) dim.multiplier = dim.multiplier.multiply(getEternityUpgradeEffect(1))
	if(game.eternityUpgrades.includes(2)) dim.multiplier = dim.multiplier.multiply(getEternityUpgradeEffect(2))
	if(game.eternityUpgrades.includes(3)) dim.multiplier = dim.multiplier.multiply(getEternityUpgradeEffect(3))
	if(game.eternityUpgrades.includes(4)) dim.multiplier = dim.multiplier.multiply(getEternityUpgradeEffect(4))
	if(tree.hasStudy("i11")) dim.multiplier = dim.multiplier.multiply(tree.getEff("i11"))
	if(tree.hasStudy("i21")) dim.multiplier = dim.multiplier.multiply(tree.getEff("i21"))
	if(tree.hasStudy("i31") && i == 9) dim.multiplier = dim.multiplier.multiply(tree.getEff("i31"))
	
	return dim.amount.multiply(dim.multiplier);
}

function canBuyInfinityDimension(i) {
	return game.infinityDimensions[i].cost.lte(game.infinityPoints) && game.infinityShifts.gte(i);
}

function buyInfinityDimension(i) {
	var dim = game.infinityDimensions[i];
	
	dim.cost = dim.costMult.pow(dim.bought).multiply(infDimensionBaseCosts[i]);
	if(!canBuyInfinityDimension(i)) return;
	if(game.infinityPoints.lt(infp())) game.infinityPoints = game.infinityPoints.subtract(dim.cost);
	
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
	if(game.infinityPoints.lt(infp())) game.infinityPoints = game.infinityPoints.subtract(dim.cost.divide(infDimensionCostMults[i]));
}

function maxAllInfinityDimensions() {
	for(var i = 1; i < 10; i++) maxInfinityDimension(i);
}

function getInfinityPowerPower() { // ...bruh
	var r = 3
	if(inChallenge(12, 1)) r /= 1.5
	return r
}

function getInfinityPowerEffect() {
	return game.infinityDimensions[0].amount.pow(getInfinityPowerPower()).max(1)
}