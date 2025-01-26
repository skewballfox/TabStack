<script lang="ts">
  import StackList from './StackList.svelte';

  import { type Writable } from 'svelte/store';

  export let active: Writable<boolean>;
  export let closeHandler = async () => {
    await active.set(false);
  };

  const keydownHandler = async (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      await closeHandler();
    }
  };
</script>

<!-- {#if active} -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog class="overlay">
  <StackList {closeHandler} />
</dialog>

<!-- {/if} -->

<style>
  .overlay {
    z-index: 999;
    position: fixed;
    width: 300px;
    top: 50%;
    justify-content: center;
    left: 50%;
    background-color: white;
    border: 1px solid black;
    padding: 16px;
  }
  /* :global(body.background-grey) {
    background-color: rgba(0, 0, 0, 0.5);
  } */
</style>
