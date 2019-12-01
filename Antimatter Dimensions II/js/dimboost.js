function canShift() {
	return game.dimensions[game.shifts + 4].bought.gt(1) && game.shifts < 5 && (!atInfinity() || game.break) && !inChallenge(11);
}

function shift() {
	if(!canShift()) return;
	game.shifts++;
	game.shiftTime = game.resetTime = Date.now();
	resetDimensions();
}

function getStartingShifts() {
	if(inChallenge(11)) return 0;
	return getChallengeSet() == 1 && !game.achievements.includes(42) ? 0 : game.infinityUpgrades.includes(3)*2 + game.infinityUpgrades.includes(7)*2 + game.infinityUpgrades.includes(11);
}

function canBoost() {
	if(inChallenge(11)) return game.dimensions[4].amount.gte(getDimensionBoostReq())
	return game.dimensions[9].amount.gte(getDimensionBoostReq()) && game.shifts == 5 && (!atInfinity() || game.break) && !inChallenge(8) && !inChallenge(10, 1);
}

function boost(bulk) {
	if(!canBoost()) return;
	
	var bought = game.dimensions[inChallenge(11) ? 4 : 9].amount.subtract(4).divide(getDimensionBoostScaling()).add(1).floor();
	
	if(game.boosts.gte(bought)) return;
	
	game.totalBoosts = game.totalBoosts.add(bought.subtract(game.boosts));
	game.boosts = bought;
	game.boostTime = game.resetTime = Date.now();
	if(!devMode) resetDimensions();
	return true;
}

function getDimensionBoostScaling() {
	var r = 2;
	if(game.infinityUpgrades.includes(13)) r *= 0.75;
	if(inChallenge(11)) r /= 3;
	return r;
}

function getDimensionBoostReq() {
	return game.boosts.multiply(getDimensionBoostScaling()).add(4);
}

function getDimensionBoostPower() {
	var r = new Decimal(2);
	if(game.infinityUpgrades.includes(9)) r = r.multiply(1.25)
	// if(game.infinityUpgrades.includes(24)) r = r.multiply(1.6)
	if(game.achievements.includes(41)) r = r.multiply(1.01)
	if(challengeCompleted(7, 1)) r = r.multiply(2.5)
	if(tree.hasStudy("p23")) r = r.multiply(4);
	if(inChallenge(7, 1)) r = r.pow(2)
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