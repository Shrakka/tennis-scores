import express, { json } from "express";
import type { Request, Response } from "express";

const app = express();

app.post("/scores", json(), computeScoreController);

function computeScoreController(req: Request, res: Response) {
  const points = req.body;

  if (! isValidPointsArray(points)) {
    return res
      .status(400)
      .json({
        error: 400,
        message: "Invalid body format. Should be : [0, 1, 1, 0, 1, ...]"
      });
  }

  const score = computeScore(points);

  res.json(score);
}


function computeScore(points: Array<Point>) {
  let score: Score = {
    sets: [[0, 0]],
    currentGame: [0, 0]
  };

  console.log(points);

  for (const point of points) {
    score = computeNextScore(score, point);
    
    if (isMatchOver(score)) { break; }
  }

  return score;
}

function isMatchOver(score: Score) {
  if (score.sets.length < 3) { return false; }

  const firstPlayerNbOfWonSets = score.sets.filter(isSetWonByFirstPlayer).length;
  const secondPlayerNbOfWonSets = score.sets.filter(isSetWonBySecondPlayer).length;

  return Math.abs(firstPlayerNbOfWonSets - secondPlayerNbOfWonSets) === 3;


  function isSetWonByFirstPlayer(set: [SetPoint, SetPoint]) {
    return isSetWonByPlayer(set, 0);
  }
  
  function isSetWonBySecondPlayer(set: [SetPoint, SetPoint]) {
    return isSetWonByPlayer(set, 0);
  }
  
  function isSetWonByPlayer(set: [SetPoint, SetPoint], playerCode: Point) {
    const opponentCode = Math.abs(1 - playerCode) as Point;
    return set[playerCode] === 7 || ( (set[playerCode] === 6) && (set[opponentCode] < 5));
  }
}

function computeNextScore(score: Score, point: Point) {
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
		const setScoreDifference = currentWinnerSetScore - currentLoserSetScore;

		if (setScoreDifference <= 0 || currentWinnerSetScore <= 4) {
			// Si ex-eqo / OU / le joueur est en désavantage / OU / le joueur mène mais son score est de 4 points ou moins sur le jeu décisif courant
			// Alors on augmente le score du joueur
			(score.currentGame[winnerCode] as number) += 1;
			return score;
		}

		// Sinon, le joueur mène d'au moins un point et a déjà 5 points : il vient donc de gagner le set !
		score.sets[score.sets.length - 1] = winnerCode ? [6, 7] : [7, 6]; // On inscrit le score du set 
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
	currentSet[winnerCode] += 1; // On augmente le score du joueur

	if (currentSet[winnerCode] === 6) { // Si le joueur vient de gagner le set
		score.sets.push([0, 0]); // On itinialise le premier set 
	}

	return score;
}

interface Score {
  sets: Array<[SetPoint, SetPoint]>,
  currentGame: [GamePoint, GamePoint]
}

type Point = 0 | 1; // 0 = First player won | 1 = Second Player won

type SetPoint = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type GamePoint = ClassicGamePoint | DecisiveGamePoint;
type ClassicGamePoint = 0 | 15 | 30 | 40 | "AV";
type DecisiveGamePoint = number;

function isValidPointsArray(points: unknown): points is Array<Point> {
  if (! Array.isArray(points)) { return false; }

  return ! points.some(isNotZeroOrOne);

  function isNotZeroOrOne(point: any) {
    return point !== 0 && point !== 1;
  }
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});
