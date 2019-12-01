function haveEternitied() {
	return game.eternities.gt(0);
}

function atEternity() {
	return game.infinityPoints.gte(getEternity());
}

function gainedEternityPoints() {
	return game.infinityPoints.add(gainedInfinityPoints()).pow(1/308).multiply(getEternityPointMult()).divide(10).floor();
}

function getEternityPointMult() {
	r = Decimal.pow(5, game.repeatEter[0])
	
	return r;
}

function getEternity() {
	if(getChallengeSet() == 3) return getChallengeGoal()
	return infp()
}

function eternity(force) {
	if(!atEternity() && !force) return;
	
	if(!haveEternitied()) {
		showTab("dimensions")
		showDimensionTab("time")
	}
	
	if(!force) {
		giveAchievement(67);
		
		game.eternityPoints = game.eternityPoints.add(gainedEternityPoints())
		var time = getTimeSince("eternity");
		game.eternities = game.eternities.add(1);
		if(time < game.bestEternityTime) game.bestEternityTime = getTimeSince("eternity")

		if(inChallenge() && getChallengeSet() == 3) {
			var c = game.challenges[2][(game.challengesRunning[0]-1)%12]
			c.completed = true;
			c.bestTime = Math.min(c.bestTime || Infinity, getTimeSince("eternity"));
			exitChallenge();
		}
	}
	
	if(!eternityMilestone("keepIT")) game.bestInfinityTime = Infinity;
	for(var i = (eternityMilestone("keepNC")+eternityMilestone("keepIC"))*12; i < 24; i++) game.challenges[Math.floor(i/12)][i%12].completed = false;
	if(eternityMilestone("iShift")) game.infinityShifts = 9;
	
	if(eternityMilestone("keepBI"));
	else if(eternityMilestone("keepIU")) game.infinityUpgrades = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
	else resetInfinityUpgrades();
	game.repeatInf = [
		{cost: new Decimal(10), costMult: new Decimal(10), bought: new Decimal(0)}, 
		{cost: new Decimal(1e10), costMult: new Decimal(10), bought: new Decimal(0)}, 
		{cost: new Decimal(1e10), costMult: new Decimal(1e10), bought: new Decimal(0)}
	]
	
	game.infinityTime = game.eternityTime = Date.now();
	game.bestIPRate = game.bestEPRate = new Decimal(0);
	game.infinityPoints = game.infinities = new Decimal(0);
	resetInfinityDimensions();
	game.shifts = getStartingShifts();
	game.boosts = new Decimal(0);
	game.galaxies = new Decimal(0);
	game.replicanti.galaxies = new Decimal(0);
	resetDimensions();
	
	return true;
}

function respecTimeStudies() {
	game.timestudy.theorems = getTotalTT();
	game.timestudy.studies = [];
	eternity();
}

var eternityUpgradeCosts = "20, 400, 5000, 6e4, 8e5".split(",");

function canBuyEternityUpgrade(i) {
	if(game.eternityUpgrades.includes(i)) return false;
	if(game.eternityPoints.lt(eternityUpgradeCosts[i])) return false;
	return true;
}

function buyEternityUpgrade(i) {
	if(!canBuyEternityUpgrade(i)) return;
	game.eternityPoints = game.eternityPoints.subtract(eternityUpgradeCosts[i]);
	game.eternityUpgrades.push(i);
}

function getEternityUpgradeEffect(n) {
	switch(n) {
		case 0:
			return game.eternityPoints.max(1);
		case 1:
			return game.eternities.pow(game.eternities.log10()).max(1);
		case 2:
			return Math.max(1e25 / getChallengeTimes(1) ** 4, 1)
		case 3:
			return game.infinityDimensions[9].bought.pow(10).max(1)
		case 4:
			return game.timeDimensions[0].amount.pow(0.5).max(1)
	}
}

