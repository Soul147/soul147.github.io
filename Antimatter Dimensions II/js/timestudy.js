tree = {
	camera: {x: 0, y: 0, xVel: 0, yVel: 0, zoom: 1},
	studies: [],
	getStudy: function(s) {
		var r = null
		this.studies.forEach(function(study) {
			if(study.id == s) r = study;
		})
		return r
	},
	hasStudy: function(id) {
		return game.timestudy.studies.includes(id);
	},
	getEff: function(id) {
		return this.getStudy(id).eff()
	},
	buyTheorems: function(c) {
		var bought = 0;
		switch(c) {
			case 0: 
				bought = Decimal.affordGeometricSeries(game.dimensions[0].amount, 1, "1e20000", game.timestudy.bought[0])
				break;
			case 1: 
				bought = Decimal.affordGeometricSeries(game.infinityPoints, 1, 1e100, game.timestudy.bought[1])
				game.infinityPoints = game.infinityPoints.subtract(Decimal.sumGeometricSeries(bought, 1, 1e100, game.timestudy.bought[1]));
				break;
			case 2: 
				bought = Decimal.affordGeometricSeries(game.eternityPoints, 1, 2, game.timestudy.bought[2])
				game.eternityPoints = game.eternityPoints.subtract(Decimal.sumGeometricSeries(bought, 1, 2, game.timestudy.bought[2]));
				break;
		}
		game.timestudy.theorems = game.timestudy.theorems.add(bought);
		game.timestudy.bought[c] = game.timestudy.bought[c].add(bought);
	}
}

function getTotalTT() {
	return game.timestudy.bought[0].add(game.timestudy.bought[1]).add(game.timestudy.bought[2]);
}

function Study(p={}) {
	this.x = p.x || 0;
	this.y = p.y || 0;
	this.id = p.id; 
	this.pre = p.pre || [];
	this.cost = new Decimal(p.cost);
	this.desc = p.desc;
	this.req = p.req || "true"
	this.and = p.and; // if it requires all previous studies as opposed to any
	this.eff = p.eff; // number, if any
	this.effb = p.effb || "";
	this.effa = p.effb ? (p.effa || "") : (p.effa || "x")
	this.effd = p.effd || "shorten"
}

function ns(p) {
	var study = new Study(p);
	tree.studies.push(study);
	study.button = document.getElementById("timeStudies").appendChild(document.createElement("button"));
	study.button.onclick = function() {
		study.buy()
	}
}

