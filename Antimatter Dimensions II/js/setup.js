var devMode = false;

var lastTab;
var tierNames = ["0", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"]
var smallCurrency = {
	infinityPoints: "IP",
	eternityPoints: "EP"
}

function infp(n=1) {
	return Decimal.pow(Number.MAX_VALUE, n);
}

function ge(e) {
	return document.getElementById(e) || document.createElement("div");
}

function gc(e, f, o=0) {
	l = document.getElementsByClassName(e);
	for(var i = o; i < l.length + o; i++) {
		f(l[i % l.length], i); // pass the element and the position of the element in the array to function for each element
	}
}

function transformToDecimal(object) { // It's so much better than hevi's version, because it's recursive and I'm a lazy piece of shit
	for(i in object) {
		if(i == "automator") continue; // for fuck's sake
		if(typeof(object[i]) == "string" && !isNaN(new Decimal("e" + object[i]).mag)) object[i] = new Decimal(object[i]); 
		if(typeof(object[i]) == "object") transformToDecimal(object[i]) // iterates over all objects inside the object
	}
}

saveData = {games: [], currentGame: 0}

function newGame() {
	game = {}
	
	updateSave();
}

function loadGame(n) {
	game = saveData.games[n];
	
	updateSave();
}

function importGame() {
	let input = prompt("Paste your exported game below:")
	if (input === "") return
	try {
		let temp = JSON.parse(atob(input))
		game = temp
		updateSave();
	} catch(err) {
		alert("An error has occured while loading the save!")
	}
}

function copyTextToClipboard(text) {
	ge("exported").value = text;
	iosCopyToClipboard(ge("exported"))
}

function iosCopyToClipboard(el) { // https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
	var oldContentEditable = el.contentEditable,
		oldReadOnly = el.readOnly,
		range = document.createRange();

	el.contentEditable = true;
	el.readOnly = false;
	range.selectNodeContents(el);

	var s = window.getSelection();
	s.removeAllRanges();
	s.addRange(range);

	el.select();
	el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

	el.contentEditable = oldContentEditable;
	el.readOnly = oldReadOnly;

	document.execCommand('copy');
}

function exportGame() {
	let savefile = btoa(JSON.stringify(saveData.games[saveData.currentGame]))
	copyTextToClipboard(savefile)
	alert("Copied to clipboard!")
}

function hardReset() {
	if (confirm("Are you sure about doing a hard reset? THERE IS NO REWARD FOR THIS!")) {
		if (confirm("This is the LAST confirm!")) {
			newGame();
		}
	}
}

function updateSave() {
	transformToDecimal(game);
	
	if(!game.options) game.options = {
		notation: "Scientific",
		mixedCutoff: 1e33,
		fps: 30
	}
	
	if(!game.achievements) game.achievements = [];
	if(!game.totalAntimatter) game.totalAntimatter = new Decimal(0);
	if(!game.dimensions) resetDimensions();
	if(!game.shifts) game.shifts = 0;
	if(!game.boosts) game.boosts = new Decimal(0);
	if(!game.galaxies) game.galaxies = new Decimal(0);
	if(!game.totalBoosts) game.totalBoosts = new Decimal(0);
	if(!game.totalGalaxies) game.totalGalaxies = new Decimal(0);
	if(!game.dimMult) game.dimMult = new Decimal(2);
	if(!game.dimCostMultIncrease) game.dimCostMultIncrease = 10;
	if(!game.tickCostMultDecrease) game.tickCostMultIncrease = 10;
	if(!game.infinities) game.infinities = new Decimal(0);
	if(!game.infinityPoints) game.infinityPoints = new Decimal(0);
	if(!game.infinityUpgrades) resetInfinityUpgrades();
	if(!game.infinityDimensions) resetInfinityDimensions();
	if(!game.infinityShifts) game.infinityShifts = new Decimal(0);
	if(!game.selectedChallengeType) game.selectedChallengeType = 0;
	if(!game.eternityPoints) game.eternityPoints = new Decimal(0);
	if(!game.eternities) game.eternities = new Decimal(0);
	if(!game.timeDimensions) resetTimeDimensions();
	if(!game.timestudy) game.timestudy = {theorems: new Decimal(0), bought: [new Decimal(0), new Decimal(0), new Decimal(0)], studies: []};
	if(!game.eternityUpgrades) resetEternityUpgrades();
	if(!game.replicanti) resetReplicanti();
	
	if(!game.challenges) {
		game.challenges = []
		game.challengesRunning = []
	}
	for(var i = game.challenges.length; i < 2; i++) {
		game.challenges[i] = []
		for(var j = 0; j < 12; j++) game.challenges[i][j] = {}
	}
	
	if(!game.startTime) game.startTime = Date.now();
	if(!game.buyTime) game.buyTime = Date.now();
	if(!game.resetTime) game.resetTime = Date.now();
	if(!game.shiftTime) game.shiftTime = Date.now();
	if(!game.boostTime) game.boostTime = Date.now();
	if(!game.galaxyTime) game.galaxyTime = Date.now();
	if(!game.infinityTime) game.infinityTime = Date.now();
	if(!game.eternityTime) game.eternityTime = Date.now();
	
	if(!game.bestInfinityTime) game.bestInfinityTime = Infinity;
	if(!game.bestEternityTime) game.bestEternityTime = Infinity;
	
	if(!game.automator) game.automator = {
		class: 0,
		extensions: [],
	}
	
	au = game.automator;
	if(!au.save) au.save = {}
	if(!au.memory) au.memory = {}
	
	au.file = {
		"New": function(force) {
			if(!force) if(au.file.isUnsaved() && !confirm("You have unsaved changes. Are you sure you want to create a new file?")) return;
			delete au.currentFile;
			au.raw = ge("auScript").value = "";
		},
		"Open": function(name, force) {
			if(!force) if(au.file.isUnsaved() && !confirm("You have unsaved changes. Are you sure you want to open a new file?")) return;
			
			var h = function(n) {
				au.currentFile = n;
				au.raw = ge("auScript").value = au.save[n].script;
			}
			
			if(name) return h(name);
			
			openFileMenu("Open")
			onFileMenuClosed(h)
		},
		"Save": function() {
			if(!au.currentFile) return au.file["Save As"]()
			au.save[au.currentFile] = {
				name: au.currentFile,
				lastEdit: Date.now(),
				script: au.raw
			}
		},
		"Save As": function(name, force) {
			openFileMenu("Save As")
			onFileMenuClosed(function(n) {
				if(au.save[n] && !confirm("A file called " + n + ".au already exists. Overwrite?")) return;
				au.currentFile = n;
				au.file.Save();
			})
		},
		"Rename": function() {
			openFileMenu("Rename")
			onFileMenuClosed(function(n) {
				delete au.save[au.currentFile];
				au.currentFile = n;
				au.file.Save();
			})
		},
		"Delete": function() {
			if(au.file.isUnsaved() && !confirm("Are you sure you want to delete " + au.currentFile + ".au?")) return;
			delete au.save[au.currentFile];
			au.file.New(true);
		},
		
		isUnsaved: function() {
			return au.currentFile ? au.raw !== au.save[au.currentFile].script : au.raw.length;
		}
	}
	au.cmdline = {
		current: 0,
		history: []
	}
	
	ge("auScript").value = au.raw || "";
	
	var c = []
	for(var i = 0; i < 15; i++) au.extensions[i] = Extension(0.5**i, 2**i, "infinityPoints", au.extensions[i]?au.extensions[i].level:0)
	for(var i = 0; i < 15; i++) au.extensions[i+15] = Extension(0.5**i/3600, 2**i, "eternityPoints", au.extensions[i]?au.extensions[i].level:0)
}

if(localStorage.ad2) {
	saveData = JSON.parse(atob(localStorage.ad2));
	
	loadGame(saveData.currentGame);
}

else newGame();

function save() {
	saveData.games[saveData.currentGame] = game;
	
	localStorage.ad2 = btoa(JSON.stringify(saveData));
}

function getTimeSince(event) {
	return Date.now() - game[event + "Time"];
}

function showTab(name) {
	gc("tab", function(e) {
		e.style.display = "none";
	})
	ge(name + "Tab").style.display = "";
	game.currentTab = name;
}

function showDimensionTab(name) {
	gc("dimensionTab", function(e) {
		e.style.display = "none";
	})
	ge(name + "DimensionTab").style.display = "";
	game.currentDimensionTab = name;
}

function showStatisticsTab(name) {
	gc("statisticsTab", function(e) {
		e.style.display = "none";
	})
	ge(name + "StatisticsTab").style.display = "";
	game.currentStatisticsTab = name;
}

function showAutomationTab(name) {
	gc("automationTab", function(e) {
		e.style.display = "none";
	})
	ge(name + "AutomationTab").style.display = "";
	game.currentAutomationTab = name;
}

function showInfinityTab(name) {
	gc("infinityTab", function(e) {
		e.style.display = "none";
	})
	ge(name + "Tab").style.display = "";
	game.currentInfinityTab = name;
}

function showEternityTab(name) {
	gc("eternityTab", function(e) {
		e.style.display = "none";
	})
	ge(name + "Tab").style.display = "";
	game.currentEternityTab = name;
}

function displayIf(e, c) {
	ge(e).style.display = c ? "" : "none";
}

t = "<table><tr>"
for(var i = 0; i < achievements; i++) t += `
<td id = "achievement` + i + `">a</td>
` + (i % 9 == 8 ? "</tr><tr>" : "")
t += "</tr></table>"

ge("achievements").innerHTML = t;

for(var i = 1; i < 10; i++) ge("dimensions").innerHTML += `
<tr id = "dimDisplay` + i + `" style = "text-align: right">
	<td style = "text-align: left; padding-bottom: 8px; width: 250">` + tierNames[i] + ` Dimension</td>
	<td style = "position: absolute; width: 100"><span id = "dimamount`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 400; text-align: left"><span id = "dimgrowth`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 600">x<span id = "dimmult`+i+`"></span></td>
	<td style = "position: absolute; right: 20"><button class = "buy" id = "dimbuy`+i+`" onclick = "buyDimension(`+i+`)"></button></td>
</tr>`

ge("dimensions").innerHTML += `
<tr id = "tickspeedDisplay" style = "text-align: right">
	<td style = "text-align: left; padding-bottom: 8px; width: 250">Tickspeed</td>
	<td style = "position: absolute; width: 100"><span id = "tickspeed"></span></td>
	<td style = "position: absolute; width: 200; left: 600"><span id = "galaxyEffect"></span></td>
	<td style = "position: absolute; right: 20"><button class = "buy" id = "buyTickspeed" onclick = "buyTickspeed()"></button></td>
</tr>`

for(var i = 1; i < 10; i++) ge("infinityDimensions").innerHTML += `
<tr id = "infdimDisplay` + i + `" style = "text-align: right">
	<td style = "text-align: left; padding-bottom: 8px; width: 250">` + tierNames[i] + ` Infinity Dimension</td>
	<td style = "position: absolute; width: 100"><span id = "infdimamount`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 400; text-align: left"><span id = "infdimgrowth`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 600">x<span id = "infdimmult`+i+`"></span></td>
	<td style = "position: absolute; right: 20"><button class = "buy" id = "infdimbuy`+i+`" onclick = "buyInfinityDimension(`+i+`)"></button></td>
</tr>`

for(var i = 1; i < 10; i++) ge("timeDimensions").innerHTML += `
<tr id = "timedimDisplay` + i + `" style = "text-align: right">
	<td style = "text-align: left; padding-bottom: 8px; width: 250">` + tierNames[i] + ` Time Dimension</td>
	<td style = "position: absolute; width: 100"><span id = "timedimamount`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 400; text-align: left"><span id = "timedimgrowth`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 600">x<span id = "timedimmult`+i+`"></span></td>
	<td style = "position: absolute; right: 20"><button class = "buy" id = "timedimbuy`+i+`" onclick = "buyTimeDimension(`+i+`)"></button></td>
</tr>`

h = ""

var pattern = " xx  xx x  xx  xx  xx  x xx  xx "

for(var i = 0, j = 0; j < 32; i++, j++) {
	if(j % 8 == 0) h += "<tr>"
	if(pattern[j] == "x") h += `
		<td>
			<button id = "infinityUpgrade` + i + `" onclick = "buyInfinityUpgrade(` + i + `)">
				<span id = "infinityUpgradeDesc` + i + `"></span><br>
				Cost: <span id = "infinityUpgradeCost` + i + `"></span>
			</button>
		</td>
	`;
	else {
		h += "<td></td>"
		--i;
	}
	if(j % 8 == 7) h += "</tr>"
}

ge("infinityUpgrades").innerHTML = h;

h = ""

for(var i = 17; i < 29; i++) {
	if(i % 3 == 2) h += "<tr>"
	h += `
		<td>
			<button id = "infinityUpgrade` + i + `" onclick = "buyInfinityUpgrade(` + i + `)">
				<span id = "infinityUpgradeDesc` + i + `"></span><br>
				Cost: <span id = "infinityUpgradeCost` + i + `"></span>
			</button>
		</td>
	`
	if(i % 3 == 1) h += "</tr>"
}

ge("postInfinityUpgrades").innerHTML = h + `
<tr>
	<td></td>
	<td><button id = "repeatInf0" onclick = "buyRepeatInf(0)"></button></td>
	<td></td>
</tr>
`

h = ""
c = 0

for(var i in eternityMilestones) {
	c++
	var m = eternityMilestones[i]
	if(c % 3 == 1) h += "<tr>"
	h += `
		<td>
			<button class = "eternitymilestone" id = "eternityMilestone${i}">
				${m.desc}<br>
				Requirement: ${m.req} Eternit${m.req==1?"y":"ies"}
			</button>
		</td>
	`
	if(c % 3 == 3) h += "</tr>"
}

ge("eternityMilestones").innerHTML = h

h = ""

for(var i = 0; i < 5; i++) {
	if(i % 5 == 0) h += "<tr>"
	h += `
		<td>
			<button id = "eternityUpgrade` + i + `" onclick = "buyEternityUpgrade(` + i + `)">
				<span id = "eternityUpgradeDesc` + i + `"></span><br>
				Cost: <span id = "eternityUpgradeCost` + i + `"></span>
			</button>
		</td>
	`
	if(i % 5 == 4) h += "</tr>"
}

ge("eternityUpgrades").innerHTML = h + `
<tr>
	<td></td>
	<td></td>
	<td><button id = "repeatEter0" onclick = "buyRepeatEter(0)"></button></td>
	<td></td>
	<td></td>
</tr>
`

var t = `<tr>`

for(var i = 0; i < 9; i++) t += `
<td class = "autobuyer" id = "dimensionAutobuyer${i}">${tierNames[i+1]} Dimension Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${i}" onclick = "upgradeExtension(${i})"></button></td>${(i+1)%3?"":"</tr><tr>"}
`

ge("automationTable1").innerHTML += t + `
<td class = "autobuyer" id = "tickspeedAutobuyer">Tickspeed Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${9}" onclick = "upgradeExtension(9)"></button></td>
<td class = "autobuyer" id = "boostAutobuyer">Dimension Boost Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${10}" onclick = "upgradeExtension(10)"></button></td>
<td class = "autobuyer" id = "galaxyAutobuyer">Antimatter Galaxy Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${11}" onclick = "upgradeExtension(11)"></button></td></tr>
<td class = "autobuyer" id = "sacrificeAutobuyer">Dimensional Sacrifice Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${12}" onclick = "upgradeExtension(12)"></button></td>
<td class = "autobuyer" id = "infinityAutobuyer">Big Crunch Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${13}" onclick = "upgradeExtension(13)"></button></td>
<td class = "autobuyer" id = "ipmultAutobuyer">IP Multiplier Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${14}" onclick = "upgradeExtension(14)"></button></td>
`

var t = `<tr>`

for(var i = 0; i < 9; i++) t += `
<td class = "autobuyer" id = "infdimensionAutobuyer${i}">${tierNames[i+1]} Infinity Dimension Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${i+15}" onclick = "upgradeExtension(${i+15})"></button></td>${(i+1)%3?"":"</tr><tr>"}
`

ge("automationTable2").innerHTML += t + `
<td class = "autobuyer" id = "infinityShiftAutobuyer">Infinity Shift Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${24}" onclick = "upgradeExtension(24)"></button></td>
<td class = "autobuyer" id = "eternityAutobuyer">Eternity Autobuyer<br><div class = "autobuyerInfo"></div><div class = "autobuyerInner"></div><button class = "autobuyerButton" id = "buyauto${25}" onclick = "upgradeExtension(25)"></button></td>
`

function f() {
	gc("challenge", function(e, i) {
		var angle = Math.PI / 6 * i;
		
		var x = innerWidth / 2 - 40;
		var y = 440;
		var r = 250;
		
		x += r * Math.sin(angle);
		y -= r * Math.cos(angle);
		
		e.style.left = x;
		e.style.top = y;
	})
}

f()

window.onresize = f;

addEventListener("keydown", function(e) {
	var c = e.keyCode;
	
	if(c == 77) maxAll();
	if(c == 67) bigCrunch();
	if(c == 69) eternity();
	if(c == 27) exitChallenge();
	
	if(c > 48 && c < 58) {
		if(!e.shiftKey) maxDimension(c - 48)
		else buyDimension(c - 48)
	}
	if(c == 48) maxTickspeed();
	
	if(e.ctrlKey && c == 83) {
		save();
		e.preventDefault();
	}
})

var mouse = {x: 0, y: 0, dx: 0, dy: 0}

ge("timeStudyTree").addEventListener("mousedown", function() {
	tree.camera.dragging = true;
})
ge("timeStudyTree").addEventListener("wheel", function(e) {
	tree.camera.zoom = Math.max(Math.min(tree.camera.zoom * 0.999**e.deltaY, 1), 0.2)
})
addEventListener("mouseup", function() {
	tree.camera.dragging = false;
})
addEventListener("mousemove", function(e) {
	mouse.dx = e.x - mouse.x;
	mouse.dy = e.y - mouse.y;
	
	if(tree.camera.dragging) {
		tree.camera.x -= mouse.dx / tree.camera.zoom;
		tree.camera.y -= mouse.dy / tree.camera.zoom;
	}
	
	mouse.x = e.x;
	mouse.y = e.y;
})

ge("cmdline").onkeydown = function(e) {
	var c = e.keyCode;
	
	if(c == 38) {
		if(au.cmdline.current == au.cmdline.history.length) au.cmdline.typing = ge("cmdline").value;
		au.cmdline.current = Math.max(au.cmdline.current - 1, 0);
		ge("cmdline").value = au.cmdline.history[au.cmdline.current] || au.cmdline.typing;
	}
	if(c == 40) {
		au.cmdline.current = Math.min(au.cmdline.current + 1, au.cmdline.history.length);
		ge("cmdline").value = au.cmdline.history[au.cmdline.current] || au.cmdline.typing;
		if(au.cmdline.current == au.cmdline.history.length) au.cmdline.typing = "";
	}
	if(c == 13) {
		v = ge("cmdline").value
		logAu(' > ' + v); 
		runAu(v, true); 
		au.cmdline.history.push(v);
		au.cmdline.current = au.cmdline.history.length;
		ge("cmdline").value = ''
		auLog.children[auLog.children.length-1].scrollIntoView()
	}
}