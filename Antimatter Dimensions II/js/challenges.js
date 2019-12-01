function inChallenge(i, j=0) {
	if(!game.challenges) return;
	
	// if(i == 5 && j == 1) return false;
	
	if(!i) return game.challengesRunning.length;
	
	if(i < 7 && j == 0 && inChallenge(1, 1)) return true;
	
	return game.challengesRunning.includes(i + j * 12);
}

function getChallengeSet() {
	var r = 0;
	for(var j = 0; j < 6; j++) for(var i = 1+j*12; i <= 12+j*12; i++) if(game.challengesRunning.includes(i)) r = j+1;
	return r;
}

function startChallenge(i, j=0) {
	if(!challengeUnlocked(i, j)) return;
	
	game.challengesRunning = i ? [i + j * 12] : []
	
	if(j < 2) bigCrunch(true);
	if(j == 3) eternity(true);
	
	if(!j) game.galaxies = new Decimal(0);
}

function exitChallenge() {
	cs = getChallengeSet();
	
	// Exit one layer at a time, starting with the lowest.
	
	for(var i = 0; i < cs; i++) {
		exited = false;
		for(var j = 1; j <= 12; j++) {
			if(game.challengesRunning.includes(j + i * 12)) {
				game.challengesRunning.splice(game.challengesRunning.indexOf(j + i * 12), 1)
				exited = true;
				if(i < 2) bigCrunch(true);
				if(i == 3) eternity(true);
			}
		}
		if(exited) return;
	}
	
	selectChallenge(-1);
}

var layerNames = ["", "Infinity ", "Eternity ", "Reality ", "Quantum ", "Omnipotence ", "Oblivion "]

