function getSecretAchMult() {
	return Math.round(Math.pow(1.5, getSecretAchAmount()) * 100) / 100;
}