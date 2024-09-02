<script lang="ts">
  import { storage, type Config } from "../storage";

  export let tab_limit: number = 7;
  let successMessage: string | null = null;

  function save() {
    const config = { tab_limit };
    storage.set_config(config).then(() => {
      successMessage = "Options saved!";

      setTimeout(() => {
        successMessage = null;
      }, 1500);
    });
  }
</script>

<div class="container">
  <div>
    <label for="tab_limit">Set Tab Limit:</label>
    <input type="number" bind:value={tab_limit} />
    <button on:click={save}>Save</button>
    {#if successMessage}<span class="success">{successMessage}</span>{/if}
  </div>
</div>

<style>
  .container {
    min-width: 250px;
  }

  button {
    border-radius: 2px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    background-color: #2ecc71;
    color: #ecf0f1;
    transition: background-color 0.3s;
    padding: 5px 10px;
    border: none;
  }

  button:hover,
  button:focus {
    background-color: #27ae60;
  }

  .success {
    color: #2ecc71;
    font-weight: bold;
  }
</style>