function updateChallengeDescriptions() {
	challengeDescriptions = [
		`Return to the Antimatter Universe.`,

		`The first dimension multiplier is divided by ${game.break?shortenMoney(Number.MAX_VALUE):"Infinity"}.<br><br>Reward: First Dimension autobuyer.`,
		`Dimension upgrade multiplier is reduced by 20%.<br><br>Reward: Second Dimension autobuyer.`,
		`All dimension cost multipliers are 100x higher.<br><br>Reward: Third Dimension autobuyer.`,
		`Production is greatly decreased but slowly increases over time up to 100%, resetting when you buy anything.<br><br>Reward: Fourth Dimension autobuyer.`,
		`Production slowly decreases over time down to 1%, resetting on shift, boost, or galaxy.<br><br>Reward: Fifth Dimension autobuyer.`,
		`All dimension multipliers are divided by the logarithm of the amount of sixth dimensions.<br><br>Reward: Sixth Dimension autobuyer.`,
		`Tickspeed upgrades are more powerful, but tickspeed only affects ninth dimensions.<br><br>Reward: Seventh Dimension autobuyer.`,
		`Dimension boosts and galaxies are disabled. Sacrifice resets everything but is immensely more powerful.<br><br>Reward: Eighth Dimension autobuyer.`,
		`Buying anything increases the cost of all upgrades of equal cost.<br><br>Reward: Ninth Dimension autobuyer.`,
		`Each dimension produces the one two below it. Tickspeed upgrades are stronger to compensate.<br><br>Reward: Tickspeed autobuyer.`,
		`Dimension shifts are disabled. Dimension boosts and antimatter galaxies cost fourth dimensions.<br><br>Reward: Dimension Boost autobuyer.`,
		`You start without any galaxies.<br><br>Reward: Antimatter Galaxy autobuyer.`,
		
		`Challenges 1-6 are all applied at once.ICDATAReward: 1.47x on all infinity dimensions for each infinity challenge completed.`,
		`You are forced to do a dimensional sacrifice every tick.ICDATAReward: Dimensional sacrifice is much stronger and unlocks dimensional sacrifice autobuyer.`,
		`Antimatter galaxies add to the tickspeed multiplier instead of multiplying.ICDATAReward: Add ${getChallengeReward(3, 1)} to the final tickspeed multiplier per antimatter galaxy.`,
		`All dimension multipliers are reduced. Reduction is greater if a dimension is not the most recent one upgraded. ICDATAReward: Dimension upgrade multiplier is 50% stronger.`,
		`Upgrading a dimension increases the cost of all other upgrades of equal or lesser cost.ICDATAReward: Galaxies are 10% more powerful.`,
		`Production starts at 100% but drops extremely quickly, resetting on shift, boost, or galaxy.ICDATAReward: Infinity Dimensions are affected by tickspeed^0.01.`,
		`Antimatter galaxies are disabled, but dimension boosts are twice as effective.ICDATAReward: Dimension boost multiplier is 150% stronger.`,
		`Dimension multipliers 1-8 are divided by ${shorten(infp())}^tier.ICDATAReward: Multiplier to dimensions 1-8 based on 9th dimension multiplier.`,
		`All Infinity Challenge rewards are disabled.ICDATAReward: Your achievement multiplier affects infinity dimensions.`,
		`Dimension boosts and dimensional sacrifice are disabled.ICDATAReward: Multiplier to Infinity Dimensions based on infinities.`,
		`Dimension multipliers are reduced based on tier.ICDATAReward: Break Infinity upgrade 8 is stronger.`,
		`Infinity Power is 33% weaker.ICDATAReward: Infinity Shifts are ???% stronger.`,
	]
	
	for(var i = 13; i < 25; i++) {
		challengeDescriptions[i] = challengeDescriptions[i].replace(`ICDATA`, `<br><br>Goal: ${shortenCosts(icGoals[i - 13])} antimatter<br><br>`)
		if(getInfinityChallengesUnlocked() < i - 12) challengeDescriptions[i] = `Requires ${shortenCosts(icRequirements[i - 13])} antimatter`;
	}
	
	var i = [], t = []
	
	for(var c = 1; c <= getChallengeSet() * 12; c++) {
		if(inChallenge(c)) {
			var a = layerNames[Math.ceil(c / 12 - 1)] + "Challenge " + ((c-1)%12+1);
			// console.log(a)
			if(c > getChallengeSet() * 12 - 12) i.push(a);
			else t.push(a);
		}
	}
	
	function p(p) {
		if(p.length < 2) return p[0] || "";
		else if(p.length == 2) return p[0] + " and " + p[1];
		else {
			var t = "";
			p.forEach(function(i) {
				var l = p.indexOf(i)
				t += i + (l == p.length - 2 ? ", and " : l == p.length - 1 ? "" : ", ");
			})
			return t;
		}
	}
	
	s = p(i) + (t.length > 0 ? ", and are trapped in " + p(t) : "")
	// console.log(t)
	
	if(i.length == 0) s = "the Antimatter Universe (no active challenges)"
	
	ge("activeChallenges").innerHTML = s;
	
	gc("challenge", function(e, i) {
		if(inChallenge(i, game.selectedChallengeType)) e.setAttribute("running", true);
		else e.removeAttribute("running");
		if(game.challenges[game.selectedChallengeType][i-1].completed) e.setAttribute("completed", true);
		else e.removeAttribute("completed");
		
		names = []
		for(var i in layerNames) {
			names[i] = layerNames[i].toLowerCase();
			e.removeAttribute(names[i].substring(0, names[i].length - 1))
		}
		if(game.selectedChallengeType) e.setAttribute(names[game.selectedChallengeType].substring(0, names[game.selectedChallengeType].length - 1), true)
	}, 1)

	if(selectedChallenge < 1) return;

	var i = selectedChallenge, j = game.selectedChallengeType;
	
	state = inChallenge(i+j*12) ? "Running" : game.challenges[j][i-1].completed ? "Completed" : challengeUnlocked(i, j) ? "Start" : "Locked"
	
	ge("challengeInfo").innerHTML = layerNames[j] + 
		"Challenge " + i + "<br><br><span id = 'challengeDescription'></span><br><br><button onmousedown = 'startChallenge(selectedChallenge, game.selectedChallengeType)' class = 'challengeButton challengeButton" + 
		state + "'>" + (i ? state : "Exit Challenge") + "</button>";
}

