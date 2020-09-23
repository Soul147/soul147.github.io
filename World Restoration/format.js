function shorten(n) {
	return shortenTo(n, 2)
}

function shortenMoney(n) {
	return shortenTo(n, 0)
}

function shortenTo(n, decimal) {
	if(typeof n == "number") n = new Decimal(n);
	
	if(n.lte(1e16)) return getFullExpansion(n, decimal);
	if(n.lte("ee16")) return n.m.toFixed(2)+"e"+n.e;
	return n.toFixed(decimal);
}

function getFullExpansion(num, decimal) {
	if (num === null) return "NaN"
	if (isNaN(num)) return "NaN"
	if (num > 1e16) return shorten(num)
	if(decimal) return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}