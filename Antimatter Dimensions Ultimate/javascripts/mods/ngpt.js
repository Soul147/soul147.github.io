function resetNGPT(hardReset) {
	ngpt = player.mods.ngpt = {
		forge: {
			cores: 0,
			totalCores: 0
		}
	}
}

function updateForge() {
	ngpt = player.mods.ngpt;
	forge = ngpt.forge;
	
	// UI
	
	ge("cores").innerHTML = getFullExpansion(forge.cores) + " / " + getFullExpansion(forge.totalCores)
}