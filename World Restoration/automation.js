function Automaton(process, consumption, currencyType) {
	this.process = process;
	this.consumption = consumption;
	this.currencyType = currencyType;
	this.active = false;
	
	this.update = function() {
		if(!this.active) return;
		
		if(game[this.currencyType].divide(10).lt(this.consumption)) return;
		game[this.currencyType] = game[this.currencyType].subtract(this.consumption);
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

createAutomaton(function() {buyMaxAll()}, "1e3", "keys")

createAutomaton(function() {while(buyKeyMultiplier(true));buyNEUpgrade(0);buyNEUpgrade(1);buyNEUpgrade(2)}, "1e6", "keys")
	
createAutomaton(function() {while(buyCakeMultiplier(true));while(buyCakeMultiplier2(true));buyNCaUpgrade(0);buyNCaUpgrade(1)}, "1e4", "cakes")
createAutomaton(function() {game.keys = game.keys.add(gainedKeys().multiply(diff/1e5))}, "1e6", "cakes")

createAutomaton(function() {while(buyKarmaMultiplier(true));buyNCUpgrade(0);buyNCUpgrade(1)}, "1e5", "karma")
createAutomaton(function() {game.cakes = game.cakes.add(gainedCakes().multiply(diff/1e5))}, "1e9", "karma")

createAutomaton(function() {game.karma = game.karma.add(gainedKarma().multiply(diff/1e5))}, "1e12", "time")









