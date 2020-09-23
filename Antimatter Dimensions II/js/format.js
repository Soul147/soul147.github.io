function getFullExpansion(num, places) {
	num = new Decimal(num);
	if(num.gt(1e15)) return shorten(num);
	return num.toFixed(places).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function shorten(num, places = 2, shortPlaces = 2) {
	if(!num.mag) num = new Decimal(num);
	if(isNaN(num.mag)) return "NaN";
	if(num.gte(Number.MAX_VALUE) && !game.break) return "Infinite";
	if(num.lt(1e3)) return num.toFixed(shortPlaces);
		
	if(num.iteratedlog(10, 2).gt(1e15)) {
		var end = getFullExpansion(num.layer+1);
		return Math.log10(num.mag).toString().substring(0, Math.max(7 - end.length, 4)) + "|" + end;
	}
	
	if(game.options.notation == "Completion") {
		return getFullExpansion(num.iteratedlog(10, 2).divide(Decimal.iteratedlog("1e155000", 10, 2)).multiply(100), places+1) + "%"
	}
	if(game.options.notation == "Hyperscientific") {
		return "F" + getFullExpansion(num.slog(), places+4)
	}
	if(game.options.notation == "Scientific" || (game.options.notation == "Mixed Scientific" && num.gt(game.options.mixedCutoff))) {
		num.mag = parseFloat(num.mag.toPrecision(10))
		if(num.lt("ee15")) return num.mantissa.toPrecision(places+1) + "e" + getFullExpansion(num.exponent);
		return "ee" + getFullExpansion(num.log10().log10(), 6);
	}
	else if(game.options.notation == "Standard" || game.options.notation == "Mixed Scientific") {
		return toStandard(num, places, shortPlaces)
	}
}

function shortenMoney(num) {
	return shorten(num, 2, 0);
}

function shortenCosts(num) {
	return shorten(num, 0, 0);
}

function Logarithmic(num, shortPlaces) {
		if(num.lt(1e3)) return num.toFixed(shortPlaces);
		if(num.lt("ee6")) return "e" + getFullExpansion(num.log10(), 6);
		return "e" + Logarithmic(num.log10(), shortPlaces);
}
function InfinityPercent(num, shortPlaces) {
		if(num.lt(1e12)) return num.toFixed(shortPlaces);
		if(num.lt("ee12")) return getFullExpansion(num.log(Number.MAX_VALUE), 22) + '∞';
		return InfinityPercent(num.log(Number.MAX_VALUE), shortPlaces) + '∞';;
}
var smallAbbs = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg', 'QaVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QaTg', 'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QtQd', 'SxQd', 'SpQd', 'OQd', 'NQd', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi', 'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe', 'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt', 'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Nn', 'UNn', 'DNn', 'TNn', 'QaNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce', 'UCe'];

