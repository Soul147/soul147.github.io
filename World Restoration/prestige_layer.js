function PrestigeLayer(p) {
	this.layerNumber = game.layers.length;
	
	this.pName = p.pName;								// Name of prestige layer
	this.pAbbr = p.pAbbr;								// Abbreviation of the layer name
	this.cName = p.cName;								// Name of gained currency on prestige
	this.pcName = p.pcName;								// Name of previous currency
	this.upgrades = []									// List of bought upgrades for this layer
	this.upgradeCosts = upgradeCosts;					// Costs of nonrebuyable upgrades
	for(i in this.upgradeCosts) this.upgradeCosts[i] = new Decimal(this.upgradeCosts[i]);
	this.currencyMultipliersBought = new Decimal(0);	// Upgrades which increase currency gain
	this.hasCostReduction = p.hasCostReduction;			// Whether or not this layer has upgrades that reduce FR cost
	this.costReductionBought = new Decimal(0);			// How many cost reduction upgrades have been bought

	// Prestige function
	
	this.prestige = function() {
		if(gainedKeys().lt(1)) return;
		game.newEpisode = game.newEpisode.add(1);
		game.keys = game.keys.add(gainedKeys());
		prestige(0);
	}
	
	this.gainedCurrency = function() {
		return game[this.pcName].divide(Decimal.pow(1e3, this.layerNumber)).pow(1/(2+this.layerNumber/2)).multiply(this.getCurrencyMultiplier());
	}
	
	// Functions that handle consistent repeatable upgrades

	this.getCurrencyMultiplier = function() {
		return Decimal.pow(1.05, this.currencyMultipliersBought)
	}
	
	this.getCurrencyMultiplierCost = function() {
		return Decimal.pow(1.2+0.1*this.layerNumber, this.currencyMultipliersBought)
	}

	this.getCurrencyCostReduction = function() {
		return Decimal.pow(1/0.85, this.costReductionBought)
	}
	
	this.getCostReduction = function() {
		return Decimal.pow(1.15+0.025*this.layerNumber, this.costReductionBought)
	}

	function buyCurrencyMultiplier(auto) {
		if(game.keys.lt(game.keyMultiplierCost.multiply(1+!!auto*9))) return;
		game.keys = game.keys.subtract(game.keyMultiplierCost);
		game.keyMultiplier = game.keyMultiplier.multiply(1.05);
		game.keyMultiplierCost = game.keyMultiplierCost.multiply(1.2);
		return true;
	}

	function buyCostReduction(auto) {
		if(game.keys.lt(game.keyReductionCost.multiply(1+!!auto*9))) return;
		game.keys = game.keys.subtract(game.keyReductionCost);
		game.keyReductionUpgrades = game.keyReductionUpgrades.add(1)
		game.keyReductionCost = game.keyReductionCost.multiply(1.5);
		return true;
	}
	
	// Functions that handle nonrepeatable upgrades

	this.buyUpgrade = function(u) {
		if(this.upgrades.includes(u)) return;
		if(this.currency.lt(this.upgradeCosts[u])) return;
		this.upgrades.push(u)
		this.currency = this.currency.subtract(this.upgradeCosts[u]);
	}

	this.getUpgradeEffect = function(u) {
		switch(u) {
			case 0:
				return game.keys.add(1).log10().add(1).pow(3)
			case 1:
				return Decimal.pow(1.05, game.totalFRBought.divide(10))
			case 2:
				return game.newEpisode.multiply(100).pow(0.5)
		}
	}
}