function getEUDescriptions() {
	return [
		"Infinity Dimensions are multiplied by unspent EP<br>Currently: " + shortenMoney(getEternityUpgradeEffect(0)) + "x",
		"Infinity Dimensions get a multiplier based on eternitites<br>Currently: " + shortenMoney(getEternityUpgradeEffect(1)) + "x",
		"Infinity Dimensions get a multiplier based on IC times<br>Currently: " + shortenMoney(getEternityUpgradeEffect(2)) + "x",
		"Infinity Dimensions get a multiplier based on ninth IDs<br>Currently: " + shortenMoney(getEternityUpgradeEffect(3)) + "x",
		"Infinity Dimensions get a multiplier based on time shards<br>Currently: " + shortenMoney(getEternityUpgradeEffect(4)) + "x",
		"The first 2 infinity upgrades affect Time Dimensions<br>Currently: " + shortenMoney(getInfinityUpgradeEffect(23)) + "x",
	]
}

function resetEternityUpgrades() {
	game.eternityUpgrades = []
	game.repeatEter = [
		new Decimal(0),
	]
}

function getRepeatEterCost(i) {
	return new Decimal(["100"][i]).multiply(new Decimal(["100"][i]).pow(game.repeatEter[i]))
}

function canBuyRepeatEter(i) {
	return game.eternityPoints.gte(getRepeatEterCost(i));
}

function buyRepeatEter(i) {
	if(!canBuyRepeatEter(i)) return;
	if(i) {
		if(game.eternityPoints.lt(infp())) game.eternityPoints = game.eternityPoints.subtract(getRepeatEterCost(i));
		game.repeatEter[i] = game.repeatEter[i].add(1);
	}
	else {
		game.repeatEter[0] = game.eternityPoints.log10().divide(2).floor();
		if(game.eternityPoints.lt(infp())) game.eternityPoints = game.eternityPoints.subtract(Decimal.pow(100, game.eternityPoints.log10().divide(2).floor()))
	}
	return true;
}

var eternityMilestones = {
	keepNC: {req:   1, desc: "You start with all challenges completed"},
	ipMult: {req:   2, desc: "Unlock IP Multiplier autobuyer"},
	keepIU: {req:   3, desc: "You keep your infinity upgrades"},
	keepIT: {req:   5, desc: "You keep your best infinity time"},
	keepBI: {req:   8, desc: "You keep your break infinity upgrades"},
	keepIC: {req:  10, desc: "You start with all ICs completed"},
	iAuto1: {req:  11, desc: "Unlock Infinity Dimension autobuyer 1"},
	iAuto2: {req:  12, desc: "Unlock Infinity Dimension autobuyer 2"},
	iAuto3: {req:  13, desc: "Unlock Infinity Dimension autobuyer 3"},
	iAuto4: {req:  14, desc: "Unlock Infinity Dimension autobuyer 4"},
	iAuto5: {req:  15, desc: "Unlock Infinity Dimension autobuyer 5"},
	iAuto6: {req:  16, desc: "Unlock Infinity Dimension autobuyer 6"},
	iAuto7: {req:  17, desc: "Unlock Infinity Dimension autobuyer 7"},
	iAuto8: {req:  18, desc: "Unlock Infinity Dimension autobuyer 8"},
	iAuto9: {req:  19, desc: "Unlock Infinity Dimension autobuyer 9"},
	iShift: {req:  20, desc: "Unlock Infinity Shift autobuyer"},
	etAuto: {req: 100, desc: "Unlock Eternity autobuyer"},
	// repGal: {req: 200, desc: "Unlock Replicanti Galaxy autobuyer"},
	// repCha: {req: 300, desc: "Unlock Replicanti Chance autobuyer"},
	// repInt: {req: 500, desc: "Unlock Replicanti Interval autobuyer"},
	// repMax: {req: 1e3, desc: "Unlock Max Replicanti Galaxy autobuyer"},
}

function eternityMilestone(id) {
	return game.eternities.gte(eternityMilestones[id].req)
}

function getReplicantiChance() {
	
}