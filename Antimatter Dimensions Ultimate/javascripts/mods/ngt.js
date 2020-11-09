// Initialize NGT stuff

function resetNGT(hardReset, divisionReset) {
	if(hardReset) player.mods.ngt = {}
	if(hardReset || divisionReset) player.mods.ngt = {
		version: 2.3,
		omni: 0, // times gone omnipotent stat
		thisOmni: 0, // time this run
		lastRun: new Decimal(0), // OP gained during previous run
		op: new Decimal(0), // omnipotence points
		omniPower: new Decimal(3), // multiplier per ten dimensions
		gravitons: new Decimal(0),
		gCostInc: 10, // cost scaling factor (like dimension cost multiplier decrease)
		opCostInc: 10,
		opUpgrades: !hardReset && divMilestoneReached(5) ? player.mods.ngt.opUpgrades : [], // upgrades bought with OP
		replicatorsUnlocked: !hardReset && divMilestoneReached(3) ? player.mods.ngt.replicatorsUnlocked : 0,
		newReplicatorCost: !hardReset && divMilestoneReached(3) ? player.mods.ngt.newReplicatorCost : new Decimal(1e10),
		oc: !hardReset && divMilestoneReached(4) ? player.mods.ngt.oc : [], // omni-challenges completed
		ocr: [], // omni-challenges currently running
		t: {req: [], goal: [], reward: []}, // info for OCs
		autobuyer: player.mods.ngt.autobuyer || {
			mode: "amount"
		},
		divider: player.mods.ngt.divider || {
			
		},
		auto: player.mods.ngt.auto || [],
		division: hardReset ? {
			times: 0,
			// light
			vp: new Decimal(0),
			vgal: 0,
			// dark
			um: new Decimal(0),
			shards: new Decimal(0),
			energy: new Decimal(0),
			damage: new Decimal(0),
			eightProduced: new Decimal(0),
			shardUpgrades: []
		} : player.mods.ngt.division,
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
	for(var i = 1; i <= 8; i++) player.mods.ngt["r" + i] = {amount: new Decimal(ngt.replicatorsUnlocked >= i ? 1 : 0), power: new Decimal(1)}; 
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

const omReqList = ["10", "100", "1e5", "1e10", "1e20", "1e33", "1e50", "1e100", "1e200", "1e10000", "1e1000000"]
const dmReqList = [400, 100, 25, 5, 1, 1/4, 1/10, 0]

function omniMilestoneReq(n) {
	return new Decimal(omReqList[n])
}

function omniMilestoneReached(n) {
	if(!player.mods.ngt) return;
	if(player.mods.ngt.division.times && n == 7 && divMilestoneReached(0)) return true;
	if(n < ngt.division.times && divMilestoneReached(1)) return true;
	ret = player.mods.ngt.op.gte(omniMilestoneReq(n)) || player.mods.ngt.milestonesReached > n;
	if(ret) player.mods.ngt.milestonesReached = Math.max(player.mods.ngt.milestonesReached || 0, n)
	return ret;
}

function divMilestoneReached(n) {
	if(!player.mods.ngt) return;
	ret = dmReqList[n] >= ngt.division.record / ngt.division.times;
	return ret;
}

function omnipotenceReset(force, auto) {
	if(player.eternityPoints.add(gainedEternityPoints()).lt(1e308) && !(force || ocGoalMet(currentOC()))) return;
	if(ngt.omni + ngt.division.times < 1 && !force) setTimeout(function() {
		$("#dimensionsbtn").notify("New Dimension Unlocked", "success");
		$("#eternitystorebtn").notify("New Time Studies Unlocked", "success");
	}, 10000);
	
	out = inOC() && ocGoalMet(ngt.ocr[0]) && !force
	if(out && (!player.options.retryChallenge || !player.mods.ngt.oc.includes(currentOC()))) {
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
		bestInfinityTime: player.bestInfinityTime,
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
			totalTheorem: 0,
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
			studies: omniMilestoneReached(9) ? player.dilation.studies : [],
			active: false,
			tachyonParticles: player.achievements.includes("ng3p37") ? player.dilation.bestTP.sqrt() : new Decimal(0),
			dilatedTime: new Decimal(0),
			totalTachyonParticles: new Decimal(0),
			bestTP: player.dilation.bestTP,
			nextThreshold: new Decimal(1000),
			freeGalaxies: 0,
			upgrades: omniMilestoneReached(9) ? player.dilation.upgrades : [],
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
		masterystudies: player.masterystudies ? (omniMilestoneReached(10) ? player.masterystudies : []) : undefined,
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
	updateTimeStudyButtons()
	
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
		if(hasUpg(12)) mult = mult.multiply(getUpgEff(12))
		if(hasUpg(14)) mult = mult.multiply(getUpgEff(14))
		if(hasUpg(15) && i == 1) mult = mult.multiply(getUpgEff(15))
		if(hasUpg(22)) mult = mult.multiply(getUpgEff(22))
		if(compOC(3)) mult = mult.multiply(ngt.t.reward[2])
		if(player.achievements.includes("ngt18")) mult = mult.multiply(player.timestudy.studies.length+1)
		
		if(reset) d.mult = mult;
		d.mult = Decimal.max(d.mult, mult)
	}
}

function getGravitonEffect() {
	if(inOC(7)) return new Decimal(1);
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
		ngt["r" + i].amount = new Decimal(1)
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
		if(hasUpg(24)) r.power = r.power.multiply(getUpgEff(24))
		if(hasUpg(17)) r.power = r.power.divide(1000).max(1)
	}
}

// OP upgrades

opUpgCosts = [
	10,
	1e10, 1e15,
	1e20, 1e25, 1e30, 1e35, 1e40, 1e45, 1e60, 1e100,
	"1e110", "1e130", "1e140", "1e150", "1e170", "1e235", "1e250", "1e320", "1e380", "1e400", "1e420", "1e450", "1e500", "1e700", "1e900", "1e10000", "1e10000", "1e10000", 
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
	
	if(n == 11 && !ngt.division.times) {
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
	if(inOC(7)) return false;
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
			return Decimal.pow(1+ngt.replicatorsUnlocked**2/40, Math.log10(getInfinitied()+1)+1).pow(2).max(1);
		case 6:
			return Decimal.max(Math.log10(Math.max(ngt.gravitons.logarithm||0,1)),0).add(4).multiply(4).sqrt().min(8)
		case 7:
			return Decimal.max(Math.pow(player.galaxies, 0.25), 1);
		case 8:
			return Decimal.pow(2,Math.log(player.resets+1)).max(1);
		case 9:
			return Math.max(Math.log10(Math.max(player.totalTickGained,1)),0)/3+3
		case 10:
			return Decimal.pow(1-player.tickspeed.logarithm, 0.25).multiply(100).max(1)
		case 12:
			return Decimal.log10(Decimal.max(ngt.r1.amount.log10(),1))**((hasUpg(9) ? getUpgEff(9) : 3) * (hasUpg(17) ? getUpgEff(17) : 1))
		case 14: 
			return getReplMult().pow(0.01)
		case 15: 
			return Decimal.pow(6.9, ngt.d8.amount).max(1)
		case 16: 
			return Decimal.pow(getReplicatorMult().log10()+1, 1.25).add(1)
		case 17: 
			return Decimal.pow(Decimal.log10(player.timeShards.log10()), 0.5).max(1)
		case 21: 
			return gainEternitiedStat()
		case 22: 
			return Decimal.pow(getEighthsProduced(), Math.max(Decimal.log10(getEighthsProduced().max(1)) - 2, 1)).max(1)
		case 23: 
			return Decimal.max(ngt.gravitons.max(1).log10() / 1000, 1)
		case 24: 
			return Decimal.pow(ngt.division.vp.log10(), 2)
	}
}

function updateOmniUpgrades() {
	ngt.opMult = new Decimal(1);
	if(hasUpg(0)) ngt.opMult = ngt.opMult.multiply(getUpgEff(0));
	ngt.unlockedRings = 0
	if(hasUpg(0)) ngt.unlockedRings++;
	if(hasUpg(2)) ngt.unlockedRings++;
	if(hasUpg(10)) ngt.unlockedRings++;
	
	if(player.options.currentTab !== "omnitab" || player.options.currentOmniTab !== "omnipotence") return; // only run when tab is active
	gn("ouinfo", function(n, i) {n.innerText = shorten(getUpgEff(i))})
	gn("oucost", function(n, id) {n.innerText = shortenCosts(opUpgCosts[id])})
	gn("ou", function(div, id) {
		div.className = !hasUpg(id-1) ? "omniupghidden" : hasUpg(id) ? "omniupgbought" : affordUpg(id) ? "omniupg" : "omniupglocked"
		div.upgID = id;
		div.onclick = function() {
			buyUpg(this.upgID);
		}
	})
	
	updateOmniSpins();
}

var rings = [ 1,  2,  8, 18]  // how many upgrades are in each ring
var total = [ 1,  3, 11, 29]  // I could automate it, but fuck it
var spins = [ 0,  0,  0,  0]  // how far each ring has spun
var last = 0

function updateOmniSpins() {
	if(!player.mods.ngt) return;
	if(player.options.currentTab !== "omnitab" || player.options.currentOmniTab !== "omnipotence") return;
	
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
			
			if(!ngt.omni && !ngt.division.times) centerY = -69420;
			
			angle = spins[i] + Math.PI * 2 * j / rings[i]
			
			offsetX = Math.cos(angle) * i * 160
			offsetY = Math.sin(angle) * i * 160
			
			index = (total[i-1]||0)+j
			l = ngt.division.times || hasUpg(20) ? 0 : (ngt.opUpgrades.length-10)/2
			
			randomX = (index == 20) ? Math.random() * l - l/2 : 0
			randomY = (index == 20) ? Math.random() * l - l/2 : 0
			
			div = document.getElementsByName("ou")[index]
			
			// div.style.display = ngt.unlockedRings >= i ? "" : "none"
			div.style.opacity = ngt.unlockedRings >= i ? 1 : 0
			div.style.position = "absolute"
			div.style.left = centerX + offsetX + randomX + "px";
			div.style.top = centerY + offsetY + randomY + "px";
		}
	}			
}

