function updateAutomator() {
	
}

function upgradeAutomator() {
	var a = game.automator;
	if(a.antimetal.lt(Decimal.pow(8, a.level))) return;
}