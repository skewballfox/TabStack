import { mount } from 'svelte';
import Options from '../components/Options.svelte';
import { config, SearchTool } from '../storage';

// Action popup
// https://developer.chrome.com/docs/extensions/reference/action/

function render() {
  const target = document.getElementById('app');

  if (target) {
    mount(Options, {
      target,
      props: { config }
    });
    document
      .getElementById('search_tool_config')
      ?.addEventListener(SearchTool.Overlay, () => {
        chrome.permissions.request({ permissions: ['scripting'] }, (result) => {
          if (result) {
            console.log('Permission granted');
          } else {
            console.error('Permission not granted');
          }
        });
      });
  }
}
document.addEventListener('DOMContentLoaded', render);
