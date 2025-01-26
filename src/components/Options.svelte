<script lang="ts">
  import { type Writable } from 'svelte/store';
  import { SearchTool, type Config } from '../storage';

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
    <label for="search_tool_config">Stack Search Tool</label>
    <select
      bind:value={$config.search_handler}
      onchange={() => {
        console.log('onchange');
        chrome.permissions.request(
          {
            permissions: ['scripting']
          },
          (granted) => {
            if (granted) {
              console.log('granted');
            } else {
              console.log('not granted');
            }
          }
        );
      }}
    >
      <option value={SearchTool.SidePanel}>
        Search/Manage stacks via sidepanel</option
      >
      <option class="overlay_select" value={SearchTool.Overlay}>
        Search/Manage stacks via overlay</option
      >
    </select>
  </div>
</div>

<style>
  .container {
    min-width: 250px;
  }
</style>
