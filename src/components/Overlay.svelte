<script lang="ts">
  import { onMount } from "svelte";
  import { storage } from "../storage";
  import Options from "./Options.svelte";

  let tab_limit = 0;

  onMount(() => {
    storage.get().then((storage) => (tab_limit = storage.tab_limit));
  });
</script>

<div class="overlay">
  <Options {tab_limit} />
</div>

<style>
  .overlay {
    position: fixed;
    width: 300px;
    top: 16px;
    left: 16px;
    background-color: white;
    border: 1px solid black;
    padding: 16px;
  }
</style>
