function atInfinity() {
	return !game.break && game.dimensions[0].amount.gte(Number.MAX_VALUE);
}

function gainedInfinityPoints() {
	return game.break ? game.dimensions[0].amount.pow(1/308).multiply(getInfinityPointMult()).divide(10).floor() : new Decimal(1);
}

function getInfinityPointMult() {
	return Decimal.pow(2, game.repeatInf[1].bought)
}

function getInfinity() {
	if(getChallengeSet() == 2) return getChallengeGoal()
	return Number.MAX_VALUE
}

function bigCrunch(force) {
	if(game.dimensions[0].amount.lt(getInfinity()) && !force) return;
	
	if(!(game.bestInfinityTime < 60000 || game.break)) {
		showTab(lastTab);
		lastTab = null;
	}
	
	if(!force) {
		game.infinityPoints = game.infinityPoints.add(gainedInfinityPoints())
		game.infinities = game.infinities.add(1);
		if(getTimeSince("infinity") < game.bestInfinityTime) game.bestInfinityTime = getTimeSince("infinity")
		
		giveAchievement(9)
		if(!game.heretic && !inChallenge(10)) giveAchievement(19)
		if(game.bestInfinityTime < 3600000) giveAchievement(22)
		if(game.bestInfinityTime < 60000) giveAchievement(31)
		if(game.bestInfinityTime < 1000) giveAchievement(40)
		game.heretic = false;

		if(inChallenge() && getChallengeSet() < 3) {
			var c = game.challenges[getChallengeSet()-1][(game.challengesRunning[0]-1)%12]
			c.completed = true;
			c.bestTime = Math.min(c.bestTime || Infinity, getTimeSince("infinity"));
			if(c.bestTime < 180000) giveAchievement(29)
			exitChallenge();
		}
		
		if(getChallengeCompletions() > 0) giveAchievement(23);
		if(game.challenges[0][9].completed) giveAchievement(24);
		if(getChallengeCompletions() > 11) giveAchievement(25);
	}
	
	game.infinityTime = Date.now();
	game.bestIPRate = new Decimal(0);
	
	game.shifts = getStartingShifts();
	game.boosts = new Decimal(0);
	game.galaxies = new Decimal(game.infinityUpgrades.includes(11)+0);
	resetDimensions();
}

var infinityUpgrades = [];

var infinityUpgradeCosts = "1,1,3,20,1,2,5,40,1,3,10,100,1,4,15,200,0,1e3,5e3,1e4,2e5,5e7,1e12,1e20,1e100,1e100,1e7,1e7,1e8,0,0,0".split(",");

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
	if(i !== 1 && game.repeatInf[i].bought > 6 - i) return false;
	return game.infinityPoints.gte(getRepeatInfCost(i));
}

function buyRepeatInf(i) {
	if(!canBuyRepeatInf(i)) return;
	if(i == 1) {
		game.repeatInf[1].bought = game.infinityPoints.log10().floor();
		game.infinityPoints = game.infinityPoints.subtract(Decimal.pow(10, game.infinityPoints.log10().floor()))
	}
	else {
		game.infinityPoints = game.infinityPoints.subtract(getRepeatInfCost(i));
		game.repeatInf[i].bought = game.repeatInf[i].bought.add(1);
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
			return game.dimensions[9].amount.pow(1.5).add(1);
		case 20:
			return game.infinities.multiply(308).sqrt().add(1);
		case 21: 
			return Math.max(1e9 / getChallengeTimes(), 1);
		case 22:
			return game.achievements.length ** (Math.log10(game.achievements.length+1)+1);
	}
}

function resetInfinityUpgrades() {
	game.infinityUpgrades = []
	game.repeatInf = [
		{cost: new Decimal(1e10), costMult: new Decimal(10), bought: new Decimal(0)}, 
		{cost: new Decimal(10), costMult: new Decimal(10), bought: new Decimal(0)}, 
		{cost: new Decimal(1e10), costMult: new Decimal(1e10), bought: new Decimal(0)}
	]
}

function breakInfinity() {
	if(getChallengeCompletions() < 10) return;
	game.break = !game.break;
}