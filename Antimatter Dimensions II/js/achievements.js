const achievements = 18;

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
		
		"To Infinity", `Reach ${shortenMoney("1.8e308")} antimatter.`,
		"The tenth dimension is a lie", `Get 5 dimension shifts.`, 
		"Boosting to the max", `Get 5 dimension boosts.`,
		"Uh oh", `Get over ${shortenMoney(1e80)} antimatter.`, 
		"You got past the big wall", `Buy an antimatter galaxy.`, 
		"Triple galaxy", `Buy 2 antimatter galaxies.`, 
		"Intergalactic", `Buy 3 antimatter galaxies.`, 
		"There's no point in doing that", `Sacrifice without having any ninth dimensions.`, 
		"Unhevi", `Have exactly 9 ninth dimensions. Reward: Ninth dimensions are 9% stronger.`,
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