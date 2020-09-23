// This is getting to be a thing, isn't it?

function ge(e) {
	return document.getElementById(e);
}

// Automatically iterate over all elements of a specific name or class

function gc(e, f) {
	l = document.getElementsByClassName(e);
	for(var i = 0; i < l.length; i++) {
		f(l[i], i); // pass the element and the position of the element in the array to function for each element
	}
}

function gn(e, f) {
	l = document.getElementsByName(e);
	for(var i = 0; i < l.length; i++) {
		f(l[i], i); // pass the element and the position of the element in the array to function for each element
	}
}

// Tab switching

function tab(t) {
	// hide everything

	var classList = document.getElementsByClassName("tab");
	for(var i = 0; i < classList.length; i++) {
		classList[i].style.display = "none"
	}

	// unhide the selected tab

	ge(t).style.display = ""
}

gn("layer", function(e) {
	e.onclick = function() {
		tab(e.innerHTML)
	}
})

// Setup repellent HTML

HTML = "<tr>"
for(var i = 1; i <= 80; i++) {
	if(i % 4 == 1) HTML += "</tr><tr>"
	HTML += '<td id = "fr'+i+'" width = "20%">Fork Repellent '+i+'<br>Amount: <span id = "fr'+i+'a"></span><br>Multiplier: x<span id = "fr'+i+'m"></span><br>Production: <span id = "fr'+i+'p"></span> / s<br><button id = "fr'+i+'b" onclick = "buyFR('+i+')">Requires <span id = "fr'+i+'c"></span> forks</button></td>'
}
ge("frlist").innerHTML += HTML

// Hotkeys

addEventListener("keydown", function(e) {
	var c = e.keyCode;

	if(c == 77) buyMaxAll()
})

// The game. Fairly simple.

game = {
	lastUpdate: Date.now(),
	options: {
		notation: "Mixed scientific",
		logarithm: {
			base: 10
		},
		commas: "Commas"
	},
	layers: [],
	automatonsActive: []
}

// This function is used a lot.

function reset(layer) {
	if(layer == 0) {
		game.forks = new Decimal(10);
		game.totalFRBought = new Decimal(0);
		for(var i = 1; i <= 80; i++) {
			j = i - 1;
			game["fr" + i] = {
				amount: new Decimal(0),
				bought: new Decimal(0),
				mult: new Decimal(1.2**j),
				buyMult: new Decimal(1.2),
				cost: new Decimal(10*1.7**j),
				costMult: new Decimal(1.5),
			}
		}
	}
	if(layer == 1) {
		game.keys = new Decimal(0);
		game.neUpgrades = [];
		game.keyMultiplier = new Decimal(1);
		game.keyMultiplierCost = new Decimal(1000);
		game.keyReductionUpgrades = new Decimal(0);
		game.keyReductionCost = new Decimal(10000);
	}
	if(layer == 2) {
		game.cakes = new Decimal(0);
		game.empoweredCakes = new Decimal(0);
		game.ncaUpgrades = [];
		game.cakeMultiplier = new Decimal(1);
		game.cakeMultiplierCost = new Decimal(1000);
		game.cakeMultiplier2 = new Decimal(1);
		game.cakeMultiplier2Cost = new Decimal(1e6);
		game.cakeReductionUpgrades = new Decimal(0)
		game.cakeReductionCost = new Decimal(1e7)
		game.brake = false;
	}
	if(layer == 3) {
		game.karma = new Decimal(0);
		game.ncUpgrades = []
		game.karmaMultiplier = new Decimal(1)
		game.karmaMultiplierCost = new Decimal(1000)
		game.karmaReductionUpgrades = new Decimal(0)
		game.karmaReductionCost = new Decimal(1e7)
	}

	if(layer == Infinity) {
		game.newEpisode = new Decimal(0);
		game.newCakeAtStake = new Decimal(0);
		game.newContest = new Decimal(0);
	}
}

function save() {
	localStorage.wr = btoa(JSON.stringify(game))
}

function load(file) {
	if(!localStorage.wr && !file) return;
	parsed = file ? JSON.parse(atob(file)) : JSON.parse(atob(localStorage.wr))
	if(parsed.forks) game = parsed; else return console.error("Error parsing save.")

	transformToDecimal(game)

	// Set up automatons

	automatons.forEach(function(automaton) {automaton.active = game.automatonsActive[automaton.id]})
	gn("automatonToggle", function(e, i) {e.checked = automatons[i].active})

	Achievements.asArray().forEach(function(achievement) {
		var table=document.getElementById("Achievements").childNodes[1]; //get the table
		var row=table.insertRow(-1); //append a row to the bottom
		var cell1=row.insertCell(0); //checkbox will be here
		var cell2=row.insertCell(1); //name will be here
		var cell3=row.insertCell(2); //description will be here
		var checkbox=document.createElement("INPUT");
		checkbox.setAttribute("class","achievemetCompletion");
		checkbox.setAttribute("type","checkbox");
		checkbox.setAttribute("disabled","disabled");
		cell1.appendChild(checkbox);
		cell1.style.paddingRight = "0px"
		cell2.innerHTML=achievement.name;
		cell3.innerHTML=achievement.desc;
		achievement.checkbox=checkbox;
	})
}

function transformToDecimal(object) { // It's so much better than hevi's version, because it's recursive and I'm a lazy piece of shit
	for(i in object) {
		if(typeof(object[i]) == "string" && !isNaN(new Decimal(object[i]).mag)) object[i] = new Decimal(object[i]);
		if(typeof(object[i]) == "object") transformToDecimal(object[i]) // iterates over all objects inside the object
	}
}
