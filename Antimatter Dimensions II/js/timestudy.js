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
		
		bought = bought.min(game.options.ttbuying||1/0)
		game.timestudy.theorems = game.timestudy.theorems.add(bought);
		game.timestudy.bought[c] = game.timestudy.bought[c].add(bought);
	}
}

function getTotalTT() {
	return game.timestudy.bought[0].add(game.timestudy.bought[1]).add(game.timestudy.bought[2]).subtract(game.timestudy.unlockTheorems);
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

ns({x:     0, y:     0, id:  "s00", cost:     1, desc: "Get fucked.<br>(Sorry, I have temporarily removed these for balancing reasons, they'll be back soon)", and: true})
// ns({x:  -0.5, y:     1, id:  "p11", cost:     1, desc: "Multiplier per ten dimensions is stronger based on infinities", eff: function() { return game.infinities.sqrt().divide(1000).add(1).min(2)}, pre: ["s00"]})
// ns({x:   0.5, y:     1, id:  "t11", cost:     1, desc: "Tickspeed affects first time dimension with reduced effect", eff: function() { return getTickspeed("dimension").pow(0.005) }, pre: ["s00"]})

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
	if(this.id.includes("s")) game.timestudy.unlockTheorems = game.timestudy.unlockTheorems.add(this.cost);
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