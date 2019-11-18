function atInfinity() {
	return !game.break && game.dimensions[0].amount.gte(infp());
}

function gainedInfinityPoints() {
	return game.break ? game.dimensions[0].amount.pow(1/308).multiply(getInfinityPointMult()).divide(10).floor() : new Decimal(1);
}

function getInfinityPointMult() {
	r = Decimal.pow(2, game.repeatInf[0].bought)
	
	if(game.achievements.includes(37)) r = r.multiply(2)
	
	return r;
}

function getInfinity() {
	if(getChallengeSet() == 2) return getChallengeGoal()
	return infp()
}

function bigCrunch(force) {
	if(game.dimensions[0].amount.lt(getInfinity()) && !force) return;
	
	if(!(game.bestInfinityTime < 60000 || game.break)) {
		showTab(lastTab);
		lastTab = null;
	}
	
	if(!force) {
		game.infinityPoints = game.infinityPoints.add(gainedInfinityPoints())
		var time = getTimeSince("infinity");
		if(gainedInfinityPoints().gt(1e200) && time < 2000) giveAchievement(64);
		if(gainedInfinityPoints().gt(infp())) giveAchievement(66);
		game.infinities = game.infinities.add(1);
		if(time < game.bestInfinityTime) game.bestInfinityTime = getTimeSince("infinity")
		
		giveAchievement(9)
		if(game.dimensions[9].bought.eq(0)) giveAchievement(24)
		if(!game.heretic && !inChallenge(10)) giveAchievement(25)
		if(game.galaxies.lt(3)) giveAchievement(23)
		if(game.tickspeed.bought.eq(0)) giveAchievement(29)
		if(game.galaxies.eq(0)) giveAchievement(34)
		if(game.dimensions[1].amount.eq(1)) giveAchievement(54)
	
		if(game.bestInfinityTime < 18e6) giveAchievement(22)
		if(game.bestInfinityTime < 36e5) giveAchievement(31)
		if(game.bestInfinityTime < 6e4) giveAchievement(40)
		if(game.bestInfinityTime < 1e3) giveAchievement(49)
		if(game.bestInfinityTime < 100) giveAchievement(58)
			
		if(game.shifts == 0 && game.boosts.eq(0) && game.galaxies.eq(0)) giveAchievement(42);
		
		game.heretic = false;

		if(inChallenge() && getChallengeSet() < 3) {
			var c = game.challenges[getChallengeSet()-1][(game.challengesRunning[0]-1)%12]
			c.completed = true;
			c.bestTime = Math.min(c.bestTime || Infinity, getTimeSince("infinity"));
			if(c.bestTime < 180000) giveAchievement(43)
			if(getChallengeTimes(0) < 180000) giveAchievement(44)
			if(getChallengeTimes(0) < 5000) giveAchievement(53)
			if(getChallengeTimes(1) < 6666) giveAchievement(62)
			if(inChallenge(1, 1)) giveAchievement(51);
			if(inChallenge(5, 1)) giveAchievement(52);
			if(inChallenge(5, 1) && c.bestTime < 1e4) giveAchievement(60);
			if(inChallenge(12, 1)) giveAchievement(61);
			exitChallenge();
		}
	}
	
	game.infinityTime = Date.now();
	if(game.bestIPRate.gt(1e303)) giveAchievement(68);
	game.bestIPRate = new Decimal(0);
	
	game.shifts = getStartingShifts();
	game.boosts = new Decimal(0);
	game.galaxies = new Decimal(game.infinityUpgrades.includes(11)+0);
	resetDimensions();
	return true;
}

var infinityUpgrades = [];

var infinityUpgradeCosts = "1,1,3,20,1,2,5,40,1,3,10,100,1,4,15,200,0,1e3,5e3,1e4,2e5,3e6,1e7,1e10,1e18,1e25,1e7,1e7,1e8,0,0,0".split(",");

function canBuyInfinityUpgrade(i) {
	if(game.infinityUpgrades.includes(i)) return false;
	if(game.infinityPoints.lt(infinityUpgradeCosts[i])) return false;
	if(i % 16 > 3 && !game.infinityUpgrades.includes(i - 4) && i < 16) return false;
	return true;
}

function buyInfinityUpgrade(i) {
	if(!canBuyInfinityUpgrade(i)) return;
	game.infinityPoints = game.infinityPoints.subtract(infinityUpgradeCosts[i]);
	game.infinityUpgrades.push(i);
}

function getRepeatInfCost(i) {
	return game.repeatInf[i].cost.multiply(game.repeatInf[i].costMult.pow(game.repeatInf[i].bought))
}

function canBuyRepeatInf(i) {
	if(i && game.repeatInf[i].bought > 6 - (i-1)*2) return false;
	return game.infinityPoints.gte(getRepeatInfCost(i));
}

function buyRepeatInf(i) {
	if(!canBuyRepeatInf(i)) return;
	if(i) {
		game.infinityPoints = game.infinityPoints.subtract(getRepeatInfCost(i));
		game.repeatInf[i].bought = game.repeatInf[i].bought.add(1);
	}
	else {
		game.repeatInf[0].bought = game.infinityPoints.log10().floor();
		game.infinityPoints = game.infinityPoints.subtract(Decimal.pow(10, game.infinityPoints.log10().floor()))
	}
}

function getInfinityUpgradeEffect(n) {
	switch(n) {
		case 0:
			return Math.pow(getTimeSince("start") / 60000, 0.1)+1;
		case 1:
			return Math.pow(getTimeSince("infinity") / 60000, 0.25)+1
		case 2:
			return game.infinityPoints.divide(2).pow(1.25).add(1);
		case 4:
			return game.infinities.multiply(0.2).add(1)
		case 6:
			return game.infinityPoints.divide(9).pow(0.25).add(1);
		case 10: 
			return 0.1 / game.bestInfinityTime;
		case 17:
			return game.dimensions[0].amount.add(1).log10().pow(0.75).add(1);
		case 18:
			return game.totalAntimatter.add(1).log10().pow(0.75).add(1);
		case 19:
			return game.dimensions[9].amount.pow(1.5).add(1).multiply(game.achievements.includes(47)?Math.PI:1);
		case 20:
			return game.infinities.multiply(308).sqrt().add(1);
		case 21: 
			return Math.max(1e9 / getChallengeTimes(0), 1);
		case 22:
			return Decimal.tetrate(Math.log10(game.achievements.length+1)+1, 3);
		case 23: 
			return getInfinityUpgradeEffect(0) * getInfinityUpgradeEffect(1)
		case 25: 
			return game.galaxies.add(1).pow(3).max(1);
	}
}

function resetInfinityUpgrades() {
	game.infinityUpgrades = []
	game.repeatInf = [
		{cost: new Decimal(10), costMult: new Decimal(10), bought: new Decimal(0)}, 
		{cost: new Decimal(1e10), costMult: new Decimal(10), bought: new Decimal(0)}, 
		{cost: new Decimal(1e10), costMult: new Decimal(1e10), bought: new Decimal(0)}
	]
}

function canBreakInfinity() {
	return getChallengeCompletions() > 10
}

function breakInfinity() {
	if(!canBreakInfinity()) return;
	game.break = !game.break;
}