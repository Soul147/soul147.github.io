function gainedOP() {
	return Decimal.pow(10, player.eternityPoints.plus(gainedEternityPoints()).e/(308)).times(player.mods.ngt.opMult || 1).divide(10).floor();
}

function omnipotenceReset() {
	if(player.eternityPoints.add(gainedEternityPoints()).lt(1e308)) return;
	
	keepInf = player.mods.ngt.omni > 5**0
	keepBreak = player.mods.ngt.omni > 5**1
	keepEter = player.mods.ngt.omni > 5**2
	keepStudy = player.mods.ngt.omni > 5**3
	keepDilation = player.mods.ngt.omni > 5**4
	keepMastery = player.mods.ngt.omni > 5**5 && player.masterystudies
	
	if(ngt.thisOmni > 1200) dev.omniAnim(5 - !!player.mods.ngt.omni*4);
	player.mods.ngt.omni++;
	player.mods.ngt.op = player.mods.ngt.op.add(gainedOP());
	
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
		infinityUpgrades: keepInf ? player.infinityUpgrades : [],
		setsUnlocked: player.setsUnlocked,
		infinityPoints: player.infinityPoints,
		infinitied: 0,
		infinitiedBank: player.infinitiedBank,
		totalTimePlayed: player.totalTimePlayed,
		bestInfinityTime: 9999999999,
		thisInfinityTime: 0,
		resets: keepInf ? 4 : 0,
		dbPower: player.dbPower,
		tickspeedBoosts: player.tickspeedBoosts,
		galaxies: keepInf ? 1 : 0,
		galacticSacrifice: resetGalacticSacrifice(),
		totalmoney: player.totalmoney,
		interval: null,
		lastUpdate: player.lastUpdate,
		achPow: player.achPow,
		autobuyers: player.autobuyers,
		partInfinityPoint: 0,
		partInfinitied: 0,
		break: keepBreak ? player.break : false,
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
		tickSpeedMultDecrease: keepBreak ? player.tickSpeedMultDecrease : GUBought("gb4") ? 1.25 : 10,
		tickSpeedMultDecreaseCost: keepBreak ? player.tickSpeedMultDecreaseCost : 3e6,
		dimensionMultDecrease: keepBreak ? player.dimensionMultDecrease : 10,
		dimensionMultDecreaseCost: keepBreak ? player.dimensionMultDecreaseCost : 1e8,
		extraDimPowerIncrease: keepBreak ? player.extraDimPowerIncrease : 0,
		dimPowerIncreaseCost: keepBreak ? player.dimPowerIncreaseCost : 1e3,
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
		eternities: player.eternities * 0.05,
		eternitiesBank: (player.eternitiesBank || 0) + player.eternities * 0.05,
		thisEternity: 0,
		bestEternity: player.bestEternity,
		eternityUpgrades: keepEter ? player.eternityUpgrades : [],
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
		offlineProd: keepBreak ? player.offlineProd : 0,
		offlineProdCost: keepBreak ? player.offlineProdCost : 1e7,
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
		timestudy: keepStudy ? player.timestudy : {
			theorem: 0,
			amcost: new Decimal("1e20000"),
			ipcost: new Decimal(1),
			epcost: new Decimal(1),
			studies: [],
		},
		eternityChalls: {},
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
			studies: keepDilation ? player.dilation.studies : [],
			active: false,
			tachyonParticles: player.achievements.includes("ng3p37") ? player.dilation.bestTP.sqrt() : new Decimal(0),
			dilatedTime: new Decimal(0),
			totalTachyonParticles: new Decimal(0),
			bestTP: player.dilation.bestTP,
			nextThreshold: new Decimal(1000),
			freeGalaxies: 0,
			upgrades: keepDilation ? player.dilation.upgrades : [],
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
		masterystudies: player.masterystudies ? (keepMastery ? player.masterystudies : []) : undefined,
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
		d.opBought = d.opBought.add(1);
	}
	
	else {
		if(ngt.gravitons.lt(d.gCost)) return;
		ngt.gravitons = ngt.gravitons.subtract(d.gCost)
		d.gBought = d.gBought.add(1);
	}
	
	d.amount = d.amount.add(1);
	updateOmniDimCosts();
	return true;
}

// I'll make a more efficient version later.

function buyMaxOmniDimensions() {
	for(var i = 1; i <= 8; i++) {
		while(buyOmniDimension(i));
		while(buyOmniDimension(i, true));
	}
}

function updateOmniDimCosts() {
	for(var i = 1; i <= 8; i++) {
		d = ngt["d" + i];
		// Set multiplier
		d.mult = ngt.omniPower.pow(Decimal.add(d.gBought, d.opBought)).multiply(getReplicatorMult());
		// Set cost multiplier
		d.gCost = d.gBaseCost.multiply(d.gCostMult.pow(d.gBought))
		d.opCost = d.opBaseCost.multiply(d.opCostMult.pow(d.opBought))
	}
}

function getGravitonEffect() {
	return ngt.gravitons.pow(7).max(1);
}

function getReplicatorMult() {
	ret = new Decimal(1)
	for(var i = 1; i <= 8; i++) {
		ret = ret.multiply(Math.log10(Math.max(ngt["r"+i].amount.logarithm,0)+1)+1)
	}
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

// Hyperstudies

