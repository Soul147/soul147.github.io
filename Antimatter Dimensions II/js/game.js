function updateDimensionSet(name="dimension", abbr="", curr="") {
	var Name = name[0].toUpperCase() + name.slice(1)
	
	for(var i = 10; i >= 0; i--) {
		if(i != 10) {
			let dimProduction = window["get" + Name + "Production"](i + 1).multiply(getTickspeed(name))
			game[name + "s"][i].amount = game[name + "s"][i].amount.add(dimProduction.multiply(diff/1000));
			if (i != 9) ge(abbr + "dimgrowth" + i).textContent = game[name + "s"][i].amount.eq(0)?"":"(+" + shorten(dimProduction.divide(game[name + "s"][i].amount).multiply(100)) + "%/s)"
		}
		
		if (i) {
			let display =
			game[name + "s"][i - 1].amount.gt(0) && (
				name == "dimension" ?
				game.shifts + 4 >= i : 
			name == "infinityDimension" ? 
				game.infinityShifts >= i : 
				true
			)

			if (display) {
				ge(abbr + "dimamount" + i).textContent = shortenMoney(game[name + "s"][i].amount)
				ge(abbr + "dimmult" + i).textContent = shorten(game[name + "s"][i].multiplier)
				ge(abbr + "dimbuy" + i).textContent = "Cost: " + shortenCosts(game[name + "s"][i].cost) + curr
				ge(abbr + "dimbuy" + i).className = window["canBuy" + Name](i) ? "buy" : "lock"
			}
			ge(abbr + "dimDisplay" + i).style.display = display?"":"none"
		}
	}
}

