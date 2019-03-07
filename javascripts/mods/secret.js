function getSecretAchMult() {
	return Math.round(Math.pow(player.options.secretachbase, getSecretAchAmount()) * 100) / 100;
}

function updateSecretMult(diff) {
	ge("secret").style.display = "block"
	player.options.secretachbase = (ge("secretachbaseinput").value || 15) / 10
	ge("secretachbase").innerHTML = player.options.secretachbase
	ge("secretachbtn").checked = player.options.secretachmult
	
	if(player.options.secretachmult) {
		diff *= getSecretAchMult();
		ge("secretachmult").innerHTML = getFullExpansion(getSecretAchMult());
	}
	else ge("secretachmult").innerHTML = "1"
	
	return diff
}