function PrestigeLayer(p) {
	this.layerNumber = game.layers.length;
	
	this.pName = p.pName;								// Name of prestige layer
	this.sinM = p.sinM || 2;							// Whether or not this layer's name has a plural form. (1 = "", 2 = "s", 3 = "es")
	this.pAbbr = p.pAbbr;								// Abbreviation of the layer name
	this.times = new Decimal(0);						// How many times everything below this layer has been reset
	this.currency = new Decimal(0);						// The amount of this layer's currency
	this.cName = p.cName;								// The name of this layer's currency
	this.sinC = p.sinC || 2;							// Whether or not this layer's currency has a plural form.
	this.upgrades = []									// List of bought upgrades for this layer
	this.upgradeCosts = p.upgradeCosts;					// Costs of nonrebuyable upgrades
	this.currencyMultipliersBought = new Decimal(0);	// Upgrades which increase currency gain
	this.hasCostReduction = p.hasCostReduction;			// Whether or not this layer has upgrades that reduce FR cost
	this.costReductionBought = new Decimal(0);			// How many cost reduction upgrades have been bought
	this.lastPrestige = Date.now();						// When the last prestige was
	this.meta = p.meta;									// How many meta-layers are before this - determines styling
	
	for(i in this.upgradeCosts) this.upgradeCosts[i] = new Decimal(this.upgradeCosts[i]);

	// Display functions
	
	this.abbrC = function(small) {
		return (small ? "" : "<span class = 'currency'>") + shortenMoney(this.currency) + (small ? " " : "</span> ") + this.cName + (this.currency.eq(1) ? "" : ["","s","es"][this.sinC-1])
	}
	
	this.abbrP = function(small) {
		return (small ? "" : "<span class = 'currency'>") + shortenMoney(this.gainedCurrency()) + (small ? " " : "</span> ") + this.cName + (this.currency.eq(1) ? "" : ["","s","es"][this.sinC-1])
	}
	
	this.getTimeSpent = function() {
		return Date.now() - this.lastPrestige;
	}

	// Prestige function
	
	this.prestige = function() {
		if(this.gainedCurrency().lt(1)) return;
		this.times = game.newEpisode.add(1);
		this.currency = this.currency.add(this.gainedCurrency());
		prestige(this.layerNumber);
	}
	
	this.getPrevCurr = function() {
		return game.layers[this.layerNumber-1] ? game.layers[this.layerNumber-1].currency : game.forks
	}
	
	this.gainedCurrency = function() {
		return this.getPrevCurr().divide(Decimal.pow(1e3, this.layerNumber+1)).pow(1/(2+this.layerNumber/2)).multiply(this.getCurrencyMultiplier()).floor();
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

	this.buyCurrencyMultiplier = function(auto) {
		if(this.currency.lt(game.keyMultiplierCost.multiply(1+!!auto*9))) return;
		this.currency = this.currency.subtract(this.getCurrencyMultiplierCost());
		this.currencyMultipliersBought = this.currencyMultipliersBought.add(1);
		return true;
	}

	this.buyCostReduction = function(auto) {
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
	
	// Setup the HTML on the page
	
	ge("Layers").innerHTML += `
		<div class = "tab" id = "` + this.pName + `">
			<center>
				You have <span name = "currency` + this.layerNumber + `"></span>.<br>
				` + (this.layerNumber ? `You have <span name = "currency` + (this.layerNumber-1) + `"></span>.` : ``) + `<br>
				<button onclick = "prestige(` + this.layerNumber + `)" class = "` + this.meta + `">
					Start a ` + this.pName + `<br>
					Gain <span name = "prestige` + this.layerNumber + `"></span>.<br>
					<span name = "prestigerate` + this.layerNumber + `"></span><br>
				</button>
			</center>
		</div>
	`
}

function newLayer(p) {
	layer = new PrestigeLayer(p);
	console.log(layer)
	game.layers.push(layer)
}

newLayer({
	pName: "New Episode",
	cName: "key",
	meta: "normal"
})

newLayer({
	pName: "New Cake at Stake",
	cName: "cake",
	meta: "normal"
})