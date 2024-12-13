<script lang="ts">
  import { onMount } from 'svelte';
  import { is_open } from '../content/state';
  import StackList from './StackList.svelte';
  export let active: boolean = false;
  export let closeHandler = async () => {};
  $: is_open.subscribe((val) => {
    active = val;
  });

  const keydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeHandler();
    }
  };
</script>

{#if active}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <dialog class="overlay" on:keydown={keydownHandler}>
    <StackList {closeHandler} />
  </dialog>
{/if}

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
  :global(body.background-grey) {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
