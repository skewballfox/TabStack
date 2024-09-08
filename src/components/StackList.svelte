<script lang="ts">
  import { searchQuery, filtered_res, storage, stack_list } from "../storage";
  import { CreateAndSwitchStack, tryCreateNewStack } from "../stack_controls";
  import MaterialSymbolsAdd from "~icons/material-symbols/add";
  import { onMount } from "svelte";
  import { switchStack } from "../stack_controls";

  //https://stackoverflow.com/a/65616230
  let query = "";
  export const searchHandler = (e: KeyboardEvent) => {
    if ($filtered_res.length === 0) {
      if (e.ctrlKey) {
        let success = tryCreateNewStack(query);
      } else {
        CreateAndSwitchStack(query);
      }
    } else {
      // if the user submits a partial match, open the first match
      switchStack($filtered_res[0][0]);
    }
  };

  export const stackClickHandler = (stack_name: string) => {
    switchStack(stack_name);
  };

  $: searchQuery.set(query);
  onMount(() => {
    storage.get().then((res) => {
      stack_list.set(res.stack_list);
    });
  });
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
<div class="stack-list">
  <input
    type="text"
    bind:value={query}
    placeholder="Search stacks..."
    on:keydown={(e) => {
      if (e.key === "Enter") {
        // if the stack was created, clear the query
        query = "";
        storage.get().then((res) => {
          console.log(res);
        });
      }
    }}
  />

  <ul>
    {#each $filtered_res as [stack_name, is_current], i}
      <li class={is_current ? "current-stack" : "stack-item"}>
        <button on:click={() => stackClickHandler}>
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
</div>

<style>
  .current-stack {
    background-color: #fce;
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
  .stack-item {
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
</style>
