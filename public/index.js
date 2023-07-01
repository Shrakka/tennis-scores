const generatorForm = document.getElementById("generator");

generatorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(generatorForm);

  const firstPlayerName = form.get("first-player-name") || "Player 1";
  const secondPlayerName = form.get("second-player-name") || "Player 2";
  const firstPlayerLevel = parseInt(form.get("first-player-level"));
  const secondPlayerLevel = parseInt(form.get("second-player-level"));
  const nbOfPointsToPlay = parseInt(form.get("nb-of-points"));

  const bestPlayerCode = firstPlayerLevel > secondPlayerLevel ? 0 : 1;
  const weakPlayerCode = Math.abs(bestPlayerCode - 1);
  const levelDifference = Math.abs(firstPlayerLevel - secondPlayerLevel);
  const sequence = Array(nbOfPointsToPlay).fill().map(generateLikelyPoint);
  
  // Display sequence
  const sequenceResult = document.getElementById("sequence-result");
  sequenceResult.innerHTML = sequence.map(buildPlayerPoint).join("");

  const httpResponse = await fetch("/scores", {
    method: "POST",
    body: JSON.stringify(sequence),
    headers: { "Content-Type": "application/json" }
  });
  const result = await httpResponse.json();

  document.querySelector("code").innerHTML = JSON.stringify(result);
  
  
  function generateLikelyPoint() {
    const threshold = 0.5 + levelDifference / 20;
    return Math.random() < threshold ? bestPlayerCode: weakPlayerCode;

    // Explication via exemple : 
    // Niveau (1, 10) => 0.5 + ( |10 - 1| / 20 ) = 0.95% de chance pour le meilleur joueur de gagner
    // Niveau (2, 10) => 0.5 + ( |10 - 2| / 20 ) = 0.90% de chance pour le meilleur joueur de gagner
    // Niveau (5, 5) => 0.5 + ( |5 - 5| / 20 ) = 0.50% de chance pour le meilleur joueur de gagner
  }

  function buildPlayerPoint(point) {
    return `<li>${point ? secondPlayerName : firstPlayerName } scored !</li>`;
  }
});
