<Layout>
  
  <section>
    <h2>Settings</h2>
  
    <form on:submit|preventDefault={generatePointsSequence}>
      <div class="grid">
        <div>
          <label for="first-player-name">First player</label>
          <input type="text" bind:value={firstPlayerName} id="first-player-name" placeholder="Player 1">
      
          <label for="first-player-level">Level</label>
          <input type="range" bind:value={firstPlayerLevel} id="first-player-level" min="1" max="10">
        </div>
    
        <div>
          <label for="second-player-name">Second player</label>
          <input type="text" bind:value={secondPlayerName} id="second-player-name" placeholder="Player 2">
      
          <label for="second-player-level">Level</label>
          <input type="range" bind:value={secondPlayerLevel} id="second-player-level" min="1" max="10">
        </div>
      </div>
      
      <div class="grid">
        <div>
          <label for="nb-of-points">Number of points to play</label>
          <input type="number"  bind:value={nbOfPointsToPlay}  id="nb-of-points">
        </div>
  
        <button>Generate points sequence</button>
      </div>
    </form>
  </section>

  <section bind:this={resultsSection}>
    {#if points.length > 0}
      <h2>Results</h2>
  
      <div class="grid">
        <article class="scrollable">
          <h3>Match summary</h3>
          <table>
            <thead>
              <th>Point n°</th>
              <th>{firstPlayerName || "Player 1"}</th>
              <th>{secondPlayerName || "Player 2"}</th>
            </thead>
            <tbody>
              {#each points as point, index }
                <tr>
                  <td>{index + 1}</td>
                  <td>{point ? "Scored": "-"}</td>
                  <td>{point ? "-": "Scored"}</td>
                </tr>
              {/each}
            </tbody>
          </table>
          <ul>
          </ul>
        </article>
  
        <article>
          <h3>Match score</h3>

          {#if shouldShowScoreButton}
            <button on:click={() => {shouldShowScoreButton = false; }}>
              See match score
            </button>
          {:else}
          
            {#await fetchScore()}
              <button aria-busy="true" disabled>Please wait…</button>
            {:then score}
              <ScoreTable
                score={score}
                firstPlayerName={firstPlayerName || "Player 1"}
                secondPlayerName={secondPlayerName || "Player 2"}
              />
            {:catch error}
              <button class="secondary" disabled>{error.message}</button>
            {/await}

          {/if}


        </article>
      </div>
    {/if}
  </section>
</Layout>


<script lang="ts">
import { tick } from "svelte";
import Layout from "./Layout.svelte";
import ScoreTable from "./ScoreTable.svelte";

let firstPlayerName = "";
let secondPlayerName = "";

let firstPlayerLevel = 5;
let secondPlayerLevel = 5;

let nbOfPointsToPlay = 150;

let points: Array<0 | 1> = [];
  
let resultsSection: Element;
let shouldShowScoreButton: Boolean;

async function generatePointsSequence() {
  const bestPlayerCode = firstPlayerLevel > secondPlayerLevel ? 0 : 1;
  const weakPlayerCode = Math.abs(bestPlayerCode - 1);
  const levelDifference = Math.abs(firstPlayerLevel - secondPlayerLevel);
  points = Array(nbOfPointsToPlay).fill(null).map(generateLikelyPoint);

  scrollTo(resultsSection);
  shouldShowScoreButton = true;

  function generateLikelyPoint() {
    const threshold = 0.5 + levelDifference / 20;
    return (Math.random() < threshold ? bestPlayerCode : weakPlayerCode) as 0 | 1;
    // Explication via exemple : 
    // Niveau (1, 10) => 0.5 + ( |10 - 1| / 20 ) = 0.95% de chance pour le meilleur joueur de gagner
    // Niveau (2, 10) => 0.5 + ( |10 - 2| / 20 ) = 0.90% de chance pour le meilleur joueur de gagner
    // Niveau (5, 5) => 0.5 + ( |5 - 5| / 20 ) = 0.50% de chance pour le meilleur joueur de gagner
  }
}

async function scrollTo(element: Element) {
  await tick();
  element.scrollIntoView({ behavior: "smooth" });
}

async function fetchScore() {
  const httpResponse = await fetch("/api/scores", {
    method: "POST",
    body: JSON.stringify(points),
    headers: { "Content-Type": "application/json" }
  });

  if (! httpResponse.ok) {
    console.error(httpResponse);
    throw new Error("We're sorry, an error occured. Please try again later.");
  }
  
  return httpResponse.json();
}

</script>


<style>
  article {
    margin: 1rem 0;
  }

  .scrollable {
    overflow: scroll;
    height: 400px;
  }
</style>
