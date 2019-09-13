function Autobuyer(onUpdate, interval, cost) {
	this.onUpdate = onUpdate;
	this.interval = interval;
	this.cost = new Decimal(cost);
	
	this.upgrade = function() {
		
	}
}

function resetAutobuyers() {
	game.autobuyers = []
	for(var i = 0; i < 12; i++) {
		game.autobuyers.push(new Autobuyer())
	}
}