// omni-challenges

function updateOmniChallenges() {
	ngt.t = {
		req: [
			new Decimal("1e1350000000"),
			new Decimal("1e1775000000"),
			new Decimal("1e2200000000"),
			new Decimal("1e2500000000"),
			new Decimal("1e3750000000"),
			new Decimal("1e4500000000"),
			new Decimal("1e6400000000"),
			new Decimal("1e10000000000"),
			new Decimal("1e99999999999"),
			new Decimal("1e99999999999"),
		],
		goal: [
			new Decimal("1e775000"),
			new Decimal("1e10000000"),
			new Decimal("1e12500000"),
			new Decimal("1e2860000"),
			new Decimal("1e275000000"),
			new Decimal("1e360000000"),
			new Decimal("1e1500000000"),
			new Decimal("1e950000000"),
			new Decimal("1e999999999"),
			new Decimal("1e999999999"),
		],
		reward: [
			Decimal.max((Decimal.log10(player.firstBought) - 1) / 100 + 1, 1),
			Decimal.max(Decimal.log10(Decimal.max(-player.tickspeed.logarithm, 0)), 0).pow(0.75),
			Decimal.max(player.timeShards.logarithm, 0).pow(0.25).multiply(3).sqrt().max(3),
			new Decimal(Decimal.log10(Decimal.max(player.infinityPower.log10() - 2**24, 1))).pow(2).divide(100).add(1),
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
		document.getElementById("toggleautoomnimode").textContent = "Auto omnipotence mode: amount"
		document.getElementById("autoomnitext").textContent = "Amount of OP to wait until reset:"
	} else if (ngt.autobuyer.mode == "relative") {
		document.getElementById("toggleautoomnimode").textContent = "Auto omnipotence mode: X times last"
		document.getElementById("autoomnitext").textContent = "X times last omnipotence:"
	} else if (ngt.autobuyer.mode == "time") {
		document.getElementById("toggleautoomnimode").textContent = "Auto omnipotence mode: time"
		document.getElementById("autoomnitext").textContent = "Seconds between runs:"
	} else if (ngt.autobuyer.mode == "peak") {
		document.getElementById("toggleautoomnimode").textContent = "Auto omnipotence mode: peak"
		document.getElementById("autoomnitext").textContent = "Seconds to wait after latest peak gain:"
	}
}

function toggleAutoOmniMode() {
	if (ngt.autobuyer.mode == "amount") ngt.autobuyer.mode = "relative"
	else if (ngt.autobuyer.mode == "relative") ngt.autobuyer.mode = "time"
	else if (ngt.autobuyer.mode == "time") ngt.autobuyer.mode = "peak"
	else ngt.autobuyer.mode = "amount"
	updateAutoOmniMode()
}

function toggleAutoOmni(t) {
	// if(!divMilestoneReached(2)) return;
	ngt.auto[t] = (ngt.auto[t] + 1 || 1) % 3;
}

function calculateNewStudyCosts() {
	for(var i = 0; i < studyCosts.length; i++) {
		if(i > 57) studyCosts[i] *= 1;
		else if(i > 45) studyCosts[i] *= 2000/9*(superStudies+1);
		else if(i > 40) studyCosts[i] *= 20
		else studyCosts[i] *= 3;
		studyCosts[37] = 0;
		if(ge("studyCost" + i)) ge("studyCost" + i).innerHTML = getFullExpansion(studyCosts[i]);
	}
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

function canDivide() {
	return hasUpg(20) && ngt.op.add(gainedOP()).gte("1e400");
}

function divide() {
	// resetNGT(true)
	// omnipotenceReset(true)
	if(!canDivide()) return false;
	if(!ngt.division.times) player.options.animations.division = true;
	ngt.animating = true;
	ge("blade").style.transitionDuration = "1s"
	ge("blade").style.top = "50px"
	setTimeout(function() {
		ge("blade").style.top = "3000px"
	}, 1800)
	if(player.options.animations.division) {
		setTimeout(divisionReset, 2000)
		if(ngt.division.times < 1) {
			setTimeout(function() {
				if(player.options.animations.division) {
					ge("death").style.transitionDuration = "0s"
					ge("death").style.opacity = 1
				}
				else {
					ge("blade").style.transitionDuration = "0s"
					ngt.animating = false
				}
			}, 2000)
			setTimeout(function() {
				i=0;
				text = "nothing is impossible in this cursed reality.".split("")
				text.forEach(function(letter) {i++; setTimeout(function() {ge("bleed").innerHTML += letter}, i * 100)})
			}, 3000)
			setTimeout(function() {
				ge("death").style.transitionDuration = "5s"
				ge("death").style.opacity = 0
				showTab("dimensions")
				showDimTab("antimatterdimensions")
			}, 8000)
		}
	}
	else {
		ge("blade").style.transitionDuration = "0s"
		ngt.animating = false;
		divisionReset();
	}
}

function getUMGain() {
	return new Decimal(Decimal.pow(ngt.op.add(gainedOP()).log10() - 400, hasUpg(23) ? getUpgEff(23) : 1) * getShardUpgEff(2)).max(canDivide()*1);
}

function divisionReset() {
	if(!canDivide()) return false;
	if(!ngt.division.record || ngt.omni < ngt.division.record) ngt.division.record = ngt.omni;
	ngt.division.times++
	ngt.division.last = Date.now();
	ngt.division.um = ngt.division.um.add(getUMGain())
	resetNGT(false, true)
	omnipotenceReset(true, true)
	resetReplicators();
	eternity(true)
	player.eternityPoints = new Decimal(0)
	resetDimensions();
}

function getHalfLife() {
	return 600 * getShardUpgEff(1.1);
}

function getDecayRate() {
	return ge("energyinput").value**2 / 100;
}

function getEnergyRate() {
	return getShardUpgEff(1).multiply(10);
}

function getEighthDimensions() {
	return player.eightAmount.add(getEighthsProduced() || 0)
}

function getBaseEighthsProduced(display) {
	var e = ngt.division.energy.multiply(10);
	if(e.gt(10000)) e = e.subtract(10000).sqrt().add(10000);
	return e.multiply(getShardUpgEff(2.1)).floor();
}

function getEighthsProduced() {
	if(!player.mods.ngt) return 0;
	return ngt.division.eightProduced.multiply(getShardUpgEff(5));
}

function getRiftDamageRate() {
	return 1;
}

function getRiftDamage() {
	return ngt.division.energy.multiply(getRiftDamageRate());
}

function getRiftStability() {
	return ngt.division.health.divide(ngt.division.maxHealth).max(0);
}

function getShardUpgEff(n, l = 0) {
	if(!player.mods.ngt) return 0;
	var b = Decimal.add(player.mods.ngt.division.shardUpgrades[Math.floor(n)] || new Decimal(0), l);
	
	switch(n) {
		case 0: 
			return Decimal.pow(2, b);
		case 0.1: 
			return Decimal.pow(3, b);
		case 1: 
			return Decimal.pow(2, b);
		case 1.1: 
			return Decimal.divide(1, b.add(1));
		case 2: 
			return Decimal.pow(2, b);
		case 2.1: 
			return Decimal.multiply(0.5, b).add(1);
		case 3: 
			return Decimal.divide(1, b.multiply(0.15).add(1))
		case 3.1: 
			return Decimal.pow(0.5, b);
		case 4: 
			return Decimal.add(1, b.multiply(0.6));
		case 4.1: 
			return Decimal.add(1, b.multiply(0.3));
		case 5: 
			return Decimal.add(1, b.multiply(0.4));
		case 5.1: 
			return Decimal.divide(1, b.multiply(0.2).add(1))
	}
}

function getShardUpgCost(n) {
	var b = player.mods.ngt.division.shardUpgrades[n] || new Decimal(0);
	
	switch(n) {
		case 0: return Decimal.pow(2, b.add(1).add(b.subtract(100).max(0)))
		case 1: return Decimal.pow(4, b.add(1))
		case 2: return Decimal.pow(8, b.add(1))
		case 3: return Decimal.pow(3, b).multiply(1e3)
		case 4: return Decimal.pow(9, b).multiply(1e6)
		case 5: return Decimal.pow(27, b).multiply(1e9)
	}
}

function canBuyShardUpg(n) {
	return ngt.division.shards.floor().gte(getShardUpgCost(n));
}

function buyShardUpg(n) {
	if(!player.mods.ngt) return;
	if(!ngt.division.times) return;
	if(!canBuyShardUpg(n)) return;
	ngt.division.shards = ngt.division.shards.subtract(getShardUpgCost(n));
	ngt.division.shardUpgrades[n] = Decimal.add(ngt.division.shardUpgrades[n] || 0, 1);
}

function getVPGain() {
	return ngt.division.energy.multiply(getShardUpgEff(0.1)).divide(10).floor()
}

function getTotalVP() {
	return ngt.division.vp.multiply(getShardUpgEff(3.1));
}

function getVGalBase() {
	return 1 + getShardUpgEff(3) * 2
}

function getVGalPower() {
	return getShardUpgEff(4).multiply(getShardUpgEff(5.1))
}

function getVGalAmount() {
	return Math.floor(Math.max(getTotalVP().multiply(getVGalBase()).log(getVGalBase()), 0))
}

function meltdown(respec) { // you fucked up
	gain = getVPGain()
	ngt.division.energy = new Decimal(0);
	ngt.division.vp = ngt.division.vp.add(gain);
	
	if(respec) {
		ngt.division.shards = ngt.division.totalShards;
		ngt.division.shardUpgrades = [];
		ge("energyinput").value = 0;
	}
}

function updateDivision(diff) {
	if(!player.mods.ngt) return;
	ge("thebladetab").style.display = (hasUpg(20) || ngt.division.times > 0) ? "" : "none";
	ge("blade").style.display = canDivide() ? "" : "none"
	if(!ngt.animating && player.options.currentTab == "omnitab" && player.options.currentOmniTab == "theblade") ge("blade").style.top = Math.sin(Date.now() / 1000) * 30 + 350 + "px"
	
	// Virtual Particle calculations
	
	ngt.division.vgal = getVGalAmount()
	
	// Half-life of virtual particles
	
	secondsElapsed = getDecayRate(true) * diff / 10;
	logChange = secondsElapsed*Math.log10(2)/getHalfLife();
	newLog = ngt.division.um.log10() - logChange;
	amount = Decimal.pow(10, newLog);
	gain = ngt.division.um.subtract(amount);
	shardGain = ngt.division.um.floor().subtract(amount.floor()).round();
	if(isNaN(gain.logarithm)) gain = new Decimal(0)
	
	ngt.division.energyInput = ge("energyinput").value;
	ngt.division.energy = ngt.division.energy.add(gain.multiply(getEnergyRate()));
	ngt.division.shards = ngt.division.shards.add(gain);
	ngt.division.totalShards = ngt.division.totalShards.add(gain);
	ngt.division.um = amount;
	
	// Rift stability
	
	ngt.division.maxHealth = getShardUpgEff(0).multiply(10);
	ngt.division.damage = getRiftDamage();
	ngt.division.health = ngt.division.maxHealth.subtract(ngt.division.damage).max(0)
	if(ngt.division.health.lte(0)) meltdown(ngt.division.respec);
	
	// Eighth dimension production
	
	ngt.division.eightProduced = ngt.division.eightProduced.max(getBaseEighthsProduced())
	
	// Update HTML
	
	ge("virtualparticles").innerHTML = getFullExpansion(ngt.division.vp)
	ge("totalvirtualparticles").innerHTML = getFullExpansion(getTotalVP())
	ge("virtualgalaxies").innerHTML = getFullExpansion(ngt.division.vgal)
	ge("virtualgalaxypower").innerHTML = getFullExpansion(getVGalPower()*100) + "%"
	ge("virtualgalaxycost").innerHTML = getFullExpansion(Decimal.pow(getVGalBase(), ngt.division.vgal))
	
	ge("unstablematter").innerHTML = getFullExpansion(ngt.division.um, 1)
	ge("umgain").innerHTML = getFullExpansion(getUMGain())
	ge("umgainrate").innerHTML = getFullExpansion(getUMGain().divide(Date.now() - ngt.division.last).multiply(60000))
	ge("drainrate").innerHTML = timeDisplayShort(getHalfLife() * 10, true, 3)
	ge("shards").innerHTML = getFullExpansion(ngt.division.shards.floor())
	ge("eighthextra").innerHTML = getFullExpansion(getEighthsProduced())
	ge("eighthextracurrent").innerHTML = getFullExpansion(getBaseEighthsProduced()) + (Decimal.gt(ngt.division.shardUpgrades[5], 0) ? "+" + getBaseEighthsProduced().multiply(getShardUpgEff(5).subtract(1)) : "")
	ge("energyindisplay").innerHTML = getDecayRate() * 100;
	ge("riftenergy").innerHTML = getFullExpansion(ngt.division.energy, 1);
	ge("energyrate").innerHTML = "+" + getFullExpansion(ngt.division.um.multiply(getEnergyRate() * getDecayRate() / getHalfLife()), 2);
	ge("stability").innerHTML = getFullExpansion(ngt.division.health) + "/" + getFullExpansion(ngt.division.maxHealth) + " (" + getRiftStability().multiply(100).toFixed(2) + "%)";
	ge("shardrespec").innerHTML = getFullExpansion(ngt.division.totalShards.subtract(ngt.division.shards));
	ge("vpgain").innerHTML = getFullExpansion(getVPGain())
	
	for(var i = 0; i < 6; i++) {
		ge("shardupg" + i).className = "timestudy " + (canBuyShardUpg(i) ? (i % 6 < 3 ? "lightstudy" : "darkstudy") : "timestudylocked")
		ge("shardupg" + i).style.height = "100px";
		var t = ""
		t += ["MATRIX","OVERCHARGE","AUGMENTATION","COMPRESSION","DILATION","REALITY"][i] + " " + roman(Decimal.add(ngt.division.shardUpgrades[i], 1) || 1) + "<br>"
		t += [
			`2x to rift HP<br>3x to VP gain<br>
			HP: ${shortenDimensions(getShardUpgEff(0))}x > ${shortenDimensions(getShardUpgEff(0, 1))}x<br>
			VP gain: ${shortenDimensions(getShardUpgEff(0.1))}x > ${shortenDimensions(getShardUpgEff(0.1, 1))}x`,
			
			`2x to energy gain<br>+100% to decay speed<br>
			UM gain: ${shortenDimensions(getShardUpgEff(1))}x > ${shortenDimensions(getShardUpgEff(1, 1))}x<br>
			Half-life: 1/${getFullExpansion(getShardUpgEff(1.1).pow(-1))} > 1/${getFullExpansion(getShardUpgEff(1.1, 1).pow(-1))}`,
			
			`2x to UM gain<br>+50% to ED gain<br>
			UM gain: ${shortenDimensions(getShardUpgEff(2))}x > ${shortenDimensions(getShardUpgEff(2, 1))}x<br>
			ED gain: ${shortenMoney(getShardUpgEff(2.1))}x > ${shortenMoney(getShardUpgEff(2.1, 1))}x`,
			
			`-15% to VG scaling<br>-50% to VP gain<br>
			VG scaling: ${getFullExpansion(getShardUpgEff(3).multiply(100))}% > ${getFullExpansion(getShardUpgEff(3, 1).multiply(100))}%<br>
			VP gain: 1/${getFullExpansion(getShardUpgEff(3.1).pow(-1))}x > 1/${getFullExpansion(getShardUpgEff(3.1, 1).pow(-1))}x`,
			
			`+60% to VG power<br>+30% to VG scaling<br>
			VG power: ${getFullExpansion(getShardUpgEff(4),1)}x > ${getFullExpansion(getShardUpgEff(4, 1),1)}x<br>
			VG scaling: ${shortenMoney(getShardUpgEff(4.1))}x > ${shortenMoney(getShardUpgEff(4.1, 1))}x`,
			
			`+40% to ED power<br>-20% to VG power<br>
			ED power: ${shortenDimensions(getShardUpgEff(5))}x > ${shortenDimensions(getShardUpgEff(5, 1))}x<br>
			VG power: ${getFullExpansion(getShardUpgEff(5.1).multiply(100))}% > ${getFullExpansion(getShardUpgEff(5.1, 1).multiply(100))}%`,
		][i] + "<br>"
		t += "Cost: " + shortenDimensions(getShardUpgCost(i)) + " DS"
		ge("shardupg" + i).innerHTML = t;
	}
}