function update() {
	diff = Date.now() - game.lastUpdate || 0;
	game.lastUpdate = Date.now()
	
	diff *= parseInt(localStorage.hacker) || 1;
	
	setTimeout(update, 1000 / game.options.fps)
	
	game.dimMult = new Decimal(2);
	if(game.infinityUpgrades.includes(5)) game.dimMult = game.dimMult.multiply(1.1)
	
	updateDimensionSet("dimension")
	updateDimensionSet("infinityDimension", "inf", " IP")
	// updateDimensionSet("timeDimension", "time", " EP")
	game.totalAntimatter = game.totalAntimatter.add(getDimensionProduction(1).multiply(getTickspeed("dimension")).multiply(diff/1000));
	
	ge("antimatter").textContent = getFullExpansion(game.dimensions[0].amount)
	ge("antimatterGrowth").textContent = getFullExpansion(getDimensionProduction(1).multiply(getTickspeed("dimension")))
	
	ge("infinityPower").textContent = getFullExpansion(game.infinityDimensions[0].amount)
	ge("infinityPowerEffect").textContent = shorten(getInfinityPowerEffect())
	ge("infinityPowerGrowth").textContent = getFullExpansion(getInfinityDimensionProduction(1).multiply(getTickspeed()))
	
	ge("tickspeed").textContent = shorten(getTickspeed("dimension"));
	ge("buyTickspeed").textContent = "Cost: " + shortenCosts(game.tickspeed.cost);
	ge("buyTickspeed").className = ge("maxTickspeed").className = canBuyTickspeed() ? "buy" : "lock"
	
	ge("sacrificeContainer").style.display = game.dimensions[9].amount.eq(0)?"none":""
	ge("sacrifice").className = "buy"
	ge("sacrifice").textContent = "Dimensional Sacrifice (" + shorten(getSacrificeGain()) + "x)"
	ge("sacrificePower").textContent = shorten(game.sacrificeMult)
	
	ge("shifts").textContent = game.shifts;
	ge("shiftReq").textContent = tierNames[game.shifts+4]
	ge("shift").className = canShift() ? "buy" : "lock"
	
	ge("boosts").textContent = getFullExpansion(getEffectiveDimensionBoosts());
	ge("boostReq").textContent = getFullExpansion(getDimensionBoostReq().ceil());
	ge("boost").className = canBoost() ? "buy" : "lock" 
	
	ge("galaxies").textContent = getFullExpansion(getEffectiveNormalGalaxies());
	ge("galaxyReq").textContent = getFullExpansion(getGalaxyReq());
	ge("galaxy").className = canGalaxy() ? "buy" : "lock" 
	
	displayIf("shiftDisplay", game.shifts < 5);
	displayIf("boostDisplay", game.shifts == 5);
	displayIf("galaxyDisplay", game.shifts == 5);
	displayIf("sacrificeDisplay", game.shifts == 5)
	
	ge("boostName").textContent = getEffectiveDimensionBoosts().gte(getDimensionHypersonicStart()) ? "Dimension Hypersonic" : game.boosts.gte(getDimensionSupersonicStart()) ? "Dimension Supersonic" : "Dimension Boost"
	ge("galaxyName").textContent = getEffectiveNormalGalaxies().gte(getDarkGalaxyStart()) ? "Dark Antimatter Galaxies" : getEffectiveNormalGalaxies().gte(getRemoteGalaxyStart()) ? "Remote Antimatter Galaxies" : game.galaxies.gte(getDistantGalaxyStart()) ? "Distant Antimatter Galaxies" : "Antimatter Galaxies"
	ge("boostPower").textContent = shorten(getDimensionBoostPower(), 2, 1)
	ge("boostEffect").textContent = "(" + shorten(getDimensionBoostEffect()) + "x on all dimensions)"
	ge("galaxyPower").textContent = shortenMoney(getDimensionBoostPower())
	ge("galaxyEffect").innerHTML = getTickPower().gte(2) ? "x" + shorten(getTickPower()) : "+" + shorten(getTickPower().subtract(1).multiply(100)) + "%"

	if(game.infinityUpgrades.includes(3)) game.shifts = Math.max(game.shifts, 2);
	if(game.infinityUpgrades.includes(7)) game.shifts = Math.max(game.shifts, 4);
	if(game.infinityUpgrades.includes(11)) {
		game.shifts = Math.max(game.shifts, 5);
		game.galaxies = Decimal.max(game.galaxies, 1);
	}

	game.tickCostMultIncrease = 10 - game.repeatInf[0].bought;
	game.dimCostMultIncrease = 10 - game.repeatInf[2].bought;

	displayIf("infinityTabButton", game.infinities.gt(0))

	gc("infinityPoints", function(e) {
		e.textContent = shortenMoney(game.infinityPoints.floor())
	})

	if (game.currentTab == "infinity") {
		var infinityUpgradeDescriptions = [
			"Multiplier on all dimensions based on total existence time<br>Currently: " + shorten(getInfinityUpgradeEffect(0)) + "x",
			"Multiplier on all dimensions based on time in this infinity<br>Currently: " + shorten(getInfinityUpgradeEffect(1)) + "x",
			"Multiplier for unspent infinity points on first dimensions<br>Currently: " + shorten(getInfinityUpgradeEffect(2)) + "x",
			"You start with the fifth and sixth dimensions unlocked",
			"Dimensions 1-3 gain a multiplier based on infinities<br>Currently: " + shorten(getInfinityUpgradeEffect(4)) + "x",
			"Dimension upgrade multiplier is 10% stronger",
			"Multiplier for unspent infinity points on all dimensions<br>Currently: " + shorten(getInfinityUpgradeEffect(6)) + "x",
			"You start with the seventh and eighth dimensions unlocked",
			"Dimensions 4-6 gain a multiplier based on infinities<br>Currently: " + shorten(getInfinityUpgradeEffect(4)) + "x",
			"Dimension boost multiplier is 25% stronger",
			"Infinity point generation based on fastest infinity",
			"You start with the ninth dimensions unlocked and one galaxy",
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
	for(var i = 0; i < 32; i++) {
		ge("infinityUpgrade" + i).className = game.infinityUpgrades.includes(i) ? "infinityUpgradeBought" : canBuyInfinityUpgrade(i) ? "infinityUpgrade" : "infinityUpgradeLocked";
		ge("infinityUpgradeDesc" + i).innerHTML = infinityUpgradeDescriptions[i];
		ge("infinityUpgradeCost" + i).innerHTML = shortenCosts(infinityUpgradeCosts[i]) + " IP";
	}
	
	var text = ""
	if(game.infinityUpgrades.includes(10)) {
		game.infinityPoints = game.infinityPoints.add(getInfinityPointMult().multiply(getInfinityUpgradeEffect(10)).multiply(diff));
		text += "You generate " + shortenMoney(getInfinityPointMult()) + " IP ";
	}
	if(game.infinityUpgrades.includes(14)) {
		game.infinities = game.infinities.add(getInfinityUpgradeEffect(10) * diff);
		text += "and 1 infinity ";
	}
	if(text.length) text += "every " + timeDisplay(1 / getInfinityUpgradeEffect(10)) + "."
	ge("infinityPointGeneration").textContent = text;
	ge("breakButton").textContent = game.break?"FIX INFINITY" : "BREAK INFINITY"
	}

	c = game.dimensions[0].amount.gte(Number.MAX_VALUE) && !(game.bestInfinityTime < 60000 || game.break);
	displayIf("tabButtons", !c)
	
	if(c) {
		if(!lastTab) {
			lastTab = game.currentTab;
		}
		showTab("bigCrunch")
	}
	
	displayIf("infinityTabs", game.infinityUpgrades.length > 15)
	
	var rate = gainedInfinityPoints().divide(getTimeSince("infinity")/60000)
	if(!game.bestIPRate || game.bestIPRate.lt(rate)) {
		game.bestIPRate = rate;
		game.bestIPRateAt = gainedInfinityPoints()
	}

	displayIf("gainedIP", (game.bestInfinityTime < 60000 && atInfinity()) || game.break);
	ge("gainedIP").style.fontSize = game.break ? "11px" : "30px"
	ge("gainedIP").innerHTML = game.break ? 
		"<b>Big Crunch for " + shortenMoney(gainedInfinityPoints()) + "<br>Infinity Points.</b><br>" + 
		shorten(rate) + " IP/min<br>Peak: " + 
		(game.options.showBestRateAt ? shorten(game.bestIPRateAt) + " IP" : shorten(game.bestIPRate) + " IP/min") : "<b>Big Crunch</b>"
	
	ge("antimetal").textContent = getFullExpansion(game.antimetal)
	displayIf("dimensionTabs", game.break)
	displayIf("automationTabs", game.break)
	
	displayIf("postInfinityUpgrades", game.break)

	ge("repeatInf0").innerHTML = "Tickspeed cost multiplier increase<br>" + game.tickCostMultIncrease + "x" + (game.repeatInf[0].bought.lt(8) ? " > " + (game.tickCostMultIncrease-1) + "x<br>Cost: " + shortenMoney(getRepeatInfCost(0)) + " IP" : "")
	ge("repeatInf1").innerHTML = "Multiply IP gain by 2<br>Currently: " + shortenMoney(Decimal.pow(2, game.repeatInf[1].bought)) + "x<br>Cost: " + shortenMoney(getRepeatInfCost(1)) + " IP"
	ge("repeatInf2").innerHTML = "Dimension cost multiplier increase<br>" + game.dimCostMultIncrease + "x" + (game.repeatInf[2].bought.lt(7) ? " > " + (game.dimCostMultIncrease-1) + "x<br>Cost: " + shortenMoney(getRepeatInfCost(2)) + " IP" : "")
	
	ge("repeatInf0").className = game.repeatInf[0].bought.gt(7) ? "infinityUpgradeBought" : canBuyRepeatInf(0) ? "infinityUpgrade" : "infinityUpgradeLocked"
	ge("repeatInf1").className = canBuyRepeatInf(1) ? "infinityUpgrade" : "infinityUpgradeLocked"
	ge("repeatInf2").className = game.repeatInf[2].bought.gt(6) ? "infinityUpgradeBought" : canBuyRepeatInf(2) ? "infinityUpgrade" : "infinityUpgradeLocked"

	ge("infinityshiftcost").textContent = shortenCosts(infDimensionUnlockRequirements[game.infinityShifts+1])
	displayIf("infinityPowerArea", game.infinityShifts > 0)
	ge("infinityshift").className = canInfinityShift() ? "buy" : "lock"

	if(game.currentTab == 'statistics') ge("statistics").innerHTML = getStatisticsDisplay()

	if(game.infinities.gt(0)) {
		galaxy();
		boost();
		shift();
		maxAll();
	}
	// if(gainedInfinityPoints().gt(420)) bigCrunch();
}

function getStatisticsDisplay() {
	let lines = []
	lines.push(`You have made a total of ${getFullExpansion(game.totalAntimatter)} antimatter.`)
	lines.push("")
	if (game.infinities.gt(0)) {
		lines.push(`You have gone infinite ${getFullExpansion(game.infinities)} times.`)
		lines.push(`Your fastest infinity is in ${timeDisplay(game.bestInfinityTime)}.`)
		lines.push(`You have spent ${timeDisplay(getTimeSince("infinity"))} in this infinity.`)
		lines.push("")
	}
	lines.push(`You have existed for ${timeDisplay(getTimeSince("start"))}.`)
	return lines.join("<br>")
}

showTab(game.options.saveTabs ? game.currentTab : "dimensions")
showDimensionTab(game.options.saveTabs ? game.currentDimensionTab : "normal")
showInfinityTab(game.options.saveTabs ? game.currentInfinityTab : "infinityUpgrades")
showAutomationTab(game.options.saveTabs ? game.currentAutomationTab : "dimension")

update();

setInterval(save, 30000)
