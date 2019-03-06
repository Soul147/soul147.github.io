// So you can be as lazy as I am.

function updateQoL(diff) {
	// Show extra options tab.

	ge("qoloptionsbtn").style.display = "block"

	// Automatically unlock all eternity milestones. Autobuy bulk dimboosts as much as you want. Never have to rebuy autobuyers after quantums again. It's great.

	if(player.options.qol[0]) if(player.eternities < 100) player.eternities = 100;

	// Automatically unlock all autobuyers once you infinity.

	if(player.options.qol[1]) if(player.infinitied > 0) {
		for(var i = 1; i <= 12; i++) {
			if(!player.challenges.includes("challenge" + i)) player.challenges.push("challenge" + i);
			updateChallenges()
		}
	}

	// Automatically award EC completions for challenges 1-12 when over 1e1300 EP. (They can all be done by then.)

	if(player.options.qol[2]) if(player.eternityPoints.gt("1e1300")) for(var i = 1; i <= 12; i++) {
		player.eternityChalls["eterc" + i] = 5
		updateEternityChallenges()
		// Update this shit because it's not automatic for some reason
		player.dimensionMultDecrease = Math.min(player.dimensionMultDecrease, 3 - player.eternityChalls.eterc6 * 0.2) || 3
		player.tickSpeedMultDecrease = Math.min(player.tickSpeedMultDecrease, 2 - player.eternityChalls.eterc11 * 0.07) || 2
	}

	// Autobuy TDs.

	if(player.options.qol[3]) if(player.eternities > 0) {
		buyMaxTimeDimensions()
	}

	// Autobuy EP multiplier.

	if(player.options.qol[4]) if(player.eternities > 0) {
		buyMaxEPMult()
	}

	// Autobuy time theorems.

	if(player.options.qol[5]) if(player.eternities > 0) {
		maxTheorems()
	}

	// Autobuy dilation upgrades.

	if(player.options.qol[6]) if(player.dilation.studies.length > 0) {
		maxAllDilUpgs();
	}

	// Automatically gain EP. 

	if(player.options.qol[7]) if(gainedEternityPoints().gt(1000)) {
		player.eternityPoints = player.eternityPoints.add(gainedEternityPoints().divide(1000).multiply(diff/10));
	}

	// Max RGs is in game.js

	// Autobuy autobuyers.

	// Update buttons.

	for(var n = 0; n < player.options.qol.length; n++) ge("qolBtn"+n).innerHTML=player.options.qol[n]?"ON":"OFF"
}

function toggleQolOption(n) {
	player.options.qol[n]=!player.options.qol[n];
}