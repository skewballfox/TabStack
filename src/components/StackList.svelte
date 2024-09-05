<script lang="ts">
  import { writable, derived, type Writable } from "svelte/store";
  import {
    storage,
    type StackList,
    tryAddStack,
    defaultStackList,
    stack_list,
  } from "../storage";
  import MaterialSymbolsAdd from "~icons/material-symbols/add";
  import { onMount } from "svelte";

  export const searchQuery = writable("");

  onMount(() => {
    storage.get().then((storage) => stack_list.set(storage.stack_list));
  });

  export const filtered_res = derived(
    [searchQuery, stack_list],
    ([$searchQuery, $stack_list]) =>
      Object.entries($stack_list.stacks)
        .filter(([stack, _]) =>
          stack.toLowerCase().includes($searchQuery.toLowerCase())
        )
        .sort((a, b) => a[0].localeCompare(b[0]))
  );

  function filterStacks() {
    return Object.entries($stack_list.stacks)
      .filter(([stack, _]) =>
        stack.toLowerCase().includes($searchQuery.toLowerCase())
      )
      .sort((a, b) => a[0].localeCompare(b[0]));
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

<input type="text" bind:value={$searchQuery} placeholder="Search stacks..." />

<ul>
  {#each $filtered_res as [stack_name, _], i}
    <li class="stack-item">
      <button on:click={() => console.log(stack_name)}>
        {stack_name}
      </button>
    </li>
  {/each}
</ul>
<!-- TODO: having a plus won't work to well, may want to instead have text pop up 
 if no match (add new stack or somethign) -->
<MaterialSymbolsAdd onclick={() => tryAddStack($searchQuery)} />

<style>
  .stack-item {
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
</style>
