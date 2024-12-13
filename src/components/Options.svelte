<script lang="ts">
  import { type Writable } from 'svelte/store';
  import { type Config } from '../storage';

  interface Props {
    config: Writable<Config>;
  }

  let { config }: Props = $props();
</script>

<div class="container">
  <div>
    <label for="tab_limit">Set Tab Limit:</label>
    <input
      type="number"
      placeholder={String($config.tab_limit)}
      bind:value={$config.tab_limit}
    />
    <br />
    <label for="tab_strategy"
      >How to handle new tabs when the limit is reached:</label
    >
    <select bind:value={$config.limit_strategy}>
      <option value="lru"> Close the least recently used tab</option>
      <option value="auto"> Close the newest tab without prompting</option>
    </select>
  </div>
</div>

<style>
  .container {
    min-width: 250px;
  }
</style>
