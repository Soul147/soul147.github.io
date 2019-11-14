var currencyNames = ["infinityPoints"]

function Extension(s = 1, c, u = "infinityPoints") {
	var extension = {
		id: au.extensions.length,
		level: new Decimal(0),
		cost: new Decimal(c),
		currency: u,
		charge: 0,
		speed: new Decimal(s),
	}
	
	return extension;
}

function canUpgradeAutomator() {
	var max = game.infinityPoints.gt(0);
	return au.class < max;
}

function upgradeAutomator() {
	if(!canUpgradeAutomator()) return;
	au.class++;
}

function upgradeExtension(n) {
	if(game[au.extensions[n].currency].lt(au.extensions[n].cost)) return;
	game[au.currency] = game[au.extensions[n].currency].subtract(au.extensions[n].cost);
	au.extensions[n].cost = au.extensions[n].cost.multiply(2);
	au.extensions[n].level = au.extensions[n].level.add(1);
	au.extensions[n].speed = Decimal.pow(2, au.extensions[n].level)
}

function fireExtension(i, a, b, c, d, e, f) {
	var ext = au.extensions[i]
	if(ext.charge < 1) return;
	
	if(autobuyerFunctions[i](a, b, c, d, e, f)) ext.charge -= 1;
}

function db(i, b) {
	if(b) return maxDimension(i)
	else return buyDimension(i)
}

var autobuyerFunctions = [
	function(b) {return db(1, b)},
	function(b) {return db(2, b)},
	function(b) {return db(3, b)},
	function(b) {return db(4, b)},
	function(b) {return db(5, b)},
	function(b) {return db(6, b)},
	function(b) {return db(7, b)},
	function(b) {return db(8, b)},
	function(b) {return db(9, b)},
	function(b) {
		if(b) return maxTickspeed(b);
		else return buyTickspeed();
	},
	function() {
		if(shift()) return true;
		return boost();
	},
	function() {
		return galaxy();
	},
	function() {
		return sacrifice();
	},
	function() {
		return bigCrunch();
	}
]

function getExtByName(name) {
	
}

function extUnlocked(c) {
	if(c < 12) return challengeCompleted(c+1, 0);
}

function ccmd(a, b, c) {
	if(a !== b) return;
	switch(a) {
		case "fire":
			return extUnlocked(c)
		case "maxall":
			return getChallengeCompletions(0) == 12;
	}
	return true;
}

function runAu(line) {
	try {
		var args = line.split(" ")
		var cmd = args[0];
		var arg = [...args].splice(1, 1).join("");
		
		if(ccmd(cmd, "echo")) { // write something in the console
			if(!args[1]) return;
			logAu(arg)
		}
		if(ccmd(cmd, "cls")) {
			ge("auLog").innerHTML = ""
		}
		if(ccmd(cmd, "fire", parseInt(args[1]))) { // activate extensions
			if(!isNaN(parseInt(args[1]))) fireExtension(args[1], args[2] == "true")
			else if(getExtByName(args[1])) fireExtension(getExtByName(args[1]), args[2] == "true")
		}
		if(ccmd(cmd, "pause")) {
			if(isNaN(args[1])) args[1] = "0"
			if(args[2] == "t" || args[2] == "tick" || args[2] == "ticks") { // ticks
				au.tickDelay += parseInt(args[1])
			}
			else { // milliseconds
				au.delay += parseInt(args[1])
			}
		}
		if(ccmd(cmd, "maxall")) {
			for(var i = 0; i < 10; i++) runAu("fire " + i + " true")
		}
		if(ccmd(cmd, "boost")) runAu("fire 10")
		if(ccmd(cmd, "galaxy")) runAu("fire 11")
		if(ccmd(cmd, "infinity") || ccmd(cmd, "crunch")) runAu("fire 12")
	}
	catch(e) {
		logAu("<span style = 'color: #f00'>" + e.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</span>")
	}
}

function logAu(t) {
	ge("auLog").innerHTML += t + "<br>";
}