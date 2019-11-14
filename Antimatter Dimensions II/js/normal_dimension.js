var lastTime = Date.now();

var dimensionBaseCosts = [0, 10, 100, 10000, 1e6, 1e9, 1e13, 1e18, 1e24, 1e30]
var dimensionBaseCostMults = [0, 1000, 10000, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15, 1e18]

function NormalDimension(i) {
	this.id = game.dimensions.length;
	this.amount = new Decimal(0);
	this.bought = new Decimal(0);
	this.boughtOverInf = new Decimal(0);
	this.multiplier = new Decimal(1);
	this.cost = new Decimal(dimensionBaseCosts[i]);
	this.costMult = new Decimal(dimensionBaseCostMults[i]);
}

function getStartingAntimatter() {
	r = 10
	if(game.achievements.includes(9)) r = 100
	if(game.achievements.includes(22)) r = 1000
	if(game.achievements.includes(31)) r = 2e5
	if(game.achievements.includes(999)) r = 1e10
	if(game.achievements.includes(999)) r = 1e25
	return new Decimal(r);
}

function resetDimensions() {
	var antimatter = game.dimensions ? game.dimensions[0].amount : 10;
	game.dimensions = [];
	
	for(var i = 0; i <= 10; i++) {
		game.dimensions[i] = new NormalDimension(i);
	}
	
	game.dimensions[0].amount = getStartingAntimatter()
	if(false) game.dimensions[0].amount = new Decimal(antimatter) // do this later
	
	game.tickspeed = {bought: new Decimal(0), cost: new Decimal(1000), costMult: new Decimal(10)}
	
	game.sacrificeMult = new Decimal(1);
	
	if(inChallenge(3)) {
		game.dimensions.forEach(function(d) {d.costMult = d.costMult.multiply(100)});
	}
}

function getDimensionProduction(i) {
	var dim = game.dimensions[i];
	
	dim.multiplier = Decimal.pow(game.dimMult, dim.bought).divide(2**(dim.id-1));
	dim.multiplier = dim.multiplier.multiply(getAchievementMultiplier())
	
	dim.multiplier = dim.multiplier.multiply(getDimensionBoostEffect())
	
	dim.multiplier = dim.multiplier.multiply(getInfinityPowerEffect())
	if(i == 9) dim.multiplier = dim.multiplier.multiply(game.sacrificeMult)
	
	if(game.infinityUpgrades.includes(0)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(0))
	if(game.infinityUpgrades.includes(1)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(1))
	if(game.infinityUpgrades.includes(2) && i == 1) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(2))
	if(game.infinityUpgrades.includes(6)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(6))
	if(game.infinityUpgrades.includes(4) && i < 4) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(4))
	if(game.infinityUpgrades.includes(8) && i > 3 && i < 7) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(4))
	if(game.infinityUpgrades.includes(12) && i > 6) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(4))
	if(game.infinityUpgrades.includes(17)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(17))
	if(game.infinityUpgrades.includes(18)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(18))
	if(game.infinityUpgrades.includes(19)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(19))
	if(game.infinityUpgrades.includes(20)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(20))
	if(game.infinityUpgrades.includes(21)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(21))
	if(game.infinityUpgrades.includes(22)) dim.multiplier = dim.multiplier.multiply(getInfinityUpgradeEffect(22))
	
	if(i == 9 && game.achievements.includes(17)) dim.multiplier = dim.multiplier.multiply(1.09);
	if(i !== 9 && game.achievements.includes(24)) dim.multiplier = dim.multiplier.multiply(1.08);
	if(game.achievements.includes(33)) dim.multiplier = dim.multiplier.multiply(dim.bought)
	
	if(inChallenge(1) && i == 1) dim.multiplier = dim.multiplier.divide(Number.MAX_VALUE).max(1);
	if(inChallenge(7) && i == 9) dim.multiplier = dim.multiplier.multiply(getTickPower().pow(game.tickspeed.bought.multiply(7)));
	
	if(inChallenge(4, 1)) dim.multiplier = dim.multiplier.pow(0.5 + (game.lastBoughtDimension == i) * 0.4);

	return dim.amount.multiply(dim.multiplier);
}

function canBuyDimension(i) {
	return i <= game.shifts + 4 && game.dimensions[i].cost.lte(game.dimensions[0].amount) && !atInfinity()
}

function buyDimension(i) {
	var dim = game.dimensions[i];
	
	//if(dim.cost.gt(Number.MAX_VALUE)) return maxDimension(i);
	
	if(!canBuyDimension(i)) return;
	game.dimensions[0].amount = game.dimensions[0].amount.subtract(dim.cost);
	if(inChallenge(9) || inChallenge(5, 1)) suffer(i);
	if(inChallenge(4, 1)) game.lastBoughtDimension = i;
	
	dim.amount = dim.amount.add(1);
	dim.bought = dim.bought.add(1);
	
	dim.cost = dim.cost.multiply(dim.costMult);
	if(dim.cost.divide(dim.costMult).gt(Number.MAX_VALUE)) dim.costMult = dim.costMult.multiply(game.dimCostMultIncrease);
	
	game.buyTime = Date.now();
	giveAchievement(i - 1)
	if(i == 9) game.heretic = true;
	
	return true;
}

function maxDimension(i, b) {
	var dim = game.dimensions[i];
	
	if(!canBuyDimension(i)) return;
	game.buyTime = Date.now();
	giveAchievement(i - 1)
	if(i == 9) game.heretic = true;
	
	if(dim.cost.lte(Number.MAX_VALUE)) {
		var bought = game.dimensions[0].amount.min(Number.MAX_VALUE).log10().subtract(dim.cost.log10()).divide(dim.costMult.log10()).ceil()
		
		dim.amount = dim.amount.add(bought);
		dim.bought = dim.bought.add(bought);
		dim.cost = dim.cost.multiply(dim.costMult.pow(bought));
		
		return bought.gt(0);
	}
	
	// Superbuying
	
	if(game.dimensions[0].amount.layer >= 3) {
		dim.cost = game.dimensions[0].amount;
		dim.bought = dim.cost.log10().sqrt();
		dim.amount = Decimal.max(dim.amount, dim.bought);
		return true;
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
	
	dim.amount = dim.amount.add(x);
	dim.bought = dim.bought.add(x);
	
	dim.cost = newCost.multiply(newMult);
	dim.costMult = newMult.multiply(game.dimCostMultIncrease);
	
	return true;
}

function maxAll() {
	for(var i = 1; i < 10; i++) maxDimension(i);
	maxTickspeed();
}

function getSacrificeMult() {
	if(game.dimensions[1].amount.eq(0)) return new Decimal(1)
	if(inChallenge(8)) return game.dimensions[1].amount.pow(0.05);
	var r = game.dimensions[1].amount.log10().pow(2+game.achievements.includes(18)*0.2);
	
	if(challengeCompleted(2, 1)) {
		var power = 0.01;
		if(game.achievements.includes(18)) power += 0.001;
		r = game.dimensions[1].amount.pow(power); // this is for later (ICs or something)
	}
	
	return r;
}

function getSacrificeGain() {
	return getSacrificeMult().divide(game.sacrificeMult).max(1);
}

function sacrifice() {
	var sm = getSacrificeMult();
	if(inChallenge(8)) resetDimensions();
	if(game.dimensions[9].amount.eq(0)) giveAchievement(16)
	game.sacrificeMult = sm.max(game.sacrificeMult)
	for(var i = 1; i < 9; i++) game.dimensions[i].amount = game.dimensions[i].bought;
	return true
}