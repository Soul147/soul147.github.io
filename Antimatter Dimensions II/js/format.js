function getFullExpansion(num, places) {
	num = new Decimal(num);
	if(num.gt(1e15)) return shorten(num);
	return num.toFixed(places).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function shorten(num, places = 2, shortPlaces = 2) {
	num = new Decimal(num);
	if(num.isNaN() || !num.log10()) return "NaN"
	
	if(num.lt(1e3)) return num.toFixed(shortPlaces);
	if(num.gt(Number.MAX_VALUE) && !game.break) return "Infinite"
	
	if(game.options.notation == "Scientific") {
		var e = num.log10().floor();
		var m = Decimal.pow(10, num.log10().subtract(e))
		return m.toFixed(2) + "e" + getFullExpansion(e)	;
	}
}

function shortenMoney(num) {
	return shorten(num, 2, 0);
}

function shortenCosts(num) {
	return shorten(num, 0, 0);
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
		if (time < 1e-24) return "1/"+shorten(1/time, places)+"s"
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