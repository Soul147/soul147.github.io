function inChallenge(i, j=0) {
	if(!i) return game.challengesRunning.length;
	
	// Note to self: Put checks for challenge traps in here, not in startChallenge
	
	return game.challengesRunning.includes(i + j * 12);
}

function getChallengeSet() {
	var r = 0;
	for(var j = 0; j < 6; j++) for(var i = 1+j*12; i <= 12+j*12; i++) if(game.challengesRunning.includes(i)) r = j+1;
	return r;
}

function startChallenge(i, j=0) {
	game.challengesRunning = i ? [i + j * 12] : []
	
	if(j < 2) bigCrunch(true);
	if(j == 3) eternity(true);
	
	if(!j) game.galaxies = new Decimal(0);
	
	selectChallenge(0);
}

function exitChallenge() {
	cs = getChallengeSet();
	
	// Exit one layer at a time, starting with the lowest.
	
	for(var i = 0; i < cs; i++) {
		exited = false;
		for(var j = 0; j < 12; j++) {
			if(game.challengesRunning.includes(j + i * 12)) {
				game.challengesRunning.splice(game.challengesRunning.indexOf(j + i * 12), 1)
				exited = true;
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
		`Dimension shifts are disabled. Dimension boosts and antimatter galaxies cost fourth dimensions.<br><br>Reward: Dimension Boost autobuyer.`,
		`You start without any galaxies.<br><br>Reward: Antimatter Galaxy autobuyer.`,
		`Each dimension produces the one two below it. Tickspeed upgrades are stronger to compensate.<br><br>Reward: Tickspeed autobuyer.`,
	]
	
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
		if(inChallenge(i, selectedChallengeType)) e.setAttribute("running", true);
		else e.removeAttribute("running");
		
		names = []
		for(var i in layerNames) {
			names[i] = layerNames[i].toLowerCase();
			e.removeAttribute(names[i].substring(0, names[i].length - 1))
		}
		if(selectedChallengeType) e.setAttribute(names[selectedChallengeType].substring(0, names[selectedChallengeType].length - 1), true)
	}, 1)
}

selectedChallenge = selectedChallengeType = 0;

function scrollChallengesBy(n) {
	scrollChallengesTo(selectedChallengeType + n);
}

function scrollChallengesTo(n) {
	selectedChallengeType = n;
	if(selectedChallengeType < 0) selectedChallengeType = 0;
	cap = 0;
	if(selectedChallengeType > cap) selectedChallengeType = cap;
	ge("selectedChallengeType").innerHTML = layerNames[selectedChallengeType] + "Challenges"
	selectChallenge(-1)
}

function selectChallenge(i) {
	if(i == -1) {
		return ge("challengeInfo").innerHTML = ""
	}
	
	var j = selectedChallengeType;
	selectedChallenge = i;
	
	state = i ? (inChallenge(i+j*12) ? "Running" : game.challenges[j][i-1].completed ? "Completed" : game.challenges[j][i-1].locked ? "Locked" : "Start") : "Start"
	
	ge("challengeInfo").innerHTML = layerNames[j] + 
		"Challenge " + i + "<br><br><span id = 'challengeDescription'></span><br><br><button onclick = 'startChallenge(selectedChallenge)' class = 'challengeButton challengeButton" + 
		state + "'>" + (i ? state : "Exit Challenge") + "</button>";
}

function getChallengeMultiplier(name = "dimension") {
	if(name !== "dimension") return;
	
	var c4 = inChallenge(4) ? Decimal.min(getTimeSince("buy") / 60000, 1).max(0.01).pow(2) : 1;
	var c5 = inChallenge(5) ? Decimal.max(1 - getTimeSince("reset") / 300000, 0.01).pow(2) : 1;
	var c6 = inChallenge(6) ? game.dimensions[6].amount.max(1).log10().max(1).pow(-1) : 1;
	
	return Decimal.multiply(c4, c5).multiply(c6);
}

function suffer(n) {
	nc = n ? game.dimensions[n].cost : game.tickspeed.cost;
	for(var i = 1; i <= 9; i++) {
		if(i == n) continue;
		var dim = game.dimensions[i];
		if(dim.cost.eq(nc)) dim.cost = dim.cost.multiply(dim.costMult);
	}
	if(n && game.tickspeed.cost.eq(nc)) game.tickspeed.cost = game.tickspeed.cost.multiply(game.tickspeed.costMult);
}