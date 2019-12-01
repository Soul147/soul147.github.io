function canBuyTickspeed() {
	return game.tickspeed.cost.lte(game.dimensions[0].amount) && (!atInfinity() || game.break) && game.dimensions[1].amount.gt(0)
}

function buyTickspeed() {
	var dim = game.tickspeed;
	
	// if(dim.cost.gt(Number.MAX_VALUE)) return maxTickspeed();
	
	if(!canBuyTickspeed()) return;
	game.dimensions[0].amount = game.dimensions[0].amount.subtract(dim.cost);
	if(inChallenge(9)) suffer(0);
	
	dim.bought = dim.bought.add(1);
	
	dim.cost = dim.cost.multiply(dim.costMult);
	if(dim.cost.divide(dim.costMult).gt(Number.MAX_VALUE)) dim.costMult = dim.costMult.multiply(game.tickCostMultIncrease);
	
	game.buyTime = Date.now();
	
	return true;
}

function maxTickspeed() {
	if(inChallenge(9)) {while(buyTickspeed()); return}
	
	var dim = game.tickspeed;
	
	if(!canBuyTickspeed()) return;
	game.buyTime = Date.now();
	
	if(dim.cost.lte(Number.MAX_VALUE)) {
		var bought = game.dimensions[0].amount.min(Number.MAX_VALUE).log10().subtract(dim.cost.log10()).divide(dim.costMult.log10()).ceil()
		
		dim.bought = dim.bought.add(bought);
		dim.cost = dim.cost.multiply(dim.costMult.pow(bought));
		game.dimensions[0].amount = game.dimensions[0].amount.subtract(dim.cost.divide(dim.costMult))
		
		return bought.gt(0);
	}
	
	// Superbuying
	
	if(game.dimensions[0].amount.layer > 3) {
		dim.cost = game.dimensions[0].amount;
		dim.bought = dim.cost.log10().sqrt().divide(Math.log(Math.log(game.tickCostMultIncrease)));
		return true;
	}

	var a = Decimal.log10(game.tickCostMultIncrease).divide(2), 
		b = dim.costMult.log10().subtract(a), 
		c = dim.cost.log10().subtract(game.dimensions[0].amount.log10()),
		d = b.pow(2).subtract(a.multiply(c).multiply(4))
	
	if(d.lt(0)) return;
	
	var x = d.sqrt().subtract(b).divide(a.multiply(2)).add(1).floor();
	
	if(x.lt(1)) return;
	
	var newCost = dim.cost.multiply(dim.costMult.pow(x.subtract(1))).multiply(Decimal.pow(game.tickCostMultIncrease, x.subtract(1).multiply(x.subtract(2)).divide(2)))
	var newMult = dim.costMult.multiply(Decimal.pow(game.tickCostMultIncrease, x.subtract(1)));
	
	dim.bought = dim.bought.add(x);
	
	dim.cost = newCost.multiply(newMult);
	dim.costMult = newMult.multiply(game.tickCostMultIncrease);
	
	return true;
}

function getTickspeed(name) {
	var r = Decimal.pow(getTickPower(), game.tickspeed.bought.add(getFreeTickspeedUpgrades()));
	if(game.achievements.includes(20)) r = r.multiply(1.01);
	if(game.achievements.includes(23)) r = r.multiply(1.02);
	if(game.achievements.includes(29)) r = r.multiply(1.05);
	if(game.achievements.includes(34)) r = r.multiply(1.10);
	
	if(name == "dimension") return r;
	if(name == "infinityDimension" && challengeCompleted(6, 1)) return r.pow(0.01);
	return new Decimal(1);
}

// Galaxies

function canGalaxy() {
	if(inChallenge(11)) return game.dimensions[4].amount.gte(getGalaxyReq())
	return game.dimensions[9].amount.gte(getGalaxyReq()) && (!atInfinity() || game.break) && !inChallenge(8) && !inChallenge(7, 1);
}

function galaxy() {
	if(!canGalaxy()) return;
	
	var bought = game.dimensions[inChallenge(11) ? 4 : 9].amount.subtract(getGalaxyScaling()).divide(getGalaxyScaling()).add(1).ceil();
	
	game.totalGalaxies = game.totalGalaxies.add(bought.subtract(game.galaxies));
	game.galaxies = bought;
	
	game.shifts = getStartingShifts();
	game.boosts = new Decimal(0);
	game.galaxyTime = game.resetTime = Date.now();
	if(!devMode) resetDimensions();
	return true;
}

function getGalaxyReq() {
	return game.galaxies.multiply(getGalaxyScaling()).add(getGalaxyScaling());
}

function getGalaxyScaling() {
	r = new Decimal(5);
	if(tree.hasStudy("r11")) r = r.multiply(0.9)
	return r;
}

function getTickPower() {
	var r = Decimal.pow(1.1, getEffectiveGalaxies().subtract(1)).divide(10-inChallenge(10)*6).add(1);
	var ic3 = getChallengeReward(3, 1).multiply(getEffectiveGalaxies());
	if(inChallenge(3, 1)) r = ic3.add(1);
	if(challengeCompleted(3, 1)) r = r.add(ic3)
	return r;
}

function getEffectiveNormalGalaxies() {
	var r = game.galaxies;
	
	var x = getDistantGalaxyStart();
	var y = getRemoteGalaxyStart();
	var z = getDarkGalaxyStart();
	
	if(r.gt(x)) r = r.subtract(x).multiply(getDistantGalaxyPower()).add(x).floor();
	if(r.gt(y)) r = r.subtract(y).pow(getRemoteGalaxyPower()).add(y).floor();
	if(r.gt(z)) r = Decimal.pow(10, r.subtract(z).log10().pow(getDarkGalaxyPower())).add(z).floor();
	
	return r.add(!inChallenge(12)+0).multiply(getNormalGalaxyPower());
}

function getEffectiveReplicantiGalaxies() {
	var r = game.replicanti.galaxies;
	
	return r.multiply(getReplicantiGalaxyPower());
}

function getEffectiveGalaxies() {
	return getEffectiveNormalGalaxies().add(getEffectiveReplicantiGalaxies()).multiply(getGalaxyPower());
}

function getGalaxyPower() {
	var r = new Decimal(1);
	if(game.infinityUpgrades.includes(15) && getChallengeSet() !== 1 && getChallengeSet() !== 2) r = r.multiply(2);
	if(challengeCompleted(5, 1)) r = r.multiply(1.1);
	return r;
}

function getNormalGalaxyPower() {
	var r = new Decimal(1);
	
	return r;
}

function getReplicantiGalaxyPower() {
	var r = new Decimal(1);
	if(tree.hasStudy("r32")) r = r.multiply(1.5);
	
	return r;
}

function getDistantGalaxyStart() {
	return 75+tree.hasStudy("r22")*25;
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