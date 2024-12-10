<script lang="ts">
  import { searchQuery, filtered_res, storage, stack_list } from "../storage";

  import { StackAction, type ControlAction } from "../stack_controls";
  import MaterialSymbolsAdd from "~icons/material-symbols/add";
  import { onMount } from "svelte";

  //https://stackoverflow.com/a/65616230
  let query = "";

  export const searchHandler = (e: KeyboardEvent, stack_name: string) => {
    let message: ControlAction;
    if ($filtered_res.length === 0) {
      if (e.ctrlKey) {
        message = {
          action: StackAction.Create,
          stackName: stack_name,
        };
      } else {
        message = {
          action: StackAction.CreateAndSwitch,
          stackName: stack_name,
        };
      }
    } else {
      // if the user submits a partial match, open the first match
      message = {
        action: StackAction.Switch,
        stackName: $filtered_res[0][0],
      };
    }
    chrome.runtime.sendMessage(message);
  };

  export const stackClickHandler = (stack_name: string) => {
    chrome.runtime.sendMessage({
      action: StackAction.Switch,
      stackName: stack_name,
    });
  };

  export let closeHandler = async () => {};
  let searchInput: HTMLInputElement;
  $: searchQuery.set(query);
  onMount(() => {
    storage.get().then((res) => {
      stack_list.set(res.stack_list);
    });
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (e.matches) {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
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
    bind:this={searchInput}
    bind:value={query}
    placeholder="Search stacks..."
    on:keydown={(e) => {
      switch (e.key) {
        case "Enter":
          searchHandler(e, query);
          query = "";
          storage.get().then((res) => {
            console.log(res);
          });
          closeHandler().then(() => {});
          break;
        case "Escape":
          query = "";
          closeHandler().then(() => {});
          break;
        default:
          return;
      }
    }}
  />

  <ul>
    {#each $filtered_res as [stack_name, is_current], i}
      <li class={is_current ? "current-stack" : "stack-item"}>
        <button on:click={() => stackClickHandler(stack_name)}>
          {stack_name}
        </button>
      </li>
    {/each}
  </ul>
  <!-- TODO: having a plus won't work to well, may want to instead have text pop up 
 if no match (add new stack or somethign) -->
  <MaterialSymbolsAdd
    onclick={() => {
      stackClickHandler(query);
      query = "";
    }}
  />
</div>

<style>
  ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
  }
  li {
    width: 20%;
    content: center;
    margin: 10px 0 0;
    border-radius: 10px;
    display: inline-block;
  }

  @media (prefers-color-scheme: dark) {
    .stack-list {
      background-color: #232b2b;
      width: 100%;
      color: white;
    }
    .current-stack {
      background-color: #f88;
      padding: 8px;
      display: block;
      border: none;
      width: 100%;
      height: 100%;
      border-bottom: 1px solid #ccc;
    }
    .stack-item {
      padding: 8px;
      width: 100%;
      display: block;
      text-align: center;
      height: 100%;
      border-bottom: 1px solid #aaa;
      background-color: #232b2b;
    }
    button {
      display: block;
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
      padding: 1rem;
      text-align: center;
      font-size: 1rem;
      color: white;
    }
  }
  @media (prefers-color-scheme: light) {
    .current-stack {
      background-color: #fce;
      padding: 8px;
      border-bottom: 1px solid #ccc;
    }
    .stack-item {
      padding: 8px;
      border-bottom: 1px solid #ccc;
    }
  }
</style>