function toStandard(value, places, shortPlaces) {
	if (value.gt(1/0)) return "&#x221e;"
	else if (typeof(value.mag)!="number" || value.mag>=3e11+3) {
		return doHighStandard(value.mag)
	} else {
		var mantissa=value.m
		var exponent=value.e
		mantissa=mantissa*Math.pow(10,exponent%3)
		exponent=exponent-exponent%3
		if (mantissa>=999.995) {
			mantissa/=1000
			exponent+=3
		}
		if (exponent<3) return mantissa.toFixed(shortPlaces)
		else if (exponent<309) return mantissa.toFixed(places)+" "+smallAbbs[exponent/3]
		else {
			let prefixes = [
			['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
			['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
			['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
			let prefixes2 = ['', 'MI', 'MC', 'NA']
			var result = ''
			exponent = Math.floor(exponent/3)-1;
			e2 = 0
			while (exponent > 0) {		
				var partE = exponent % 1000
				if (partE > 0) {
					if (partE == 1 && e2 > 0) var prefix = ""
					else var prefix = prefixes[0][partE % 10] + prefixes[1][Math.floor(partE/10) % 10] + prefixes[2][Math.floor(partE/100)]
					if (result == "") result = prefix + prefixes2[e2]
					else result = prefix + prefixes2[e2] + '-' + result
				}
				exponent = Math.floor(exponent/1000)
				e2++
			}
			return mantissa.toFixed(places) + " " + result;
		}
	}
}

function doHighStandard(e) {
	let prefixes = [
	['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
	['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
	['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
	let prefixes2 = ['', 'MI', 'MC', 'NA', 'PC', 'FM', 'AT', 'ZP', 'YC', 'XN', 
	'VE', 'ME', 'DE', 'TE', 'TeE', 'PE', 'HE', 'HeE', 'OC', 'EC', 
	'IS', 'MS', 'DS', 'TS', 'TeS', 'PS', 'HS', 'HeS', 'OS', 'ES', 
	'TN', 'MTN', 'DTN', 'TTN', 'TeTN', 'PTN', 'HTN', 'HeTN', 'OTN', 'ETN', 
	'TeC', 'MTeC', 'DTeC', 'TTeC', 'TeTeC', 'PTeC', 'HTeC', 'HeTeC', 'OTeC', 'ETeC', 
	'PC', 'MPC', 'DPC', 'TPC', 'TePC', 'PPC', 'HPC', 'HePC', 'OPC', 'EPC', 
	'HC', 'MHC', 'DHC', 'THC', 'TeHC', 'PHC', 'HHC', 'HeHC', 'OHC', 'EHC', 
	'HeC', 'MHeC', 'DHeC', 'THeC', 'TeHeC', 'PHeC', 'HHeC', 'HeHeC', 'OHeC', 'EHeC', 
	'OC', 'MOC', 'DOC', 'TOC', 'TeOC', 'POC', 'HOC', 'HeOC', 'OOC', 'EOC', 
	'EC', 'MEC', 'DEC', 'TEC', 'TeEC', 'PEC', 'HEC', 'HeEC', 'OEC', 'EEC', 
	'HT', 'MHT', 'DHT']
	let prefixes2H = [
	['', 'M', 'D', 'T', 'Te', 'P', 'H', 'He', 'O', 'E'],
	['', 'E', 'S', 'TN', 'TeC', 'PeC', 'HC', 'HeC', 'OC', 'EC'],
	['', 'HT', 'DT', 'TT', 'TeT', 'PT', 'HT', 'HeT', 'OT', 'ET']]
	let prefixes3 = ["", "KA", "MG", "GI", "TR", "PT"]
	var result = ''
	if (typeof(e)=="number") {
		var id = Math.floor(e/3-1)
		var log = Math.floor(Math.log10(id))
		var step = Math.max(Math.floor(log/3-3),0)
		id = Math.round(id/Math.pow(10,Math.max(log-9,0)))*Math.pow(10,Math.max(log-9,0)%3)
	} else {
		var id = e.div(3)
		var log = Math.floor(id.log10())
		var step = Math.max(Math.floor(log/3-3),0)
		id = Math.round(id.div(Decimal_BI.pow(10,Math.max(log-9,0))).toNumber())*Math.pow(10,Math.max(log-9,0)%3)
	}
	while (id > 0) {		
		var partE = id % 1000
		if (partE > 0) {
			if (partE == 1 && step > 0) var prefix = ""
			else var prefix = prefixes[0][partE % 10] + prefixes[1][Math.floor(partE/10) % 10] + prefixes[2][Math.floor(partE/100)]
			var result2 = ""
			if (step > 102) {
				var s2 = step
				var stepT3 = 0
				while (s2 > 0) {
					partS = s2 % 1000
					if (partS > 0) {
						if (partS > 1 || stepT3 < 1) {
							prefix2 = prefixes2H[1][Math.floor(partS/10)%10]
							if (partS%100==10) prefix2 = "VE"
							if (partS%100==20) prefix2 = "IS"
							prefix2 = prefixes2H[0][partS%10] + prefix2 + prefixes2H[2][Math.floor(partS/100)]
						} else prefix2 = ""
						if (result2 == "") result2 = prefix2 + prefixes3[stepT3]
						else result2 = prefix2 + prefixes3[stepT3] + "a-" + result2
					}
					s2 = Math.floor(s2/1000)
					stepT3++
				}
				
			} else result2 = prefixes2[step]
			if (result == "") result = prefix + result2
			else result = prefix + result2 + '-' + result
		}
		id = Math.floor(id/1000)
		step++
	}
	return result;
}

function timeDisplay(time) {
  time = time / 1000
  
  if(time == Infinity) return "Eternity"
  
  if (time <= 10) return time.toFixed(3) + " seconds"
  time = Math.floor(time)

  if (time >= 31536000) {
	  return Math.floor(time / 31536000) + " years, " + Math.floor((time % 31536000) / 86400) + " days, " + Math.floor((time % 86400) / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else if (time >= 86400) {
	  return Math.floor(time / 86400) + " days, " + Math.floor((time % 86400) / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else if (time >= 3600) {
	  return Math.floor(time / 3600) + " hours, " + Math.floor((time % 3600) / 60) + " minutes, and " + Math.floor(time % 60) + " seconds"
  } else if (time >= 60) {
	  return Math.floor(time / 60) + " minutes and " + Math.floor(time % 60) + " seconds"
  } else return Math.floor(time % 60) + " seconds"
}

function preformat(int) {
  if (int.toString().length == 1) return "0"+int
  else return int
}

let small = ['','m','μ','n','p','f','a','z','y']
function timeDisplayShort(time, rep, places) {
	if (time == 1/0) {
		if (Decimal.eq(time, 1/0)) return 'eternity'
		return shorten(Decimal.div(time, 31536e4)) + 'y'
	}
	if (rep && time < 1) {
		if (time < 1e-24) return "1/"+formatValue(player.options.notation, 1/time, places, 0)+"s"
		if (time < 0.01) {
			var log = Math.ceil(-Math.log10(time))
			return (time * Math.pow(1e3, Math.ceil(log/3))).toFixed(Math.max(places+(log-1)%3-2, 0)) + " "+small[Math.ceil(log/3)]+"s"
		}
		return (time * 100).toFixed(time < 0.1 ? places : places-1) + " cs"
	}
	if (time < 60) return time.toFixed(time < 10 ? places : places-1) + " s" + (rep ? "" : "econds")
	if (time < 3600) return Math.floor(time/60) + ":" + preformat(Math.floor(time%60))
	if (time < 86400) return Math.floor(time/3600) + ":" + preformat(Math.floor((time/60)%60)) + ":" + preformat(Math.floor(time%60))
	if (time < 31536e3) return Math.floor(time/86400) + 'd, ' + Math.floor((time/3600)%24) + ":" + preformat(Math.floor((time/60)%60)) + ":" + preformat(Math.floor(time%60))
	if (time < 31536e4) return Math.floor(time/31536e3) + 'y, ' + Math.floor((time/86400)%365) + 'd, ' + Math.floor((time/3600)%24) + ":" + preformat(Math.floor((time/60)%60)) + ":" + preformat(Math.floor(time%60))
	return shorten(time/31536e3) + 'y'
}