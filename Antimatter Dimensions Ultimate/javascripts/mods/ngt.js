function gainedOP() {
	return Decimal.pow(10, player.eternityPoints.plus(gainedEternityPoints()).e/(308)).times(player.mods.ngt.opMult || 1).divide(10).floor();
}

const omReqList = ["10", "100", "1e5", "1e10", "1e20", "1e33", "1e50", "1e10000", "1e1000000"]

function omniMilestoneReq(n) {
	return new Decimal(omReqList[n])
}

function omniMilestoneReached(n) {
	return player.mods.ngt.op.gte(omniMilestoneReq(n))
}

function omnipotenceReset(force, auto) {
	if(!ngt.omni) setTimeout(function() {
		$("#dimensionsbtn").notify("New Dimension Unlocked", "success");
		$("#eternitystorebtn").notify("New Time Studies Unlocked", "success");
	}, 10000);
	
	if(player.eternityPoints.add(gainedEternityPoints()).lt(1e308) && !(force || ocGoalMet(currentOC()))) return;
	
	out = inOC() && ocGoalMet(ngt.ocr[0]) && !force
	if(out && !player.mods.ngt.oc.includes(currentOC())) {
		player.mods.ngt.oc.push(currentOC())
		return exitOmniChallenge()
	}
	
	if((ngt.thisOmni > 600 || out || force) && !auto) dev.omniAnim(5 - !!player.mods.ngt.omni*4);
	if(!force) player.mods.ngt.omni++;
	if(!force) player.mods.ngt.op = player.mods.ngt.op.add(gainedOP());
	if(!force) player.mods.ngt.lastRun = gainedOP();
	
	if (player.tickspeedBoosts !== undefined) player.tickspeedBoosts = 0
	if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25);
	else player.infinityPoints = new Decimal(0);
	player = {
		money: new Decimal(10),
		tickSpeedCost: new Decimal(1000),
		tickspeed: new Decimal(player.achievements.includes("r26")&&player.mods.ac?100:player.aarexModifications.newGameExpVersion?500:1000),
		tickBoughtThisInf: resetTickBoughtThisInf(),
		firstCost: new Decimal(10),
		secondCost: new Decimal(100),
		thirdCost: new Decimal(10000),
		fourthCost: new Decimal(1000000),
		fifthCost: new Decimal(1e9),
		sixthCost: new Decimal(1e13),
		seventhCost: new Decimal(1e18),
		eightCost: new Decimal(1e24),
		firstAmount: new Decimal(0),
		secondAmount: new Decimal(0),
		thirdAmount: new Decimal(0),
		fourthAmount: new Decimal(0),
		firstBought: 0,
		secondBought: 0,
		thirdBought: 0,
		fourthBought: 0,
		fifthAmount: new Decimal(0),
		sixthAmount: new Decimal(0),
		seventhAmount: new Decimal(0),
		eightAmount: new Decimal(0),
		fifthBought: 0,
		sixthBought: 0,
		seventhBought: 0,
		eightBought: 0,
		totalBoughtDims: resetTotalBought(),
		firstPow: new Decimal(1),
		secondPow: new Decimal(1),
		thirdPow: new Decimal(1),
		fourthPow: new Decimal(1),
		fifthPow: new Decimal(1),
		sixthPow: new Decimal(1),
		seventhPow: new Decimal(1),
		eightPow: new Decimal(1),
		sacrificed: new Decimal(0),
		achievements: player.achievements,
		challenges: [],
		currentChallenge: "",
		infinityUpgrades: omniMilestoneReached(0) ? player.infinityUpgrades : [],
		setsUnlocked: player.setsUnlocked,
		infinityPoints: player.infinityPoints,
		infinitied: 0,
		infinitiedBank: omniMilestoneReached(4) ? player.infinitiedBank + player.infinitied * 0.05 : 0,
		totalTimePlayed: player.totalTimePlayed,
		bestInfinityTime: 9999999999,
		thisInfinityTime: 0,
		resets: omniMilestoneReached(0) ? 4 : 0,
		dbPower: player.dbPower,
		tickspeedBoosts: player.tickspeedBoosts,
		galaxies: omniMilestoneReached(0) ? 1 : 0,
		galacticSacrifice: resetGalacticSacrifice(),
		totalmoney: player.totalmoney,
		interval: null,
		lastUpdate: player.lastUpdate,
		achPow: player.achPow,
		autobuyers: player.autobuyers,
		partInfinityPoint: 0,
		partInfinitied: 0,
		break: player.break,
		costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
		tickspeedMultiplier: new Decimal(10),
		chall2Pow: 1,
		chall3Pow: new Decimal(0.01),
		newsArray: player.newsArray,
		matter: new Decimal(0),
		chall11Pow: new Decimal(1),
		challengeTimes: player.challengeTimes,
		infchallengeTimes: player.infchallengeTimes,
		lastTenRuns: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
		lastTenEternities: [[600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)], [600*60*24*31, new Decimal(0)]],
		infMult: new Decimal(1),
		infMultCost: new Decimal(10),
		tickSpeedMultDecrease: omniMilestoneReached(1) ? player.tickSpeedMultDecrease : GUBought("gb4") ? 1.25 : 10,
		tickSpeedMultDecreaseCost: omniMilestoneReached(1) ? player.tickSpeedMultDecreaseCost : 3e6,
		dimensionMultDecrease: omniMilestoneReached(1) ? player.dimensionMultDecrease : 10,
		dimensionMultDecreaseCost: omniMilestoneReached(1) ? player.dimensionMultDecreaseCost : 1e8,
		extraDimPowerIncrease: omniMilestoneReached(1) ? player.extraDimPowerIncrease : 0,
		dimPowerIncreaseCost: omniMilestoneReached(1) ? player.dimPowerIncreaseCost : 1e3,
		version: player.version,
		postC4Tier: 1,
		postC8Mult: new Decimal(1),
		overXGalaxies: player.overXGalaxies,
		overXGalaxiesTickspeedBoost: player.tickspeedBoosts == undefined ? player.overXGalaxiesTickspeedBoost : 0,
		spreadingCancer: player.spreadingCancer,
		postChallUnlocked: (player.achievements.includes("r133")) ? 8 : 0,
		postC4Tier: 0,
		postC3Reward: new Decimal(1),
		eternityPoints: new Decimal(0),
		eternities: 100,
		eternitiesBank: omniMilestoneReached(6) ? (player.eternitiesBank || 0) + player.eternities * 0.05 : 0,
		thisEternity: 0,
		bestEternity: player.bestEternity,
		eternityUpgrades: omniMilestoneReached(2) ? player.eternityUpgrades : [],
		epmult: new Decimal(1),
		epmultCost: new Decimal(500),
		infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
		infinityPower: new Decimal(1),
		infinityDimension1 : {
			cost: new Decimal(1e8),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension2 : {
			cost: new Decimal(1e9),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension3 : {
			cost: new Decimal(1e10),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension4 : {
			cost: new Decimal(1e20),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension5 : {
			cost: new Decimal(1e140),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension6 : {
			cost: new Decimal(1e200),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension7 : {
			cost: new Decimal(1e250),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infinityDimension8 : {
			cost: new Decimal(1e280),
			amount: new Decimal(0),
			bought: 0,
			power: new Decimal(1),
			baseAmount: 0
		},
		infDimBuyers: player.infDimBuyers,
		timeShards: new Decimal(0),
		tickThreshold: new Decimal(1),
		totalTickGained: 0,
		timeDimension1: {
			cost: new Decimal(1),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension2: {
			cost: new Decimal(5),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension3: {
			cost: new Decimal(100),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension4: {
			cost: new Decimal(1000),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension5: {
			cost: new Decimal("1e2350"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension6: {
			cost: new Decimal("1e2650"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension7: {
			cost: new Decimal("1e3000"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		timeDimension8: {
			cost: new Decimal("1e3350"),
			amount: new Decimal(0),
			power: new Decimal(1),
			bought: 0
		},
		offlineProd: omniMilestoneReached(1) ? player.offlineProd : 0,
		offlineProdCost: omniMilestoneReached(1) ? player.offlineProdCost : 1e7,
		challengeTarget: 0,
		autoSacrifice: player.autoSacrifice,
		replicanti: {
			amount: new Decimal(1),
			unl: true,
			chance: 0.01,
			chanceCost: new Decimal(1e150),
			interval: 1000,
			intervalCost: new Decimal(1e140),
			gal: 0,
			galaxies: 0,
			galCost: new Decimal(1e170),
			galaxybuyer: player.replicanti.galaxybuyer,
			auto: player.replicanti.auto
		},
		timestudy: omniMilestoneReached(4) ? player.timestudy : {
			theorem: 0,
			amcost: new Decimal("1e20000"),
			ipcost: new Decimal(1),
			epcost: new Decimal(1),
			studies: [],
		},
		eternityChalls: omniMilestoneReached(5) ? player.eternityChalls : {},
		eternityChallGoal: new Decimal(Number.MAX_VALUE),
		currentEternityChall: "",
		eternityChallUnlocked: 0,
		etercreq: 0,
		autoIP: new Decimal(0),
		autoTime: 1e300,
		infMultBuyer: player.infMultBuyer,
		autoCrunchMode: player.autoCrunchMode,
		autoEterMode: player.autoEterMode,
		peakSpent: player.masterystudies ? 0 : undefined,
		respec: false,
		respecMastery: player.masterystudies ? false : undefined,
		eternityBuyer: player.eternityBuyer,
		eterc8ids: 50,
		eterc8repl: 40,
		dimlife: true,
		dead: true,
		dilation: {
			studies: omniMilestoneReached(7) ? player.dilation.studies : [],
			active: false,
			tachyonParticles: player.achievements.includes("ng3p37") ? player.dilation.bestTP.sqrt() : new Decimal(0),
			dilatedTime: new Decimal(0),
			totalTachyonParticles: new Decimal(0),
			bestTP: player.dilation.bestTP,
			nextThreshold: new Decimal(1000),
			freeGalaxies: 0,
			upgrades: omniMilestoneReached(7) ? player.dilation.upgrades : [],
			rebuyables: {
				1: 0,
				2: 0,
				3: 0,
				4: player.meta ? 0 : undefined,
			}
		},
		why: player.why,
		options: player.options,
		meta: player.meta,
		masterystudies: player.masterystudies ? (omniMilestoneReached(8) ? player.masterystudies : []) : undefined,
		autoEterOptions: player.autoEterOptions,
		galaxyMaxBulk: player.galaxyMaxBulk,
		quantum: player.quantum ? player.quantum : undefined,
		old: player.masterystudies ? inQC(0) : undefined,
		dontWant: player.masterystudies ? true : undefined,
		aarexModifications: player.aarexModifications,
		mods: player.mods
	};
	if (player.challenges.includes("challenge1")) player.money = new Decimal(100)
	if (player.achievements.includes("r37")) player.money = new Decimal(1000)
	if (player.achievements.includes("r54")) player.money = new Decimal(2e5)
	if (player.achievements.includes("r55")) player.money = new Decimal(1e10)
	if (player.achievements.includes("r78")) player.money = new Decimal(1e25)
	player.challenges=challengesCompletedOnEternity()
	setInitialDimensionPower()
	updatePowers()
	player.replicanti.amount = new Decimal(1)
	player.replicanti.galaxies = 0
	updateRespecButtons()
	if (player.achievements.includes("r36")) player.tickspeed = player.tickspeed.times(0.98);
	if (player.achievements.includes("r45")) player.tickspeed = player.tickspeed.times(0.98);
	if (inQC(6)) document.getElementById("matter").style.display = "block";
	else document.getElementById("matter").style.display = "none";
       if (isADSCRunning()) document.getElementById("chall13Mult").style.display = "block";
       else document.getElementById("chall13Mult").style.display = "none";
	document.getElementById("quickReset").style.display = "none";
	if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
	updateAutobuyers();
	if (player.achievements.includes("r37")) player.money = new Decimal(1000);
	if (player.achievements.includes("r54")) player.money = new Decimal(2e5);
	if (player.achievements.includes("r55")) player.money = new Decimal(1e10);
	if (player.achievements.includes("r78")) player.money = new Decimal(1e25);
	if (player.achievements.includes("r85")) player.infMult = player.infMult.times(4);
	if (player.achievements.includes("r93")) player.infMult = player.infMult.times(4);
	if (player.achievements.includes("r104")) player.infinityPoints = new Decimal(2e25);
	if (player.achievements.includes("r142")) player.meta.antimatter = new Decimal(100);
	resetInfDimensions();
	updateChallenges();
	updateChallengeTimes()
	updateLastTenRuns()
	updateLastTenEternities()
	if(player.meta) updateLastTenQuantums()
	updateAutobuyers()
	resetTimeDimensions()
	
	player.mods.ngt.thisOmni = 0;
	player.mods.ngt.bestOPRate = new Decimal(0);
}

function buyOmniDimension(n, useOP) {
	d = ngt["d" + n];
	
	if(useOP) {
		if(ngt.op.lt(d.opCost)) return;
		ngt.op = ngt.op.subtract(d.opCost)
		d.opCost = d.opCost.multiply(d.opCostMult)
		d.opCostMult = d.opCostMult.multiply(ngt.opCostInc)
		d.opBought = d.opBought.add(1);
	}
	
	else {
		if(ngt.gravitons.lt(d.gCost)) return;
		ngt.gravitons = ngt.gravitons.subtract(d.gCost)
		d.gCost = d.gCost.multiply(d.gCostMult)
		d.gCostMult = d.gCostMult.multiply(ngt.gCostInc)
		d.gBought = d.gBought.add(1);
	}
	
	d.amount = d.amount.add(1);
	return true;
}

// I'll make a more efficient version later.

function buyMaxOmniDimensions() {
	for(var i = 1; i <= 8; i++) {
		while(buyOmniDimension(i));
		while(buyOmniDimension(i, true));
	}
}

function updateOmniDimMults(reset) {
	for(var i = 1; i <= 8; i++) {
		d = ngt["d" + i];
		// Set multiplier
		mult = ngt.omniPower.pow(Decimal.add(d.gBought, d.opBought)).multiply(getReplicatorMult());
		if(hasUpg(3)) mult = mult.multiply(getUpgEff(3))
		if(hasUpg(7)) mult = mult.multiply(getUpgEff(7))
		if(hasUpg(9)) mult = mult.multiply(getUpgEff(9))
		if(compOC(3)) mult = mult.multiply(ngt.t.reward[2])
		
		if(reset) d.mult = mult;
		d.mult = Decimal.max(d.mult, mult)
	}
}

function getGravitonEffect() {
	if(hasUpg(5)) return ngt.gravitons.pow(getUpgEff(5)).max(1)
	return ngt.gravitons.pow(4).max(1);
}

function getReplicatorMult() {
	ret = new Decimal(1)
	for(var i = 1; i <= 8; i++) {
		ret = ret.multiply(Math.log10(Math.max(ngt["r"+i].amount.logarithm,0)+1)+1)
	}
	
	if(hasUpg(8)) return ret.pow(getUpgEff(8)).max(1);
	return ret.pow(3).max(1);
}

function resetReplicators(hardReset) {
	for(var i = 1; i <= 8; i++) {
		ngt["r" + i].amount = new Decimal(ngt.replicatorsUnlocked >= i ? 1 : 0)
		if(hardReset) ngt["r" + i].power = new Decimal(1)
	}
}

function unlockNewReplicator() {
	if(ngt.gravitons.lt(ngt.newReplicatorCost)) return;
	
	ngt.replicatorsUnlocked++
	ngt.gravitons = ngt.gravitons.subtract(ngt.newReplicatorCost);
	ngt.newReplicatorCost = ngt.newReplicatorCost.pow(ngt.replicatorsUnlocked + 1);
	
	resetReplicators();
}

function updateReplicatorPowers() {
	for(var i = 1; i <= 8; i++) {
		r = ngt["r" + i]
		
		r.power = new Decimal(1);
		if(hasUpg(4)) r.power = r.power.multiply(getUpgEff(4))
	}
}

// OP upgrades

const opUpgCosts = [
	10,
	1e8, 1e9,
	5e11, 5e11, 5e11,
	1e18, 1e20, 1e80, 1e95,
]

function buyUpg(n) {
	if(!affordUpg(n)) return;
	ngt.op = ngt.op.subtract(opUpgCosts[n]);
	ngt.opUpgrades.push(n);
	return true;
}

function hasUpg(n) {
	if(!player.mods.ngt) return;
	return ngt.opUpgrades.includes(n);
}

function affordUpg(n) {
	if(!player.mods.ngt) return;
	return ngt.op.gte(opUpgCosts[n])
}

function getUpgEff(n) {
	switch(n) {
		case 0:
			return Decimal.pow(2, ngt.op.logarithm).max(1);
		case 3:
			return Decimal.pow(ngt.op.logarithm, 2).multiply(8).max(1);
		case 4:
			return Decimal.pow(1+ngt.replicatorsUnlocked*0.1, Math.log10(getInfinitied())+1).pow(2).max(1);
		case 5:
			return Math.max(Math.log10(Math.max(ngt.gravitons.logarithm||0,1)),0)/4+4
		case 6:
			return Decimal.pow(10, Math.pow(player.galaxies, 0.2)).max(1);
		case 7:
			return Decimal.pow(10,Math.log(player.resets+1)).max(1);
		case 8:
			return Math.max(Math.log10(Math.max(player.totalTickGained,1)),0)/3+3
		case 9:
			return Decimal.pow(1+Math.log(1-player.tickspeed.logarithm), 5).max(1)
	}
}

function updateOmniUpgrades() {
	ngt.opMult = new Decimal(1);
	if(hasUpg(0)) ngt.opMult = ngt.opMult.multiply(getUpgEff(0));
	ge("ouinfo11").innerHTML = shorten(getUpgEff(0))
	ge("ouinfo21").innerHTML = getFullExpansion(getDimboostCostIncrease())
	ge("ouinfo22").innerHTML = getFullExpansion(getGalaxyCostIncrease())
	ge("ouinfo31").innerHTML = shorten(getUpgEff(3))
	ge("ouinfo32").innerHTML = shorten(getUpgEff(4))
	ge("ouinfo33").innerHTML = getUpgEff(5).toFixed(4)
	ge("ouinfo41").innerHTML = shorten(getUpgEff(6))
	ge("ouinfo42").innerHTML = shorten(getUpgEff(7))
	ge("ouinfo43").innerHTML = getUpgEff(8).toFixed(4)
	ge("ouinfo44").innerHTML = shorten(getUpgEff(9))
}

var rings = [1, 2, 3, 4] // how many upgrades are in each ring
var spins = [0, 0, 0, 0] // how far each ring has spun
var last = 0

function updateOmniSpins() {
	diff = (Date.now() - last);
	last = Date.now()
	for(var i = 0; i < rings.length; i++) {
		spins[i] += diff / 1e5
		
		for(var j = 0; j < rings[i]; j++) {
			// Get actual ID of upgrade from ring position
			id = j;
			for(var k = 0; k < i; k++) id += rings[k];
			
			a = i + 1
			b = j + 1
			div = ge("ou" + a + b);
			
			centerX = innerWidth / 2 - 10;
			centerY = 1000;
			
			if(!ngt.omni) centerY = -69420;
			
			angle = spins[i] + Math.PI * 2 * b / rings[i];
			
			offsetX = Math.cos(angle * i) * i * 160
			offsetY = Math.sin(angle * i) * i * 160
			
			div.style.position = "absolute"
			div.style.left = centerX + offsetX + "px";
			div.style.top = centerY + offsetY + "px";
			
			ge("oucost" + a + b).innerHTML = shortenCosts(opUpgCosts[id])
			div.className = hasUpg(id) ? "omniupgbought" : affordUpg(id) ? "omniupg" : "omniupglocked"
			div.upgID = id;
			div.onclick = function() {
				buyUpg(this.upgID);
			}
		}
	}
}

setTimeout(function() {setInterval(updateOmniSpins, 1)}, 1000)

// omni-challenges

function startOmniChallenge(n) {
	if(player.money.gte(ngt.t.req[n-1])) setOmniChallenge(n);
}

function setOmniChallenge(p) {
	if(typeof(list) == Array) ngt.ocr = p;
	else ngt.ocr = [p];
	omnipotenceReset(true)
}

function exitOmniChallenge() {
	if(!ngt.ocr.length) return;
	ngt.ocr = [];
	omnipotenceReset(true)
}

function inOC(n) {
	if(!player.mods.ngt) return false;
	if(!n && ngt.ocr.length) return true;
	if(ngt.ocr.includes(n)) return true;
	return false;
}

function compOC(n) {
	if(!player.mods.ngt) return false;
	if(ngt.oc.includes(n)) return true;
	return false;
}

function currentOC() {
	return ngt.ocr[0]
}

function ocGoalMet(n) {
	if(!inOC()) return false;
	if(player.money.gte(ngt.t.goal[n-1])) return true;
	return false;
}

// Omnipotence Autobuyer

function updateAutoOmniMode() {
	if (ngt.autobuyer.mode == "amount") {
		document.getElementById("toggleautoquantummode").textContent = "Auto omnipotence mode: amount"
		document.getElementById("autoquantumtext").textContent = "Amount of QK to wait until reset:"
	} else if (ngt.autobuyer.mode == "relative") {
		document.getElementById("toggleautoquantummode").textContent = "Auto omnipotence mode: X times last run"
		document.getElementById("autoquantumtext").textContent = "X times last omnipotence:"
	} else if (ngt.autobuyer.mode == "time") {
		document.getElementById("toggleautoquantummode").textContent = "Auto omnipotence mode: time"
		document.getElementById("autoquantumtext").textContent = "Seconds between runs:"
	} else if (ngt.autobuyer.mode == "peak") {
		document.getElementById("toggleautoquantummode").textContent = "Auto omnipotence mode: peak"
		document.getElementById("autoquantumtext").textContent = "Seconds to wait after latest peak gain:"
	}
}

function toggleAutoOmniMode() {
	if (ngt.autobuyer.mode == "amount") ngt.autobuyer.mode = "relative"
	else if (ngt.autobuyer.mode == "relative") ngt.autobuyer.mode = "time"
	else if (ngt.autobuyer.mode == "time") ngt.autobuyer.mode = "peak"
	else ngt.autobuyer.mode = "amount"
	updateAutoOmniMode()
}