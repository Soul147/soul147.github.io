// Returns total growth of dimensions over a period of time.
// Input a list of dimension amounts into l, it will return the total money produced.
// In the future, it will return time until X money.

function getMoneyWithTime(time, l) {
  var g = []; // list of different growths

  g[8] = Decimal(1/90).multiply(l[8].pow(9).multiply(10).add(l[8].pow(8).multiply(45)).add(l[8].pow(7).multiply(60).add(l[8].pow(5).multiply(-42)).add(l[8].pow(3).multiply(20)).add(l[8].multiply(-3)))
}

function getTimeUntilMoney(money, l) {
  // work in progress
}
