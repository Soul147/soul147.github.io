const achievements = 45;

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
		"Triple Galaxy", `Buy 2 antimatter galaxies.`, 
		"Intergalactic", `Buy 3 antimatter galaxies.`, 
		"There's no point in doing that", `Sacrifice without having any ninth dimensions.`, 
		"Unhevi", `Get over ${shortenMoney(6.66e201)} antimatter with exactly 9 ninth dimensions. Reward: Ninth dimensions are 9% stronger.`,
		
		"The gods are pleased", `Get a multiplier of over 66,666 from dimensional sacrifice. Challenge 8 doesn't count. Reward: Sacrifice is 10% stronger.`,
		"Cast out the heretic", `Reach infinity without ever buying a ninth dimension. Challenge 10 doesn't count. Reward: Dimensions 1-8 are 8% stronger.`,
		"The grind begins", `Get 1,000 infinities.`,
		"Hoarding infinities", `Have over 1,000 unspent Infinity Points.`,
		"I am speed", `Infinity in under an hour. Reward: Start with 1,000 extra antimatter.`,
		"That sucked", `Complete a challenge.`,
		"Suffer", `Complete challenge 9.`,
		"Hevi would be proud", `Complete all of the challenges. Reward: You can start with dimension shifts in challenges.`,
		"I don't believe in gods", `Reach infinity without sacrificing.`,
		
		"And Beyond", `Break Infinity.`,
		"New Dimensions", `Unlock the first infinity dimension.`,
		"Life is pain", `Complete a challenge in under 3 minutes.`,
		"Suicide is badass", `Get the sum of all challenge times under 3 minutes.`,
		"That's fast!", `Infinity in under a minute.`,
		"1 million is a lot", `Reach 1 million infinity power.`,
		"Get off of Amazon", `Buy 150 of a single dimension in one infinity. Reward: Dimensions get a multiplier based on the amount bought.`,
		"There better not be 9", `Unlock the second infinity dimension.`,
		"Is this hell?", `Get the sum of all challenge times under 5 seconds.`,
		
		"Oh hey", `Have exactly 69 ninth dimensions.`,
		"Infinitely Challenging", `Complete Infinity Challenge 1.`,
		"Don't judge me, I'm a sadist", `Complete Infinity Challenge 5.`,
		"That's a lot of infinities", `Get all dimension multipliers over ${shorten(Number.MAX_VALUE)}. Reward: Infinity dimensions are 1% stronger.`,
		"Supersanic", `Infinity in under a second.`,
		"", ``,
		"", ``,
		"", ``,
		"Yes. This is hell.", `Get the sum of all infinity challenge times under 6.66 seconds.`,
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
		a.innerHTML = achievementDescriptions[i * 2]
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