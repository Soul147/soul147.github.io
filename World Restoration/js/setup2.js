const ENDGAME = 200
var ENDGAME_PROGRESS = 0
var ENDGAME_SPOILER = "Waluigi dies in Endgame, then comes back with the Eternity Gauntlet and kicks Thanos's ass." // I still haven't seen Infinity War. Don't spoil it.
var THE_END = false

// Cascading function to reset all layers below the current prestige layer

function prestige(layers) {
	// Gain currency and stuff

	if(layers != Infinity) {
		layer = game.layers[layers];
		layer.times = layer.times.add(1);
		console.log(layer.gainedCurrency())
		layer.currency = layer.currency.add(layer.gainedCurrency())
	}

	reset(layers) // don't run the loop infinite times, that wouldn't be good

	// Reset everything below

	for(var i = 0; i < Math.min(layers, 1000); i++) reset(i)
	buyFR(1);
}

function getUnlockedFR() {
	u = 1;

	for(var i = 0; i < game.layers.length; i++) {
		if(game.layers[i].times.gt(0)) u++;
	}

	return u;
}

function buyFR(n) {
	fr = game["fr" + n];
	if(game.forks.lt(fr.cost.divide(getFRCostReduction()))) return;

	var bought = game.forks.divide(fr.cost).log(fr.costMult).add(1);
	console.log(bought);

	fr.amount = fr.amount.add(bought);
	fr.bought = fr.bought.add(bought);
	game.totalFRBought = game.totalFRBought.add(bought)
	fr.mult = fr.mult.multiply(fr.buyMult.pow(bought))
	fr.cost = fr.cost.multiply(fr.costMult.pow(bought))
	return true;
}

function buyMaxAll() {
	for(var i = 1; i <= getUnlockedFR(); i++) buyFR(i);
}

function getFRCostReduction() {
	return 1
}

function update() {
	diff = Date.now() - game.lastUpdate;
	game.lastUpdate = Date.now();

	// Hackerman

	hacc = parseInt(localStorage.hacker) || 1
	diff *= hacc

	// Luigi dies in Infinity War

	ENDGAME_PROGRESS = Decimal.log10(Decimal.log10(game.forks))/Math.log10(ENDGAME)

	// You win

	if(ENDGAME_PROGRESS >= 1 && !THE_END) {
		setTimeout(function() {alert("You've reached the endgame. I'm still adding new content, which will be coming out soon. You can continue to push farther to get a head start, or just wait until the next layer comes out. Thanks for playing. :)")}, 1000)
		THE_END = true
	}

	for(var i = 1; i <= 80; i++) {
		fr = game["fr" + i]
		frb = game["fr" + (i-1)]
		fr.production = fr.amount.multiply(fr.mult)
		if(frb) frb.amount = frb.amount.add(fr.production.multiply(diff/1000)); else game.forks = game.forks.add(fr.production.multiply(diff/1000))

		ge("fr"+i+"a").innerHTML = shortenMoney(fr.amount);
		ge("fr"+i+"m").innerHTML = shorten(fr.mult);
		ge("fr"+i+"p").innerHTML = shortenMoney(fr.production);
		ge("fr"+i+"c").innerHTML = shortenMoney(fr.cost.divide(getFRCostReduction()));
		ge("fr"+i+"b").style.backgroundColor = game.forks.gte(fr.cost.divide(getFRCostReduction())) ? "#0f0" : "#f00"

		ge("fr"+i).style.display = (!game["fr" + (i-1)] || game["fr" + (i-1)].amount.gt(0)) && getUnlockedFR() >= i ? "" : "none"
	}

	game.layers.forEach(function(layer) {
		gn("currency" + layer.layerNumber, function(e, i) {
			e.innerHTML = layer.abbrC(i)
		})
		gn("prestige" + layer.layerNumber, function(e, i) {
			e.innerHTML = layer.abbrP(true)
		})
		gn("prestigerate" + layer.layerNumber, function(e, i) {
			e.innerHTML = shorten(layer.gainedCurrency().divide(layer.getTimeSpent()/60000)) + " " + layer.cName + ["","s","es"][layer.sinC-1] + "/min"
		})
	})

	updateAutomatons(diff / hacc);
	updateAchievements();

	//if(game.newEpisode.gt(0)) buyMaxAll();
	//if(game.newCakeAtStake.gt(0)) game.keys = game.keys.add(gainedKeys().multiply(diff/1e5))

	ge("forks").innerHTML = shortenMoney(game.forks);
	ge("forks").style.fontSize = 40 * (ENDGAME_PROGRESS + 1) + "px"


}

prestige(Infinity);

tab("Before Life")

//load();

setInterval(update, 50);
setInterval(save, 30000);
