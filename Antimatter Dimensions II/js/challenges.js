function inChallenge(i) {
	return game.challenges.running.includes(i);
}

function startChallenge(i) {
	game.challenges.running = [i]
	
	bigCrunch(true);
}

// this is a work in progress