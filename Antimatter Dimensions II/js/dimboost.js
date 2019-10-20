function canShift() {
	return game.dimensions[game.shifts + 4].bought.gt(1) && game.shifts < 5 && !atInfinity() && !inChallenge(10);
}

function shift() {
	if(!canShift()) return;
	game.shifts++;
	game.shiftTime = game.resetTime = Date.now();
	resetDimensions();
}

function getStartingShifts() {
	if(inChallenge(10)) return 0;
	return getChallengeSet() == 1 && !game.achievements.includes(25) ? 0 : game.infinityUpgrades.includes(3)*2 + game.infinityUpgrades.includes(7)*2 + game.infinityUpgrades.includes(11);
}

function canBoost() {
	if(inChallenge(10)) return game.dimensions[4].amount.gte(getDimensionBoostReq())
	return game.dimensions[9].amount.gte(getDimensionBoostReq()) && game.shifts == 5 && !atInfinity() && !inChallenge(8);
}

function boost(bulk) {
	if(!canBoost()) return;
	
	var bought = game.dimensions[inChallenge(10) ? 4 : 9].amount.subtract(4).divide(getDimensionBoostScaling()).add(1).floor();
	
	if(game.boosts.gte(bought)) return;
	
	game.boosts = bought;
	game.boostTime = game.resetTime = Date.now();
	resetDimensions();
}

function getDimensionBoostScaling() {
	var r = 2;
	if(game.infinityUpgrades.includes(13)) r *= 0.75;
	if(inChallenge(10)) r /= 3;
	return r;
}

function getDimensionBoostReq() {
	return game.boosts.multiply(getDimensionBoostScaling()).add(4);
}

function getDimensionBoostPower() {
	var r = new Decimal(2);
	if(game.infinityUpgrades.includes(9)) r = r.multiply(1.25)
	if(game.infinityUpgrades.includes(24)) r = r.multiply(1.6)
	return r;
}

function getDimensionSupersonicStart() {
	return 56e4;
}

function getDimensionHypersonicStart() {
	return 56e6;
}

function getDimensionSupersonicPower() {
	return 0.5;
}

function getDimensionHypersonicPower() {
	return 0.5;
}

function getEffectiveDimensionBoosts() {
	var x = getDimensionSupersonicStart()
	var y = getDimensionHypersonicStart()
	
	var superScaling = game.boosts.subtract(x).multiply(getDimensionSupersonicPower()).add(x);
	
	if(game.boosts.lte(x)) return game.boosts.floor();
	if(superScaling.lte(y)) return superScaling.floor();
	return superScaling.subtract(y).pow(getDimensionHypersonicPower()).add(y).floor();
}

function getDimensionBoostEffect() {
	return Decimal.pow(getDimensionBoostPower(), getEffectiveDimensionBoosts().add(game.shifts));
}