ns({x:     0, y:     0, id:  "s00", cost:    1, desc: "Begin.", and: true})
ns({x:    -1, y:    -1, id:  "p11", cost:    1, desc: "Multiplier to normal dimensions, increasing during this eternity", eff: function() {return Decimal.pow(10, getTimeSince("eternity")/1e4).min(infp())}, pre: ["s00"]})
ns({x:    -1, y:    -2, id:  "p21", cost:    2, desc: "Gain more infinities based on dimension boosts", eff: function() {return game.boosts}, pre: ["p11"]})
ns({x:    -2, y:    -1, id:  "p22", cost:    2, desc: "Boosts based on infinities are 10x stronger", pre: ["p11"]})
ns({x:    -2, y:    -2, id:  "p23", cost:    4, desc: "Dimension Boosts are 4x as powerful", pre: ["p11"]})
ns({x:    -2, y:    -3, id:  "p31", cost:    8, desc: "Sacrifice affects dimensions 1-8 with reduced effect", eff: function() {return getSacrificeMult().pow(0.2)}, pre: ["p23"]})
ns({x:     1, y:    -1, id:  "i11", cost:    1, desc: "Infinity Dimensions are more powerful based on Infinity Power", eff: function() {return game.infinityDimensions[0].amount.log10().pow(2).max(1)}, pre: ["s00"]})
ns({x:     1, y:    -2, id:  "i21", cost:    4, desc: "Infinity Dimensions get a multiplier based on fastest eternity time", eff: function() {return Decimal.max(1e10 / game.bestEternityTime, 1).pow(2)}, pre: ["i11"]})
ns({x:     2, y:    -2, id:  "i22", cost:    5, desc: "Infinity Shifts are more powerful the more you have", eff: function() {return game.infinityShifts.pow(2).add(10).log10().pow(3)}, pre: ["i11"]})
ns({x:     2, y:    -1, id:  "i23", cost:    2, desc: "Gain 20% more IP per antimatter galaxy", eff: function() {return Decimal.pow(1.2, game.galaxies)}, pre: ["i11"]})
ns({x:     2, y:    -3, id:  "i31", cost:    7, desc: "Sacrifice affects 9th Infinity Dimension with reduced effect", eff: function() {return getSacrificeMult().pow(0.05)}, pre: ["i22"]})
ns({x:    -2, y:     1, id:  "t11", cost:    1, desc: "Tickspeed affects first Time Dimension with reduced effect", eff: function() {return getTickspeed("dimension").pow(0.0005).max(1)}, pre: ["s00"]})
ns({x:    -3, y:     1, id:  "t21", cost:    4, desc: "Time Dimensions get a multiplier based on free tickspeed upgrades", eff: function() {return getFreeTickspeedUpgrades().pow(0.5)}, pre: ["t11"]})
ns({x:    -3, y:     0, id:  "t22", cost:    4, desc: "Time Dimensions get a multiplier based on free tickspeed upgrades", eff: function() {return getFreeTickspeedUpgrades().pow(0.5)}, pre: ["t11"]})
ns({x:    -4, y:     2, id:  "t31", cost:    4, desc: "Time Dimensions get a multiplier based on free tickspeed upgrades", eff: function() {return getFreeTickspeedUpgrades().pow(0.5)}, pre: ["t21"]})
ns({x:    -4, y:     1, id:  "t32", cost:    4, desc: "Time Dimensions get a multiplier based on free tickspeed upgrades", eff: function() {return getFreeTickspeedUpgrades().pow(0.5)}, pre: ["t22"]})
ns({x:     2, y:     1, id:  "r11", cost:   10, desc: "Decrease galaxy cost scaling by 10%", pre: ["s00"]})
ns({x:     3, y:     0, id:  "r21", cost:   25, desc: "Distant antimatter galaxy scaling starts 25 later", pre: ["r11"]})
ns({x:     3, y:     1, id:  "r22", cost:    5, desc: "You gain replicanti three times faster", pre: ["r11"]})
ns({x:     4, y:     1, id:  "r31", cost:    5, desc: "Sacrifice is 10% stronger", pre: ["r21"]})
ns({x:     4, y:     2, id:  "r32", cost:   50, desc: "Replicanti galaxies are 50% more effective", pre: ["r22"]})
// ns({x:     0, y:     3, id:  "d11", cost: 5000, desc: "Unlock Time Dilation", pre: ["s00"]})

Study.prototype.getPostStudies = function() {
	var l = []
	tree.studies.forEach(function(study) {
		if(study.pre.includes(this.id)) l.push(study);
	})
	this.post = l;
	return l;
}

Study.prototype.canBuy = function(nocost) {
	if(tree.hasStudy(this.id)) return false;
	if(!nocost && game.timestudy.theorems.lt(this.cost)) return false;
	
	var or = false;
	var and = true;
	
	this.pre.forEach(function(p) {
		if(game.timestudy.studies.includes(p)) or = true; else and = false;
	});
	
	if(this.and) {
		if(and) return true;
		return false;
	}
	else {
		if(or) return true;
		return false;
	}
}

Study.prototype.buy = function() {
	if(!this.canBuy()) return;
	game.timestudy.theorems = game.timestudy.theorems.subtract(this.cost)
	game.timestudy.studies.push(this.id);
	return true;
}

var canvas = document.getElementById("studyTreeCanvas");
var ctx = canvas.getContext("2d");
addEventListener("resize", resizeCanvas);

function resizeCanvas() {
	canvas.width = innerWidth;
	ge("timeStudies").style.height = canvas.height = innerHeight - 200;
	canvas.style.position = "absolute"
	canvas.style.left = 0;
	canvas.style.top = 200;
	drawStudyTree();
}

document.onload = resizeCanvas;

function drawStudyTree() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	
}