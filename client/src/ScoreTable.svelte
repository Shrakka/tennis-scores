<div>

  <table>
    <tbody>
      <tr>
        <td>{firstPlayerName}</td>

        {#each score.sets as set}
        <td>{set[0]}</td>
        {/each}

        {#if !isGameOver}
        <td>|</td>
        <td><mark>{score.currentGame[0]}</mark></td>
        {/if}
      </tr>
  
      <tr>
        <td>{secondPlayerName}</td>
        
        {#each score.sets as set}
        <td>{set[1]}</td>
        {/each}

        {#if !isGameOver}
        <td>|</td>
        <td><mark>{score.currentGame[1]}</mark></td>
        {/if}
      </tr>
    </tbody>
  </table>
  
  {#if isGameOver}
    <p>Game is over.</p>
    <p>Winner: <strong>{score.winner ? secondPlayerName : firstPlayerName}</strong> !</p>
  {:else}
    <p>Game in progress...</p>
  {/if}

</div>

<script lang="ts">
  export let score: any;
  export let firstPlayerName: string;
  export let secondPlayerName: string;

  $: isGameOver = score.winner !== undefined;
</script>

<style scoped>
  td {
    padding: 10px 1px;
  }

  p {
    text-align: right;
    margin: 0;
  }
</style>