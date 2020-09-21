// Initialize NGT stuff

<<<<<<< Updated upstream
function resetNGT(hardReset) {
	if(hardReset) player.mods.ngt = {
		version: 2,
=======
function resetNGT(hardReset, divisionReset) {
	if(hardReset || divisionReset) player.mods.ngt = {
		version: 2.12,
>>>>>>> Stashed changes
		omni: 0, // times gone omnipotent stat
		thisOmni: 0, // time this run
		lastRun: new Decimal(0), // OP gained during previous run
		op: new Decimal(0), // omnipotence points
		omniPower: new Decimal(3), // multiplier per ten dimensions
		gravitons: new Decimal(0),
		gCostInc: 10, // cost scaling factor (like dimension cost multiplier decrease)
		opCostInc: 10,
		opUpgrades: [], // upgrades bought with OP
		replicatorsUnlocked: 0,
		newReplicatorCost: new Decimal(1e10),
		oc: [], // omni-challenges completed
		ocr: [], // omni-challenges currently running
		t: {req: [], goal: [], reward: []}, // info for OCs
		autobuyer: {
			
		}
	}
	for(var i = 1; i <= 8; i++) {
		j = i - 1
		player.mods.ngt["d" + i] = {
			amount: new Decimal(0), 
			mult: new Decimal(1), 
			gBought: new Decimal(0), 
			opBought: new Decimal(0), 
			gCost: Decimal.pow(100, j**Math.E), 
			gCostMult: new Decimal(i*10), 
			opCost: Decimal.pow(10, j**Math.E), 
			opCostMult: new Decimal(i*10)
		}
	}
	for(var i = 1; i <= 8; i++) player.mods.ngt["r" + i] = {amount: new Decimal(0), power: new Decimal(1)}; 
	updateOmniChallenges()
}

// Complete all ECs up to a certain point

function completeEC(n, a) {
	for(var i = 1; i <= n; i++) player.eternityChalls["eterc" + i] = Math.max(player.eternityChalls["eterc" + i] || 0, a || 5)
	updateEternityChallenges();
}

function gainedOP() {
	return Decimal.pow(10, player.eternityPoints.plus(gainedEternityPoints()).e/(308)).times(player.mods.ngt.opMult || 1).divide(10).floor();
}

const omReqList = ["10", "100", "1e5", "1e10", "1e20", "1e33", "1e50", "1e100", "1e10000", "1e1000000"]

function omniMilestoneReq(n) {
	return new Decimal(omReqList[n])
}

function omniMilestoneReached(n) {
	ret = player.mods.ngt.op.gte(omniMilestoneReq(n)) || player.mods.ngt.milestonesReached > n;
	if(ret) player.mods.ngt.milestonesReached = Math.max(player.mods.ngt.milestonesReached || 0, n)
	return ret;
}

function omnipotenceReset(force, auto) {
	if(!ngt.omni && !force) setTimeout(function() {
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
	if(!force) player.mods.ngt.op = player.mods.ngt.op.add(ngt.omni ? gainedOP() : 1);
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
		timestudy: omniMilestoneReached(3) ? player.timestudy : {
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
			studies: omniMilestoneReached(8) ? player.dilation.studies : [],
			active: false,
			tachyonParticles: player.achievements.includes("ng3p37") ? player.dilation.bestTP.sqrt() : new Decimal(0),
			dilatedTime: new Decimal(0),
			totalTachyonParticles: new Decimal(0),
			bestTP: player.dilation.bestTP,
			nextThreshold: new Decimal(1000),
			freeGalaxies: 0,
			upgrades: omniMilestoneReached(8) ? player.dilation.upgrades : [],
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
		if(hasUpg(4)) mult = mult.multiply(getUpgEff(4))
		if(hasUpg(8)) mult = mult.multiply(getUpgEff(8))
		if(hasUpg(10)) mult = mult.multiply(getUpgEff(10))
		if(hasUpg(14)) mult = mult.multiply(getUpgEff(14))
		if(compOC(3)) mult = mult.multiply(ngt.t.reward[2])
		if(player.achievements.includes("ngt18")) mult = mult.multiply(player.timestudy.studies.length+1)
		
		if(reset) d.mult = mult;
		d.mult = Decimal.max(d.mult, mult)
	}
}

function getGravitonEffect() {
	if(hasUpg(6)) return ngt.gravitons.pow(getUpgEff(6)).max(1)
	return ngt.gravitons.pow(4).max(1);
}

function getReplicatorMult() {
	ret = new Decimal(1)
	for(var i = 1; i <= 8; i++) {
		ret = ret.multiply(Math.log10(Math.max(ngt["r"+i].amount.logarithm,1))+1)
		if(hasUpg(17)) ret = ret.multiply(getUpgEff(17))
	}
	
	if(hasUpg(9)) return ret.pow(getUpgEff(9)).max(1);
	return ret.pow(3).max(1);
}

function resetReplicators(hardReset) {
	for(var i = 1; i <= ngt.replicatorsUnlocked; i++) {
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
		if(hasUpg(5)) r.power = r.power.multiply(getUpgEff(5))
		if(hasUpg(17)) r.power = r.power.divide(1000)
	}
}

// OP upgrades

opUpgCosts = [
	10,
	1e10, 1e15,
	1e20, 1e25, 1e30, 1e35, 1e40, 1e45, 1e60, 1e100,
	"1e110", "1e130", "1e140", "1e145", "1e170", "1e230", "1e250", "1e380", "1e400", "1e480", "1e500", "1e1000", "1e1000", "1e1000", "1e1000", "1e1000", "1e1000", "1e1000", 
]

for(var i = 0; i < opUpgCosts.length; i++) {
	opUpgCosts[i] = new Decimal(opUpgCosts[i])
}

function buyUpg(n) {
	if(!affordUpg(n)) return;
	if(ngt.opUpgrades.includes(n)) return;
	ngt.op = ngt.op.subtract(opUpgCosts[n]);
	ngt.opUpgrades.push(n);
	updateOmniUpgrades()
	
	if(n == 11) {
		showTab("challenges")
		showChallengesTab("omnichallenges")
	}
	if(n == 17) {
		resetReplicators()
	}
	
	return true;
}

function hasUpg(n) {
	if(!player.mods.ngt) return;
	if(n == -1) return true;
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
		case 1:
			return getDimboostCostIncrease();
		case 2:
			return getGalaxyCostIncrease();
		case 3:
			return 1.1**(player.achievements.length+1)
		case 4:
			return Decimal.pow(ngt.op.logarithm, 1.5).max(1);
		case 5:
			return Decimal.pow(1+ngt.replicatorsUnlocked*0.1, Math.log10(getInfinitied())+1).pow(2).max(1);
		case 6:
			return Decimal.max(Math.log10(Math.max(ngt.gravitons.logarithm||0,1)),0).add(4).multiply(4).sqrt().min(8)
		case 7:
			return Decimal.max(Math.pow(player.galaxies, 0.25), 1);
		case 8:
			return Decimal.pow(2,Math.log(player.resets+1)).max(1);
		case 9:
			return Math.max(Math.log10(Math.max(player.totalTickGained,1)),0)/3+3
		case 10:
			return Decimal.pow(1-player.tickspeed.logarithm, 0.1).multiply(100).max(1)
		case 12:
			return Decimal.log10(Decimal.max(ngt.r1.amount.log10(),1))**2
		case 14: 
			return getReplMult().pow(0.01)
		case 15: 
			return Decimal.pow(69, ngt.d8.amount.pow(2)).max(1)
		case 16: 
			return Decimal.pow(getReplicatorMult().log10(), 1.25).max(1)
		case 17: 
			return Decimal.pow(Decimal.log10(player.timeShards.log10()), 0.5).max(1)
	}
}

function updateOmniUpgrades() {
	ngt.opMult = new Decimal(1);
	if(hasUpg(0)) ngt.opMult = ngt.opMult.multiply(getUpgEff(0));
	ngt.unlockedRings = 0
	if(hasUpg(0)) ngt.unlockedRings++;
	if(hasUpg(2)) ngt.unlockedRings++;
	if(hasUpg(10)) ngt.unlockedRings++;
	
	if(hasUpg(20)) {
		opUpgCosts[20] = new Decimal("1e500")
	}
	else {
		opUpgCosts[20] = Decimal.pow(10, Math.random() * 20 + 490)
	}
	
	gn("ouinfo", function(n, i) {n.innerHTML = shorten(getUpgEff(i))})
	gn("oucost", function(n, id) {n.innerHTML = shortenCosts(opUpgCosts[id])})
	
	updateOmniSpins()
}

var rings = [ 1,  2,  8, 18]  // how many upgrades are in each ring
var total = [ 1,  3, 11, 29]  // I could automate it, but fuck it
var spins = [ 0,  0,  0,  0]  // how far each ring has spun
var last = 0

function updateOmniSpins() {
	if(!player.mods.ngt) return;
	
	diff = (Date.now() - last);
	last = Date.now()
	for(var i = 0; i < rings.length; i++) {
		spins[i] += diff * 2**i / 1e5
		
		for(var j = 0; j < rings[i]; j++) {
			// Get actual ID of upgrade from ring position
			id = j;
			for(var k = 0; k < i; k++) id += rings[k];
			
			a = i + 1
			b = j + 1
			
			centerX = innerWidth / 2 - 10;
			centerY = 1000;
			
			if(!ngt.omni) centerY = -69420;
			
			angle = spins[i] + Math.PI * 2 * j / rings[i]
			
			offsetX = Math.cos(angle) * i * 160
			offsetY = Math.sin(angle) * i * 160
			
			index = (total[i-1]||0)+j
			l = (ngt.opUpgrades.length-10)/2
			
			randomX = (index == 20) ? Math.random() * l - l/2 : 0
			randomY = (index == 20) ? Math.random() * l - l/2 : 0
			
			div = document.getElementsByName("ou")[index]
			
			// div.style.display = ngt.unlockedRings >= i ? "" : "none"
			div.style.opacity = ngt.unlockedRings >= i ? 1 : 0
			div.style.position = "absolute"
			div.style.left = centerX + offsetX + randomX + "px";
			div.style.top = centerY + offsetY + randomY + "px";
			div.className = !hasUpg(id-1) ? "omniupghidden" : hasUpg(id) ? "omniupgbought" : affordUpg(id) ? "omniupg" : "omniupglocked"
			div.upgID = id;
			div.onclick = function() {
				buyUpg(this.upgID);
			}
		}
	}			
}

// omni-challenges

function updateOmniChallenges() {
	ngt.t = {
		req: [
			new Decimal("1e1350000000"),
			new Decimal("1e1800000000"),
			new Decimal("1e2222222222"),
			new Decimal("1e4200000000"),
			new Decimal("1e5250000000"),
			new Decimal("1e5750000000"),
			new Decimal("1e9999999999"),
			new Decimal("1e9999999999"),
			new Decimal("1e9999999999"),
			new Decimal("1e9999999999"),
		],
		goal: [
			new Decimal("1e650000"),
			new Decimal("1e10500000"),
			new Decimal("1e11500000"),
			new Decimal("1e5400000"),
			new Decimal("1e400000000"),
			new Decimal("1e250000000"),
			new Decimal("1e999999999"),
			new Decimal("1e999999999"),
			new Decimal("1e999999999"),
			new Decimal("1e999999999"),
		],
		reward: [
			Decimal.max((Decimal.log10(player.firstBought) - 1) / 100 + 1, 1),
			Decimal.max(Decimal.log10(Decimal.max(-player.tickspeed.logarithm, 0)), 0).pow(0.75),
			Decimal.max(player.timeShards.logarithm, 0).pow(0.2).multiply(3).sqrt().max(3),
			new Decimal(Decimal.log10(player.infinityPower.log10()+1)).pow(0.1),
			"",
			"",
			"",
			"",
			"",
			"",
		]
	}
}

function getOCGoal() {
	if(!player.mods.ngt) return
	return ngt.t.goal[ngt.ocr[0]-1]
}

function startOmniChallenge(n) {
	if(player.totalmoney.gte(ngt.t.req[n-1])) setOmniChallenge(n);
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
	if(!n && player.mods.ngt.ocr.length) return true;
	if(player.mods.ngt.ocr.includes(n)) return true;
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

// Progress Bar

function doOmniProgress() {
	document.getElementById("progressbar").className="omniProgress"
	var gop = gainedOP()
	if (inOC()) {
		var percentage = Math.min(player.money.max(1).log10() / Decimal.log10(getOCGoal()) * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip','Percentage to omni-challenge goal')
	} else {
		var gopLog = gop.log2()
		var goal = Math.pow(2,Math.ceil(Math.log10(gopLog) / Math.log10(2)))
		var percentage = Math.min(gopLog / goal * 100, 100).toFixed(2) + "%"
		document.getElementById("progressbar").style.width = percentage
		document.getElementById("progresspercent").textContent = percentage
		document.getElementById("progresspercent").setAttribute('ach-tooltip',"Percentage to "+shortenDimensions(Decimal.pow(2,goal))+" OP gain")
	}
}

function getDilationRequirement() {
	return new Decimal("1e10000")
}

function divide() {
<<<<<<< Updated upstream
    resetNGT(true)
	omnipotenceReset(true)
=======
	if(!hasUpg(20)) return false;
	ngt.division.times++
	ngt.animating = true;
	ge("blade").style.transitionDuration = "0.5s"
	ge("blade").style.top = "50px"
	setTimeout(function() {
		ge("blade").style.top = "2000px"
	}, 1900)
	setTimeout(function() {
		if(animation) {
			ge("death").style.display = ""
			ge("bleed").style.opacity = 1
		}
		else {
			ge("blade").style.transitionDuration = "0s"
			ngt.animating = false
		}
		leftoverOP = ngt.op;
		resetNGT(false, true)
		omnipotenceReset(true, true)
		player.infinityPoints = new Decimal(0)
		setTheme()
		player.autobuyers.forEach(function(a) {
			a.isOn = false;
		})
		player.break = false;
		showTab("dimensions")
		showDimTab("antimatterdimensions")
		omnipotenceReset(true, true)
		player.infinityUpgrades.push("skipResetGalaxy")
		softReset(0)
		ngt.division.um = ngt.division.um.max(leftoverOP.log10()) // gain up to your log(OP) in unstable matter at a time
	}, 2000)
	if(animation) {
		setTimeout(function() {
			i=0;
			text = "the universe is bleeding.NNyou feel the energy of something that cannot exist.NNyou will regain what is lost and become stronger than ever.NNthe time has come to go beyond infinity.".split("")
			text.forEach(function(letter) {i += 1+(letter=="N")*9-(letter==" "); setTimeout(function() {ge("bleed").innerHTML += letter == "N" ? "<br>" : letter}, i * 100)})
		}, 5000)
		setTimeout(function() {
			ge("bleed").style.opacity = 0
		}, 25000)
		setTimeout(function() {
			ge("death").style.display = "none"
		}, 30000)
	}
}

function getHalfLife() {
	return 3600
}

function getEnergyInput(base) {
	ret = ge("energyinput").value**2;
	if(base) return ret;
	return ngt.division.um.multiply(ret/100);
}

function getEighthDimensions() {
	return player.eightAmount.add(ngt.division.eightProduced || 0)
}

function getEighthProduction(display) {
	ret = ngt.division.energy.sqrt().divide(1000);
	if(display) {
		// do this twice - once for hours, once for minutes
		if(ret.lt(1)) ret = ret.multiply(60)
		if(ret.lt(1)) ret = ret.multiply(60)
	}
	return ret;
}

function getRiftDamage() {
	return ngt.division.energy
}

function getRiftStability() {
	return ngt.division.health.divide(ngt.division.maxHealth);
}

function dumpEnergy() { // remove energy from the rift, gaining virtual particles
	dumped = ngt.division.energy;
	gain = getVPGain()
	ngt.division.energy = new Decimal(0);
	ngt.division.vp = ngt.division.vp.add(gain);
	ngt.division.totalvp = ngt.division.totalvp.add(gain);
}

function getVPGain() {
	return ngt.division.energy.divide(1e3).pow(2).floor()
}

function getVGalBase() {
	return 2
}

function getVGalAmount() {
	return Math.floor(Math.max(ngt.division.totalvp.multiply(getVGalBase()).log(getVGalBase()), 0))
}

function meltdown() { // you fucked up
	
}

function updateDivision(diff) {
	if(!player.mods.ngt) return;
	ge("thebladetab").style.display = (hasUpg(20) || ngt.division.times > 0) ? "" : "none";
	ge("blade").style.display = hasUpg(20) ? "" : "none"
	if(!ngt.animating && player.options.currentTab == "omnitab" && player.options.currentOmniTab == "theblade") ge("blade").style.top = Math.sin(Date.now() / 1000) * 40 + 200 + "px"
	
	// Virtual Particle calculations
	
	ngt.division.vgal = getVGalAmount()
	
	// Half-life of virtual particles
	
	secondsElapsed = diff / 10;
	
	logChange = secondsElapsed*Math.log10(2)/getHalfLife();
	newLog = ngt.division.um.log10() - logChange;
	average = Decimal.pow(10, newLog);
	amount = average.floor();
	variance = average.subtract(amount)
	if(Math.random() < variance) amount = amount.add(1)
	gain = ngt.division.um.subtract(amount);
	if(isNaN(gain.logarithm)) gain = new Decimal(0)
	
	ngt.division.shards = ngt.division.shards.add(gain);
	ngt.division.um = amount;
	
	// Rift stability
	
	ngt.division.maxHealth = ngt.division.shards.pow(2).multiply(1000);
	ngt.division.damage = ngt.division.damage.add(getRiftDamage().multiply(diff/10))
	ngt.division.health = ngt.division.maxHealth.subtract(ngt.division.damage).max(0)
	
	// Eighth dimension production
	
	ep = getEighthProduction()
	ngt.division.energy = ngt.division.energy.add(getEnergyInput().multiply(diff/10))
	amount = ep.multiply(diff/10)
	if(!ngt.division.eightProduced) ngt.division.eightProduced = new Decimal(0)
	ngt.division.eightProduced = ngt.division.eightProduced.add(amount)
	
	// Update HTML
	
	ge("virtualparticles").innerHTML = getFullExpansion(ngt.division.vp)
	ge("totalvirtualparticles").innerHTML = getFullExpansion(ngt.division.totalvp)
	ge("virtualgalaxies").innerHTML = getFullExpansion(ngt.division.vgal)
	ge("virtualgalaxycost").innerHTML = getFullExpansion(Decimal.pow(getVGalBase(), ngt.division.vgal))
	
	ge("unstablematter").innerHTML = getFullExpansion(ngt.division.um)
	ge("drainrate").innerHTML = timeDisplayShort(getHalfLife()*10, true, 3)
	ge("shards").innerHTML = getFullExpansion(ngt.division.shards)
	ge("eighthextra").innerHTML = getFullExpansion(ngt.division.eightProduced)
	ge("eighthprod").innerHTML = getFullExpansion(getEighthProduction(true))
	ge("eighthunit").innerHTML = ep.gt(1) ? "dimensions/s" : ep.gt(1/60) ? "dimensions/m" : "dimensions/h"
	ge("energyindisplay").innerHTML = getEnergyInput(true);
	ge("riftenergy").innerHTML = getFullExpansion(ngt.division.energy);
	ge("energyrate").innerHTML = getFullExpansion(getEnergyInput());
	ge("stability").innerHTML = getFullExpansion(ngt.division.health) + "/" + getFullExpansion(ngt.division.maxHealth) + " (" + getRiftStability().multiply(100).toFixed(2) + "%)";
	ge("vpgain").innerHTML = getFullExpansion(getVPGain())
>>>>>>> Stashed changes
}