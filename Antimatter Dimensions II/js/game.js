function updateDimensionSet(name="dimension", abbr="", curr="") {
	var Name = name[0].toUpperCase() + name.slice(1)
	
	var c12 = inChallenge(12) && name == "dimension";
	
	for(var i = 10; i >= 0; i--) {
		if(i < 10-c12) {
			var tickspeed = inChallenge(7) ? 1 : getTickspeed(name);
			var dimProduction = window["get" + Name + "Production"](i + 1).multiply(tickspeed).multiply(getChallengeMultiplier(name))
			if(c12) var dimProductionUp = window["get" + Name + "Production"](i + 2).multiply(tickspeed).multiply(getChallengeMultiplier(name))
			var realProduction = i ? (c12 ? dimProductionUp : dimProduction) : (c12 ? dimProduction.divide(100).add(dimProductionUp) : dimProduction);
			game[name + "s"][i].amount = game[name + "s"][i].amount.add(realProduction.multiply(diff/1000));
			if (i < 9-c12) ge(abbr + "dimgrowth" + i).textContent = game[name + "s"][i].amount.eq(0)?"":"(+" + shorten(realProduction.divide(game[name + "s"][i].amount).multiply(100)) + "%/s)"
		}
		
		if (i) {
			var display =
			game[name + "s"][i - 1].amount.gt(0) && (
				name == "dimension" ?
				game.shifts + 4 >= i : 
			name == "infinityDimension" ? 
				game.infinityShifts.gte(i) : 
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
	if(inChallenge(2)) game.dimMult = game.dimMult.multiply(0.8)
	
	updateDimensionSet("dimension")
	updateDimensionSet("infinityDimension", "inf", " IP")
	// updateDimensionSet("timeDimension", "time", " EP")
	game.totalAntimatter = game.totalAntimatter.add(getDimensionProduction(1).multiply(getTickspeed("dimension")).multiply(diff/1000));
	
	ge("antimatter").textContent = getFullExpansion(game.dimensions[0].amount)
	ge("antimatterGrowth").textContent = getFullExpansion(getDimensionProduction(1).multiply(inChallenge(7) ? 1 : getTickspeed("dimension")))
	
	ge("infinityPower").textContent = getFullExpansion(game.infinityDimensions[0].amount)
	ge("infinityPowerEffect").textContent = shorten(getInfinityPowerEffect())
	ge("infinityPowerGrowth").textContent = getFullExpansion(getInfinityDimensionProduction(1).multiply(getTickspeed("infinityDimension")))
	
	ge("tickspeed").textContent = inChallenge(7) ? "" : shorten(getTickspeed("dimension"));
	ge("buyTickspeed").textContent = "Cost: " + shortenCosts(game.tickspeed.cost);
	ge("buyTickspeed").className = ge("maxTickspeed").className = canBuyTickspeed() ? "buy" : "lock"
	
	ge("dimMult").textContent = shorten(game.dimMult, 2, 1)
	
	displayIf("sacrificeContainer", game.shifts == 5)
	ge("sacrifice").className = "buy"
	ge("sacrifice").textContent = "Dimensional Sacrifice (" + shorten(getSacrificeGain()) + "x)"
	ge("sacrificePower").textContent = shorten(game.sacrificeMult)
	
	ge("shifts").textContent = game.shifts;
	ge("shiftReq").textContent = tierNames[game.shifts+4]
	ge("shift").className = canShift() ? "buy" : "lock"
	
	ge("boosts").textContent = getFullExpansion(getEffectiveDimensionBoosts());
	dr = getDimensionBoostReq()
	ge("boostReq").textContent = (inChallenge(10) ? getFullExpansion(dr, 2) + " fourth " : getFullExpansion(dr.ceil()) + " ninth ");
	ge("boost").className = canBoost() ? "buy" : "lock" 
	
	ge("galaxies").textContent = getFullExpansion(getEffectiveNormalGalaxies());
	ge("galaxyReq").textContent = getFullExpansion(getGalaxyReq()) + (inChallenge(10) ? " fourth " : " ninth ");
	ge("galaxy").className = canGalaxy() ? "buy" : "lock" 
	
	displayIf("shiftDisplay", game.shifts < 5 && !inChallenge(10));
	displayIf("boostDisplay", game.shifts == 5 || inChallenge(10));
	displayIf("galaxyDisplay", game.shifts == 5 || inChallenge(10));
	displayIf("sacrificeDisplay", game.shifts == 5)
	
	ge("boostName").textContent = getEffectiveDimensionBoosts().gte(getDimensionHypersonicStart()) ? "Dimension Hypersonic" : game.boosts.gte(getDimensionSupersonicStart()) ? "Dimension Supersonic" : "Dimension Boost"
	ge("galaxyName").textContent = getEffectiveNormalGalaxies().gte(getDarkGalaxyStart()) ? "Dark Antimatter Galaxies" : getEffectiveNormalGalaxies().gte(getRemoteGalaxyStart()) ? "Remote Antimatter Galaxies" : game.galaxies.gte(getDistantGalaxyStart()) ? "Distant Antimatter Galaxies" : "Antimatter Galaxies"
	ge("boostPower").textContent = shorten(getDimensionBoostPower(), 2, 1)
	ge("boostEffect").textContent = "(" + shorten(getDimensionBoostEffect()) + "x on all dimensions)"
	ge("galaxyPower").textContent = shortenMoney(getGalaxyPower(), 2, 1)
	ge("galaxyEffect").innerHTML = inChallenge(7) ? "x" + shorten(getTickPower().pow(7)) + " on 9th dimensions" : getTickPower().gte(2) ? "x" + shorten(getTickPower()) : "+" + shorten(getTickPower().subtract(1).multiply(100)) + "%"

	game.tickCostMultIncrease = 10 - game.repeatInf[0].bought;
	game.dimCostMultIncrease = 10 - game.repeatInf[2].bought;

	displayIf("infinityTabButton", game.infinities.gt(0))
	displayIf("challengesTabButton", game.infinityUpgrades.length > 15)
	// displayIf("automationTabButton", getChallengeCompletions()) // Note to self: Finish this you lazy motherfucker

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
			"Power up all dimensions based on current antimatter<br>Currently: " + shorten(getInfinityUpgradeEffect(17)) + "x",
			"Power up all dimensions based on total antimatter produced<br>Currently: " + shorten(getInfinityUpgradeEffect(18)) + "x",
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
		ge("breakButton").setAttribute("tooltip", 
			getChallengeCompletions() >= 10 ? 
				`Allows numbers to exceed ${shorten(Number.MAX_VALUE)}, increasing infinity point gain.` : 
				`10 challenge completions are required to break infinity.
				Progress: ${getChallengeCompletions()} / 10`
		)
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
	ge("gainedIP").style.fontSize = game.break || inChallenge() ? "11px" : "30px"
	ge("gainedIP").innerHTML = getChallengeSet() == 1 || getChallengeSet == 2 ? 
		(canCompleteChallenge() ? "Big Crunch to complete challenge." : "Reach " + shortenMoney(getChallengeRequirement()) + " antimatter to complete challenge.") : 
		game.break ? 
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

	ge("infinityshiftcost").textContent = shortenCosts(getInfinityShiftCost())
	displayIf("infinityPowerArea", game.infinityShifts.gt(0))
	ge("infinityshift").className = canInfinityShift() ? "buy" : "lock"

	ge("challengeInfo").style.left = innerWidth / 2 - 175;
	ge("challengeInfo").style.top = 290;
	
	displayIf("challengeMultiplier", inChallenge(4) || inChallenge(5) || inChallenge(6))
		
	ge("challengeMultiplier").innerHTML = "<br>Challenge production factor: " + getChallengeMultiplier().multiply(100).toFixed(2) + "%"
	
	if(game.currentTab == "challenges") {
		updateChallengeDescriptions();
		ge("challengeDescription").innerHTML = challengeDescriptions[selectedChallenge+selectedChallengeType*12]
	}	
	
	if(game.currentTab == "statistics") {
		ge(game.currentStatisticsTab + "StatisticsTab").innerHTML = getStatisticsDisplay(game.currentStatisticsTab)
	}

	// Achievement checks
	
	ge("achievementCompletions").innerText = getFullExpansion(game.achievements.length) + " / " + getFullExpansion(achievements);
	ge("achievementMultiplier").innerText = getFullExpansion(getAchievementMultiplier());
	ge("achievementRowCompletions").innerText = getFullExpansion(game.achievementRowsCompleted);

	if(game.shifts == 5) giveAchievement(10);
	if(game.boosts.gte(5)) giveAchievement(11);
	
	if(game.galaxies.gt(0)) giveAchievement(13)
	if(game.galaxies.gt(1)) giveAchievement(14)
	if(game.galaxies.gt(2)) giveAchievement(15)

	if(game.dimensions[0].amount.gt(1e303)) giveAchievement(12)
	if(game.dimensions[0].amount.gte(6.66e201) && game.dimensions[9].amount.eq(9)) giveAchievement(17)
	if(game.sacrificeMult.gte(66666) && !inChallenge(8)) giveAchievement(18)
	if(game.infinities.gt(1e3)) giveAchievement(20)
	if(game.infinityPoints.gt(1e3)) giveAchievement(21)
	if(game.dimensions[0].amount.gte(Number.MAX_VALUE) && game.sacrificeMult.eq(1)) giveAchievement(26)
	if(game.break) giveAchievement(27)
	if(game.infinityShifts.gt(0)) giveAchievement(28)
	if(getChallengeTimes() < 180000) giveAchievement(30)
	if(game.infinityDimensions[0].amount.gt(1e6)) giveAchievement(32)
	if(game.dimensions[1].bought.gte(150)) giveAchievement(33)
	if(game.infinityShifts.gt(0)) giveAchievement(34)
	if(getChallengeTimes() < 180000) giveAchievement(35)
	if(game.dimensions[9].amount.eq(69)) giveAchievement(36)
		
	ge("autosaveOption").innerHTML = "Autosave: " + ["Off", "On"][!!game.options.autosave+0]
	ge("saveTabsOption").innerHTML = "Save Tabs: " + ["Off", "On"][!!game.options.saveTabs+0]
	ge("automateOption").innerHTML = "Auto Max All: " + ["Off", "On"][!!game.options.automate+0]

	if(game.options.automate) {
		galaxy();
		// boost();
		shift();
		maxAll();
	}
	// if(gainedInfinityPoints().gt(420)) bigCrunch();
}

function getStatisticsDisplay(type) {
	let lines = []
	switch(type) {
		case "normal":
			lines.push(`You have made a total of ${getFullExpansion(game.totalAntimatter)} antimatter.`)
			lines.push("")
			if (game.infinities.gt(0)) {
				lines.push(`You have gone infinite ${getFullExpansion(game.infinities)} times.`)
				lines.push(`Your fastest infinity is in ${timeDisplay(game.bestInfinityTime)}.`)
				lines.push(`You have spent ${timeDisplay(getTimeSince("infinity"))} in this infinity.`)
				lines.push("")
			}
			lines.push(`You have existed for ${timeDisplay(getTimeSince("start"))}.`)
			break;
		case "challenge":
			for(var i = 0; i < 12; i++) lines.push(`Challenge ${i+1} Record: ${game.challenges[0][i].completed ? timeDisplay(game.challenges[0][i].bestTime) : "N/A"}`)
			lines.push(`<br>Sum of all challenge times is ${timeDisplay(getChallengeTimes())}`)
			break;
	}
	return lines.join("<br>")
}

showTab(game.options.saveTabs ? game.currentTab : "dimensions")
showDimensionTab(game.options.saveTabs ? game.currentDimensionTab : "normal")
showStatisticsTab(game.options.saveTabs ? game.currentStatisticsTab : "normal")
showInfinityTab(game.options.saveTabs ? game.currentInfinityTab : "infinityUpgrades")
showAutomationTab(game.options.saveTabs ? game.currentAutomationTab : "dimension")

update();
updateAchievements()

setInterval(function() {if(game.options.autosave) save()}, 30000)
