<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<button
  type={$$restProps.type}
  class={$$restProps.class}
  on:click={() => {
    dispatch("click", {});
  }}
>
  <slot />
</button>
