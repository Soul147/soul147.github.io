function Automaton(process, consumption, currencyType) {
	this.process = process;
	this.consumption = consumption;
	this.currencyType = currencyType;
	this.active = false;
	
	this.update = function(diff) {
		if(!this.active) return;
		
		c = this.consumption.multiply(diff/1000)
		if(game[this.currencyType].divide(10).lt(c)) return;
		game[this.currencyType] = game[this.currencyType].subtract(c);
		
		this.process();
	}
}

automatons = []

function createAutomaton(pr, co, cu) {
	var automaton = new Automaton(pr, new Decimal(co), cu)
	automaton.id = automatons.length;
	automatons.push(automaton);
}

function updateAutomatons(diff) {
	// Update all automaton-related elements
	
	gc("automatonToggle", function(e, i) {automatons[i].active = e.checked})
	gc("automatonRequirement", function(e, i) {e.innerHTML = shortenCosts(automatons[i].consumption) + " " + automatons[i].currencyType})
	
	automatons.forEach(function(automaton) {
		automaton.update(diff);
		game.automatonsActive[automaton.id] = automaton.active;
	})
}

/* Cost increases (note to self):
 * Automatic currency gains are 1e3^layers, starting at 1e3
 * Automatic upgrade buyers are 10^layers, starting at 1e3
 */

createAutomaton(function() {buyMaxAll()}, "10", "keys")

createAutomaton(function() {while(buyKeyMultiplier(true));while(buyKeyReduction(true));buyNEUpgrade(0);buyNEUpgrade(1);buyNEUpgrade(2)}, "1e3", "keys")
createAutomaton(function() {if(gainedKeys().gte(game.keys)) newEpisode()}, "1e3", "keys")
createAutomaton(function() {newEpisode()}, "1e3", "keys")
	
createAutomaton(function() {while(buyCakeMultiplier(true));while(buyCakeMultiplier2(true));while(buyCakeReduction(true));buyNCaUpgrade(0);buyNCaUpgrade(1)}, "1e4", "cakes")
createAutomaton(function() {game.keys = game.keys.add(gainedKeys().multiply(diff/1e5))}, "1e3", "cakes")
createAutomaton(function() {if(gainedCakes().gte(game.cakes)) newCakeAtStake()}, "1e3", "cakes")

createAutomaton(function() {while(buyKarmaMultiplier(true));while(buyKarmaReduction(true));buyNCUpgrade(0);buyNCUpgrade(1)}, "1e5", "karma")
createAutomaton(function() {game.cakes = game.cakes.add(gainedCakes().multiply(diff/1e5))}, "1e6", "karma")

createAutomaton(function() {game.karma = game.karma.add(gainedKarma().multiply(diff/1e5))}, "1e9", "time")









