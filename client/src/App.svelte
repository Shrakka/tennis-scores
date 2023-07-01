<Layout>
  <h2>Settings</h2>

  <form id="generator">
    <div class="grid">
      <div>
        <label for="first-player-name">First player</label>
        <input type="text" id="first-player-name" name="first-player-name" placeholder="Player 1">
    
        <label for="first-player-level">Level</label>
        <input type="range" id="first-player-level" min="1" max="10" value="5" name="first-player-level">
      </div>
  
      <div>
        <label for="second-player-name">Second player</label>
        <input type="text" id="second-player-name" name="second-player-name" placeholder="Player 2">
    
        <label for="second-player-level">Level</label>
        <input type="range" id="second-player-level" min="1" max="10" value="5" name="second-player-level">
      </div>
    </div>
    
    <div class="grid">
      <div>
        <label for="nb-of-points">Number of points to play</label>
        <input type="number" name="nb-of-points" id="nb-of-points" value="150">
      </div>

      <button>Generate score sequence</button>
    </div>
  </form>

  <h2>Results</h2>

  <article id="sequence-result" class="sequence-result">
  </article>

  <article id="score-result">
    <pre><code>
    </code></pre>
  </article>
</Layout>

<script lang="ts">
  import Layout from "./Layout.svelte";
</script>

<style>
  .sequence-result {
    height: 190px;
    overflow: scroll;
  }
</style>
