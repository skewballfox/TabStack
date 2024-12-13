import { mount } from 'svelte';
import Options from '../components/Options.svelte';
import { config } from '../storage';

// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/

function render() {
  const target = document.getElementById('app');

  if (target) {
    mount(Options, {
      target,
      props: { config }
    });
  }
}

document.addEventListener('DOMContentLoaded', render);
