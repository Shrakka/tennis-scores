import type { Point, Score, SetPoint } from "./types";


export function computeScore(points: Array<Point>) {
	let score: Score = {
		sets: [[0, 0]],
		currentGame: [0, 0]
	};

	for (const point of points) {
		score = computeNextScore(score, point);

		if (isMatchOver(score)) {
			return formatFinalScore(score);
		}
	}

	return score;
}

export function computeNextScore(score: Score, point: Point) {
  // On mute le "score" et on le retourne
  const winnerCode = point;
  const loserCode = Math.abs(1 - point) as Point;

	const currentSet = score.sets[score.sets.length - 1];
  const currentWinnerSetScore = currentSet[winnerCode];
  const currentLoserSetScore = currentSet[loserCode];

	const currentGame = score.currentGame;
	const currentWinnerGameScore = currentGame[winnerCode];
	const currentLoserGameScore = currentGame[loserCode];

	// CAS : JEU DECISIF
	if (currentWinnerSetScore === 6 && currentLoserSetScore === 6) {
		const currentWinnerScoreInTieBreak = currentWinnerGameScore as number;
		const currentLoserGameScoreInTieBreak = currentLoserGameScore as number;

		const gameScoreDifference = currentWinnerScoreInTieBreak - currentLoserGameScoreInTieBreak;
		
		if (currentWinnerScoreInTieBreak < 6 || gameScoreDifference <= 0) { // Si le joueur a moins de 6 points ou qu'il ne mène pas d'un point
			score.currentGame[winnerCode] = currentWinnerScoreInTieBreak + 1; // alors on augmente le score du gagnant
			return score;
		}
		
		// Sinon, le joueur mène d'au moins un point et a déjà 6 points : il vient donc de gagner le set !
		score.sets[score.sets.length - 1][winnerCode] = 7;
		score.sets[score.sets.length - 1][loserCode] = 6;
		score.sets.push([0, 0]); // On initialise le prochain set
		score.currentGame = [0, 0]; // On réinitialise le current game.

		return score;
	}


	// CAS : JEU CLASSIQUE

	if (currentWinnerGameScore === 0) {
		score.currentGame[winnerCode] = 15;
		return score;
	}

	if (currentWinnerGameScore === 15) {
		score.currentGame[winnerCode] = 30;
		return score;
	}

	if (currentWinnerGameScore === 30) {
		score.currentGame[winnerCode] = 40;
		return score;
	}

	// CAS RESTANT : le joueur a 40

	if (currentLoserGameScore === 40) { // Le joueur adverse a aussi 40
		score.currentGame[winnerCode] = "AV"; // On passe le joueur a avantage
		return score;
	}

	if (currentLoserGameScore === "AV") { // Le joueur adverse avait avantage
		score.currentGame[loserCode] = 40; // On repasse le joueur adverse à 40
		return score;
	}

	// CAS RESTANT : le joueur a 40 et l'adversaire à 30 ou moins, il gagne le jeu
	score.currentGame = [0, 0]; // On réinitialise le currentGame
	score.sets[score.sets.length - 1][winnerCode] += 1; // On augmente le score du joueur

	if (score.sets[score.sets.length - 1][winnerCode] === 6 && currentSet[loserCode] <= 4) { // Si le joueur vient de gagner le set
		score.sets.push([0, 0]); // On itinialise le premier set 
	}

	return score;
}


export function isMatchOver(score: Score) {
  if (score.sets.length < 3) { return false; }

  const firstPlayerNbOfWonSets = score.sets.filter(isSetWonByFirstPlayer).length;
	if (firstPlayerNbOfWonSets === 3) { return true; }

	const secondPlayerNbOfWonSets = score.sets.filter(isSetWonBySecondPlayer).length;
	if (secondPlayerNbOfWonSets === 3) { return true; }

	return false;
}

function isSetWonByFirstPlayer(set: [SetPoint, SetPoint]) {
	return isSetWonByPlayer(set, 0);
}

function isSetWonBySecondPlayer(set: [SetPoint, SetPoint]) {
	return isSetWonByPlayer(set, 1);
}

function isSetWonByPlayer(set: [SetPoint, SetPoint], playerCode: Point) {
	const opponentCode = Math.abs(1 - playerCode) as Point;
	return set[playerCode] === 7 || ( (set[playerCode] === 6) && (set[opponentCode] < 5) );
}

function formatFinalScore(score: Score) {
	return {
		sets: score.sets.slice(0, -1),
		currentGame: [0, 0],
		winner: getWinner()
	}

	function getWinner() {
		const firstPlayerNbOfWonSets = score.sets.filter(isSetWonByFirstPlayer).length;
  	const secondPlayerNbOfWonSets = score.sets.filter(isSetWonBySecondPlayer).length;
		return firstPlayerNbOfWonSets > secondPlayerNbOfWonSets ? 0 : 1;
	}
}
