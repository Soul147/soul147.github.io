function canBuyTickspeed() {
	return game.tickspeed.cost.lte(game.dimensions[0].amount) && !atInfinity()
}

function buyTickspeed() {
	var dim = game.tickspeed;
	
	if(dim.cost.gt(Number.MAX_VALUE)) return maxTickspeed();
	
	if(!canBuyTickspeed()) return;
	game.dimensions[0].amount = game.dimensions[0].amount.subtract(dim.cost);
	if(inChallenge(9)) suffer(0);
	
	dim.bought = dim.bought.add(1);
	
	dim.cost = dim.cost.multiply(dim.costMult);
	game.buyTime = Date.now();
	
	return true;
}

function maxTickspeed() {
	var dim = game.tickspeed;
	
	while(dim.cost.lte(Number.MAX_VALUE) && buyTickspeed());
	
	if(!canBuyTickspeed()) return;
	game.buyTime = Date.now();
	
	// Superbuying
	
	if(game.dimensions[0].amount.layer >= 3) {
		dim.cost = game.dimensions[0].amount;
		dim.bought = dim.cost.log10().sqrt();
		return;
	}

	var a = Decimal.log10(game.dimCostMultIncrease).divide(2), 
		b = dim.costMult.log10().subtract(a), 
		c = dim.cost.log10().subtract(game.dimensions[0].amount.log10()),
		d = b.pow(2).subtract(a.multiply(c).multiply(4))
	
	if(d.lt(0)) return;
	
	var x = d.sqrt().subtract(b).divide(a.multiply(2)).add(1).floor();
	
	if(x.lt(1)) return;
	
	var newCost = dim.cost.multiply(dim.costMult.pow(x.subtract(1))).multiply(Decimal.pow(game.dimCostMultIncrease, x.subtract(1).multiply(x.subtract(2)).divide(2)))
	var newMult = dim.costMult.multiply(Decimal.pow(game.dimCostMultIncrease, x.subtract(1)));
	
	dim.bought = dim.bought.add(x);
	
	dim.cost = newCost.multiply(newMult);
	dim.costMult = newMult.multiply(game.tickCostMultIncrease);
}

function getTickspeed(name) {
	if(name == "dimension") return Decimal.pow(getTickPower(), game.tickspeed.bought);
	return 1;
}

// Galaxies

function canGalaxy() {
	if(inChallenge(10)) return game.dimensions[4].amount.gte(getGalaxyReq())
	return game.dimensions[9].amount.gte(getGalaxyReq()) && !atInfinity() && !inChallenge(8);
}

function galaxy() {
	if(!canGalaxy()) return;
	
	var bought = game.dimensions[inChallenge(10) ? 4 : 9].amount.subtract(5).divide(getGalaxyScaling()).add(1).floor();
	
	game.galaxies = bought;
	
	game.shifts = getStartingShifts();
	game.boosts = new Decimal(0);
	game.galaxyTime = game.resetTime = Date.now();
	resetDimensions();
}

function getGalaxyReq() {
	return game.galaxies.multiply(getGalaxyScaling()).add(5).floor();
}

function getGalaxyScaling() {
	return 5;
}

function getTickPower() {
	return Decimal.pow(1.1, getEffectiveGalaxies().subtract(1)).divide(10-inChallenge(12)*6).add(1);
}

function getEffectiveNormalGalaxies() {
	var r = game.galaxies;
	
	var x = getDistantGalaxyStart();
	var y = getRemoteGalaxyStart();
	var z = getDarkGalaxyStart();
	
	if(r.gt(x)) r = r.subtract(x).multiply(getDistantGalaxyPower()).add(x).floor();
	if(r.gt(y)) r = r.subtract(y).pow(getRemoteGalaxyPower()).add(y).floor();
	if(r.gt(z)) r = Decimal.pow(10, r.subtract(z).log10().pow(getDarkGalaxyPower())).add(z).floor();
	
	return r.add(!inChallenge(11)+0);
}

function getEffectiveGalaxies() {
	return getEffectiveNormalGalaxies().multiply(getGalaxyPower());
}

function getGalaxyPower() {
	var r = new Decimal(1);
	if(game.infinityUpgrades.includes(15) && getChallengeSet() !== 1 && !inChallenge(1, 1)) r = r.multiply(2);
	if(game.infinityUpgrades.includes(25)) r = r.multiply(1.1);
	
	return r;
}

function getDistantGalaxyStart() {
	return 100;
}

function getRemoteGalaxyStart() {
	return 1000;
}

function getDarkGalaxyStart() {
	return 10000;
}

function getDistantGalaxyPower() {
	return 0.5;
}

function getRemoteGalaxyPower() {
	return 0.5;
}

function getDarkGalaxyPower() {
	return 0.5;
}