selectedChallenge = 0;

function scrollChallengesBy(n) {
	scrollChallengesTo(game.selectedChallengeType + n);
}

function getChallengeTypeCap() {
	return 0+!!getInfinityChallengesUnlocked()
}

function scrollChallengesTo(n) {
	game.selectedChallengeType = n;
	if(game.selectedChallengeType < 0) game.selectedChallengeType = 0;
	cap = getChallengeTypeCap();
	if(game.selectedChallengeType > cap) game.selectedChallengeType = cap;
	ge("selectedChallengeType").innerHTML = layerNames[game.selectedChallengeType] + "Challenges"
	selectChallenge(-1)
}

function selectChallenge(i) {
	if(i == -1) {
		return ge("challengeInfo").innerHTML = ""
	}
	
	selectedChallenge = i;
}

function getChallengeDivider(name = "dimension") {
	if(name !== "dimension") return 1;
	
	var c4 = inChallenge(4) ? Decimal.min(getTimeSince("buy") / 60000, 1).max(0.01).pow(-2) : 1;
	var c5 = inChallenge(5) ? Decimal.max(1 - getTimeSince("reset") / 300000, 0.01).pow(-2) : 1;
	var c6 = inChallenge(6) ? game.dimensions[6].amount.max(1).log10().max(1) : 1;
	var ic6 = inChallenge(6, 1) ? Decimal.pow(10, getTimeSince("reset") / 100) : 1;
	
	return Decimal.multiply(c4, c5).multiply(c6).multiply(ic6);
}

function getChallengeGoal() {
	if(getChallengeSet() == 1) return infp();
	if(getChallengeSet() == 2) return icGoals[game.challengesRunning[game.challengesRunning.length - 1] - 13]
}

function canCompleteChallenge() {
	return game.dimensions[0].amount.gt(getChallengeGoal());
}

function getChallengeCompletions(s=0) {
	var completions = 0;
	game.challenges[s].forEach(function(challenge) {if(challenge.completed) completions++;})
	return completions;
}

function getChallengeTimes(s=game.selectedChallengeType) {
	var sum = 0;
	for(var i = 0; i < 12; i++) {
		sum += game.challenges[s][i].completed ? game.challenges[s][i].bestTime : Infinity
	}
	return sum;
}

function suffer(n, a) {
	nc = n ? game.dimensions[n].cost : game.tickspeed.cost;
	for(var i = 1; i <= 9; i++) {
		if(i == n) continue;
		var dim = game.dimensions[i];
		if(inChallenge(5, 1) && dim.cost.lte(nc)) {
			dim.cost = game.dimensions[n].cost.max(dim.cost);
		}
		else if(dim.cost.eq(nc)) dim.cost = dim.cost.multiply(dim.costMult);
	}
	if(n && game.tickspeed.cost.eq(nc)) game.tickspeed.cost = game.tickspeed.cost.multiply(game.tickspeed.costMult);
}

var icRequirements = ["1e2000", "1e2500", "1e5000", "1e7750", "1e9000", "1e12500", "1e17000", "1e25000", "1e35000", "1e35000", "1e35000", "1e50000"]
var icGoals = ["1e1000", "1e1500", "1e2500", "1e3300", "1e4000", "1e5500", "1e6900", "1e3000", "1e15000", "1e17000", "1e8250", "1e21000"]

function getInfinityChallengesUnlocked() {
	var unl = 0;
	for(var i = 0; i < icRequirements.length; i++) {
		if(game.totalAntimatter.gte(icRequirements[i])) unl++;
	}
	return unl;
}

function challengeCompleted(i, j) {
	return game.challenges[j][i-1].completed && (j == 1 ? !inChallenge(9, 1) : true);
}

function challengeUnlocked(i, j) {
	switch(j) {
		case 0:
			return true;
		case 1:
			return getInfinityChallengesUnlocked() >= i;
	}
}

