<script lang="ts">
  import { writable, derived } from "svelte/store";
  import {
    searchQuery,
    filtered_res,
    storage,
    defaultStackList,
  } from "../storage";
  import { CreateAndSwitchStack, tryCreateNewStack } from "../stack_controls";
  import MaterialSymbolsAdd from "~icons/material-symbols/add";
  import { onMount } from "svelte";
  import { switchStack } from "../stack_controls";

  //https://stackoverflow.com/a/65616230
  let query = "";

  $: searchQuery.set(query);
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
  bind:value={query}
  placeholder="Search stacks..."
  on:keydown={(e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        let success = tryCreateNewStack(query);
      } else {
        CreateAndSwitchStack(query);
      }
      // if the stack was created, clear the query
      query = "";
      storage.get().then((res) => {
        console.log(res);
      });
    }
  }}
/>

<ul>
  {#each $filtered_res as [stack_name, _], i}
    <li class="stack-item">
      <button on:click={() => switchStack(stack_name)}>
        {stack_name}
      </button>
    </li>
  {/each}
</ul>
<!-- TODO: having a plus won't work to well, may want to instead have text pop up 
 if no match (add new stack or somethign) -->
<MaterialSymbolsAdd
  onclick={() => {
    tryCreateNewStack(query);
    query = "";
  }}
/>

<style>
  .stack-item {
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
</style>
