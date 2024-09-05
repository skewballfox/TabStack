<script lang="ts">
  import { storage, type StackList } from "../storage";
  import { onMount } from "svelte";

  let stack_list: StackList;
  onMount(() => {
    storage.get().then((storage) => (stack_list = storage.stack_list));
  });
  let searchQuery = "";

  function filterStacks() {
    return Object.entries(stack_list.stacks).filter(([stack, _]) =>
      stack.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
</script>

<!--
Desired functionality:
- default display of all stacks (rectangular clickable elements), with a + at bottom
- search bar at top
    - if user types in the search bar, only display stacks that match the search query
    - if only one match, pressing enter should open that stack
    - if multiple matches, pressing enter should open the first stack
    - if no matches, pressing enter creates a new stack with the search query as the name
-->

<!-- https://kit.svelte.dev/docs/form-actions#progressive-enhancement -->
<input
  type="text"
  bind:value={searchQuery}
  on:change={filterStacks}
  placeholder="Search stacks..."
/>

<ul>
  {#each filterStacks() as stack}
    <li class="stack-item">{stack}</li>
  {/each}
</ul>

<style>
  .stack-item {
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
</style>
