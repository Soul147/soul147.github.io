const achievements = 72;

function updateAchievementDescriptions() {
	achievementDescriptions = [
		"The first one's always free", `Buy a single first dimension.`,
		"100 antimatter is a lot", `Buy a single second dimension.`,
		"Half Life 3 unconfirmed", `Buy a single third dimension.`,
		"Hard to imagine", `Buy a single fourth dimension.`,
		"First Death", `Buy a single fifth dimension.`,
		"We could barely afford 9", `Buy a single sixth dimension.`,
		"Praise hevi", `Buy a single seventh dimension.`,
		"90 degrees to infinity", `Buy a single eighth dimension.`,
		"Impossible", `Buy a single ninth dimension.`,
		
		"To Infinity", `Reach ${shortenMoney("1.8e308")} antimatter. Reward: Start with 100 extra antimatter.`,
		"The tenth dimension is a lie", `Get 5 dimension shifts.`, 
		"Boosting to the max", `Get 5 dimension boosts.`,
		"Uh oh", `Get over ${shortenMoney(1e303)} antimatter.`, 
		"You got past the big wall", `Buy an antimatter galaxy.`, 
		"Triple Galaxy", `Have 3 antimatter galaxies at once.`, 
		"Nerf the Galaxies Please", `Have 4 antimatter galaxies at once.`, 
		"There's no point in doing that", `Sacrifice without having any ninth dimensions.`, 
		"Unhevi", `Get over ${shortenMoney(6.66e201)} antimatter with exactly 9 ninth dimensions. Reward: Ninth dimensions are 9% stronger.`,
		
		"The gods are pleased", `Get a multiplier of over 66,666 from dimensional sacrifice. Challenge 8 doesn't count. Reward: Sacrifice is 10% stronger.`,
		"Multidimensional", `Reach ${shortenCosts(1e27)} eighth dimensions.`,
		"Faster than a potato", `Get more than ${shortenCosts(1e16)} ticks per second. Reward: Tickspeed is 1% faster.`,
		"That's a lot of infinities", `Reach infinity 10 times.`,
		"I am speed", `Infinity in under 5 hours. Reward: Start with 1,000 extra antimatter.`,
		"The way it's meant to be", `Reach infinity with 2 or fewer antimatter galaxies. Reward: Tickspeed is 2% faster.`,
		"You didn't need it anyway", `Reach infinity without having any ninth dimensions. Challenge 10 doesn't count. Reward: Dimensions 1-8 are 8% stronger.`,
		"Cast out the heretic", `Reach infinity without ever buying a ninth dimension during the current infinity. Challenge 10 doesn't count.`,
		"I don't believe in gods", `Reach infinity without sacrificing.`,
		
		"Galaxy Cluster", `Buy 100 antimatter galaxies.`,
		"Hoarding infinities", `Have over 1,000 unspent Infinity Points at once.`,
		"Slower than a potato", `Reach infinity without any tickspeed upgrades. Reward: Tickspeed is 5% faster.`,
		"The Grind Begins", `Infinity 1,000 times.`,
		"That's fast!", `Infinity in under an hour. Reward: Start with 200,000 antimatter.`,
		"That sucked", `Complete a challenge.`,
		"Suffer", `Complete challenge 9.`,
		"Confused Screaming", `Reach infinity without any antimatter galaxies. Reward: Tickspeed is 10% faster.`,
		"Hevi would be proud", `Complete all of the challenges.`,
		
		"And Beyond", `Break Infinity.`,
		"Two Infinities at Once", `Reach ${shorten(infp(2))} antimatter. Reward: 2x multiplier to IP.`,
		"Powered Up", `Buy 6 Break Infinity upgrades.`,
		"New Dimensions", `Unlock the first infinity dimension.`,
		"Supersanic", `Infinity in under a minute. Reward: Start with 10 billion antimatter.`,
		"Boosted", `Dimension boost 27 times in a single infinity. Reward: Dimension boosts are 1% stronger.`,
		"Zero Deaths", `Reach infinity without any dimension shifts, boosts, or galaxies. Reward: You can start with dimension shifts in challenges.`,
		"Life is pain", `Complete a challenge in under 3 minutes.`,
		"Suicide is badass", `Get the sum of all challenge times under 3 minutes.`,
		
		"1 million is a lot", `Reach 1 million infinity power.`,
		"Get off of Amazon", `Buy 150 first dimensions in a single infinity. Reward: Dimensions get a multiplier based on the amount bought.`,
		"Oh hey", `Have exactly 69 ninth dimensions at once. Reward: Break Infinity upgrade 3 is 3.14x stronger.`,
		"There better not be 9", `Unlock the second infinity dimension.`,
		"Forever isn't that long", `Infinity in under a second. Reward: Start with ${getFullExpansion(1e25)} antimatter.`,
		"Unholy Infinity", `Get all dimension multipliers over ${shorten(infp())}. Reward: Infinity dimensions are 1% stronger.`,
		"Infinitely Challenging", `Complete Infinity Challenge 1.`,
		"Don't judge me, I'm a sadist", `Complete Infinity Challenge 5.`,
		"Is this hell?", `Get the sum of all challenge times under 5 seconds.`,
		
		"ERROR 909: Dimension Not Found", `Reach infinity with only 1 first dimension. Reward: First dimensions are stronger the more you have.`,
		"INFINITE POWER", `Reach ${shorten(infp())} Infinity Power.`,
		"THIS<BR>ACHIEVEMENT<BR>DOESN'T<BR>EXIST", `Reach 9.9999e9999 antimatter. Reward: Dimensions are more powerful the more antimatter you have.`,
		"You can get 50 galaxies?", `Get 50 galaxies.`,
		"Blink of an Eye", `Infinity in under a tenth of a second. Reward: Start with ${getFullExpansion(1e100)} antimatter.`,
		"Yet another infinity reference", `Get a total sacrifice multiplier of ${shorten(infp())}. Reward: Sacrifice is stronger.`,
		"Hevipelle did nothing wrong", `Complete Infinity Challenge 5 in 10 seconds or less.`,
		"Antichallenged", `Complete all 12 infinity challenges.`,
		"Yes. This is hell.", `Get the sum of all infinity challenge times under 6.66 seconds.`,
		
		"Galaxy Supercluster", `Buy 10,000 antimatter galaxies.`,
		"Ludicrous Speed", `Big Crunch for 1e200 IP in 2 seconds or less.`,
		"I got a few to spare", `Reach ${shorten("1e35000")} antimatter. Reward: Dimensions are more powerful the more antimatter you have.`,
		"All your IP are belong to us", `Big Crunch for ${shorten(infp())} IP.`,
		"Time is Relative", `Go Eternal.`,
		"Maximum Overdrive", `Reach ${shorten(1e303)} IP per minute.`,
		"Oh hey... You're still here?", `Reach ${shorten("1e333")} IP.`,
		"0 degrees from infinity", `Unlock the eighth infinity dimension.`,
		"Are you kidding me?", `Unlock the ninth infinity dimension.`,
		
		"Galaxy Filament", `Buy 1,000,000 antimatter galaxies.`,
		"Is this safe?", `Reach Infinite replicanti in under 30 minutes.`,
		"Minute of Infinity", `Reach Infinite replicanti in under a minute.`,
		"Never tell me the odds", `Eternity without ever having more than one replicanti.`,
		"", ``,
		"", ``,
		"", ``,
		"", ``,
		"", ``,
	]
}

function giveAchievement(id) {
	if(game.achievements.includes(id)) return;
	game.achievements.push(id);
	updateAchievements();
}

function updateAchievements() {
	updateAchievementDescriptions();
	
	for(var i = 0; i < achievements; i++) {
		var a = ge("achievement" + i)
		a.className = game.achievements.includes(i) ? "achievementunlocked" : "achievementlocked"
		a.innerHTML = "<br>" + achievementDescriptions[i * 2] + "<br>" + (devMode ? i : "") 
		a.setAttribute("tooltip", achievementDescriptions[i * 2 + 1])
		a.style.zIndex = 1e6-i;
	}
}

function getAchievementMultiplier() {
	var multiplier = new Decimal(1);
	game.achievementRowsCompleted = 0;
	for(var i = 0; i < achievements; i += 9) {
		var completed = true;
		for(var j = 0; j < 9; j++) {
			if(!game.achievements.includes(i + j)) completed = false;
		}
		if(completed) {
			game.achievementRowsCompleted++;
			multiplier = multiplier.multiply(2);
		}
	}
	return multiplier;
}