function getChallengeReward(i, j) {
	return [
		[
			"First Dimension Autobuyer",
			"Second Dimension Autobuyer",
			"Third Dimension Autobuyer",
			"Fourth Dimension Autobuyer",
			"Fifth Dimension Autobuyer",
			"Sixth Dimension Autobuyer",
			"Seventh Dimension Autobuyer",
			"Eighth Dimension Autobuyer",
			"Ninth Dimension Autobuyer",
			"Dimension Boost Autobuyer",
			"Antimatter Galaxy Autobuyer",
			"Tickspeed Autobuyer",
		],
		[
			100 ** (getChallengeCompletions(1) / 12),
			0,
			new Decimal(0.01),
			0,
			0,
			0,
			0,
			game.dimensions[9].multiplier.pow(0.1),
			0,
			game.infinities.pow(1/2),
		]
	][j][i-1]
}

function getChallengeBenefits() {
	let lines = []
	switch(game.selectedChallengeType) {
		case 0:
			text = "Your completions grant you access to ", dims = [], other = [], otherNames = ["dimension boost", "antimatter galaxy", "tickspeed"];
			for(var i = 0; i < 9; i++) if(game.challenges[0][i].completed) dims.push(i);
			for(var i = 9; i < 12; i++) if(game.challenges[0][i].completed) other.push(i);
			if(dims.length) {
				text += (dims.length<2?"the "+tierNames[dims[0]+1].toLowerCase():"") + " dimension autobuyer"
				if(dims.length > 1) {
					text += "s "
					for(var i = 0; i < dims.length; i++) 
						if(dims[i]+1) {
							text += (dims[i]+1)
							if(i < dims.length - 1) text += ((dims.length==2) || (i == dims.length - 2) ? " and " : ", ")
						}
				}
				
				if(other.length) {
					text += (dims.length+other.length>2?", ":" and ")
					for(var i = 0; i < other.length; i++) {
						if(!(c = i < other.length - 1) && other.length > 1) text += "and "
						if(other[i]) text += "the " + otherNames[other[i]-9] + " autobuyer";
						if(c) text += ", ";
						else text += "."
					}
				}
				else text += "."
			}
			else {
				for(var i = 0; i < other.length; i++) {
					if(!(c = i < other.length - 1) && other.length > 1) text += "and "
					if(other[i]) text += "the " + otherNames[other[i]-9] + " autobuyer";
					if(c) text += ", ";
					else text += "."
				}
			}
			if(text.length > 50) {
				lines.push(text);
				lines.push("");
				lines.push("");
			}
			break;
		case 1:
			if(getChallengeCompletions(1)) {
				lines.push("Your completions grant you access to: <br>")
				var t = [
					`${getChallengeReward(1, 1).toFixed(2)}x on all infinity dimensions.`,
					`Improved dimensional sacrifice formula.<br>Dimensional sacrifice autobuyer.`,
					`+${shorten(getChallengeReward(3, 1).multiply(getEffectiveGalaxies()))} to tickspeed multiplier from galaxies.`,
					`+50% to dimension upgrade multiplier.`,
					`+10% to galaxy effectiveness.`,
					`${shorten(getTickspeed("infinityDimension"))}x tickspeed for infinity dimensions.`,
					`+150% to dimension boost multiplier.`,
					`${shorten(getChallengeReward(8, 1))}x on dimensions 1-8.`,
					`${getAchievementMultiplier()}x on all infinity dimensions.`,
					`${shorten(getChallengeReward(10, 1))}x on all infinity dimensions.`,
					`Boost to infinity dimensions based on tier.`,
					`+???% Infinity Shift effectiveness.`,
				]
				for(var i = 1; i <= 12; i++) if(challengeCompleted(i, 1)) lines.push(t[i-1])
				if(inChallenge(9, 1)) lines.push("REWARDS DISABLED");
				lines.push("")
				lines.push("")
			}
			break;
	}
	return lines.join("<br>") + "Records" + getStatisticsDisplay("challenge")
}