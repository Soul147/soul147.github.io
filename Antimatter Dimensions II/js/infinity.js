var infinityUpgradeDescriptions = [
	"Multiplier on all dimensions based on total existence time<br>Currently: " + shorten(getInfinityUpgradeEffect(0)) + "x",
	"Multiplier on all dimensions based on time in this infinity<br>Currently: " + shorten(getInfinityUpgradeEffect(1)) + "x",
	"Multiplier for unspent infinity points on first dimensions<br>Currently: " + shorten(getInfinityUpgradeEffect(2)) + "x",
	"You start with the fourth and fifth dimensions unlocked",
	"Dimensions 1-3 gain a multiplier based on infinities<br>Currently: " + shorten(getInfinityUpgradeEffect(4)) + "x",
	"Dimension upgrade multiplier is 10% stronger",
	"Multiplier for unspent infinity points on all dimensions<br>Currently: " + shorten(getInfinityUpgradeEffect(6)) + "x",
	"You start with the sixth and seventh dimensions unlocked",
	"Dimensions 4-6 gain a multiplier based on infinities<br>Currently: " + shorten(getInfinityUpgradeEffect(4)) + "x",
	"Dimension boost multiplier is 25% stronger",
	"Infinity point generation based on fastest infinity",
	"You start with the eighth and ninth dimensions unlocked",
	"Dimensions 7-9 gain a multiplier based on infinities<br>Currently: " + shorten(getInfinityUpgradeEffect(4)) + "x",
	"Dimension boost cost increases by 25% less",
	"Infinity stat generation based on fastest infinity",
	"Antimatter galaxies are twice as effective",
	"Break Infinity",
	"Power up all dimensions based on total antimatter produced<br>Currently: " + shorten(getInfinityUpgradeEffect(17)) + "x",
	"Power up all dimensions based on current antimatter<br>Currently: " + shorten(getInfinityUpgradeEffect(18)) + "x",
	"Power up all dimensions based on ninth dimensions<br>Currently: " + shorten(getInfinityUpgradeEffect(19)) + "x",
	"Power up all dimensions based on infinities<br>Currently: " + shorten(getInfinityUpgradeEffect(20)) + "x",
	"Power up all dimensions based on challenge times<br>Currently: " + shorten(getInfinityUpgradeEffect(21)) + "x",
	"Power up all dimensions based on achievements<br>Currently: " + shorten(getInfinityUpgradeEffect(22)) + "x",
	"Dimensional Sacrifice is 1,000,000x stronger",
	"Dimension boost multiplier is 60% stronger",
	"Antimatter galaxies are 10% stronger",
	"Do nothing",
	"Waste 10 million IP",
	"Make this button green",
	"",
	"",
	"",
]

function atInfinity() {
	return !game.break && game.dimensions[0].amount.gte(Number.MAX_VALUE);
}

function gainedInfinityPoints() {
	return game.break ? game.dimensions[0].amount.pow(1/308).multiply(getInfinityPointMult()).divide(10).floor() : new Decimal(1);
}

function getInfinityPointMult() {
	return Decimal.pow(2, game.repeatInf[1].bought)
}

function bigCrunch() {
	if(game.dimensions[0].amount.lt(Number.MAX_VALUE)) return;
	
	if(!(game.bestInfinityTime < 60000 || game.break)) {
		showTab(lastTab);
		lastTab = null;
	}
	
	game.infinityPoints = game.infinityPoints.add(gainedInfinityPoints())
	game.infinities = game.infinities.add(1);
	if(getTimeSince("infinity") < game.bestInfinityTime) game.bestInfinityTime = getTimeSince("infinity")
	game.infinityTime = Date.now();
	game.bestIPRate = new Decimal(0);
	
	game.shifts = 0;
	game.boosts = new Decimal(0);
	game.galaxies = new Decimal(0);
	resetDimensions();
	resetInfinityDimensions();
}

var infinityUpgrades = [];

var infinityUpgradeCosts = "1,1,3,20,1,2,5,40,1,3,10,100,1,4,15,200,0,1e4,5e4,1e5,2e5,2e6,1e7,1e6,1e100,1e100,1e7,1e7,1e8,0,0,0".split(",");

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
	if(i !== 1 && game.repeatInf[i].bought > 7 - (i/2)) return false;
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
			return game.totalAntimatter.add(1).log10().pow(0.5).add(1);
		case 18:
			return game.dimensions[0].amount.add(1).log10().pow(0.75).add(1);
		case 19:
			return game.dimensions[9].amount.pow(1.5).add(1);
		case 20:
			return game.infinities.multiply(308).cbrt().add(1);
		case 21: 
			return 10000;
		case 22:
			return 10000;
	}
}

function resetInfinityUpgrades() {
	game.infinityUpgrades = []
	game.repeatInf = [
		{cost: new Decimal(1e10), costMult: new Decimal(10), bought: new Decimal(0)}, 
		{cost: new Decimal(10), costMult: new Decimal(10), bought: new Decimal(0)}, 
		{cost: new Decimal(1e5), costMult: new Decimal(1e5), bought: new Decimal(0)}
	]
}