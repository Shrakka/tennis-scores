const generatorForm = document.getElementById("generator");

generatorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(generatorForm);

  const firstPlayer = {
    name: form.get("first-player-name"),
    level: parseInt(form.get("first-player-level")),
    code: 0
  };

  const secondPlayer = {
    name: form.get("second-player-name"),
    level: parseInt(form.get("second-player-level")),
    code: 1
  };

  const bestPlayer = firstPlayer.level > secondPlayer.level ? firstPlayer : secondPlayer;
  const weakPlayerCode = Math.abs(bestPlayer.code - 1);
  const levelDifference = Math.abs(firstPlayer.level - secondPlayer.level);
  const sequence = Array(150).fill().map(generateLikelyPoint);
  
  // Display sequence
  const sequenceResult = document.getElementById("sequence-result");
  sequenceResult.innerHTML = sequence.map(point => {}).join();
  
  function generateLikelyPoint() {
    const threshold = 0.5 + levelDifference / 20;
    return Math.random() < threshold ? bestPlayer.code: weakPlayerCode.code;

    // Explication via exemple : 
    // Niveau (1, 10) => 0.5 + ( |10 - 1| / 20 ) = 0.95% de chance pour le meilleur joueur de gagner
    // Niveau (2, 10) => 0.5 + ( |10 - 2| / 20 ) = 0.90% de chance pour le meilleur joueur de gagner
    // Niveau (5, 5) => 0.5 + ( |5 - 5| / 20 ) = 0.50% de chance pour le meilleur joueur de gagner
  }

  function buildPlayerPoint(point) {
    return `Le joueur ${}`
  }
});

function displaySequence(sequence) {
    const sequenceResult = document.getElementById("sequence-result");

    sequenceResult.innerHTML = sequence.map(point => {})
}