import { mount, unmount } from 'svelte';
import Overlay from '../components/Overlay.svelte';
import { writable } from 'svelte/store';
// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
//import './styles.css';
import { searchAction } from '../stack_controls';

function startOverlay() {
  chrome.tabs.onActivated.addListener(function closeOnTabSwitch(activeInfo) {
    chrome.runtime.sendMessage(searchAction.Close).then(() => {
      chrome.tabs.onActivated.removeListener(closeOnTabSwitch);
    });
  });
  mount(Overlay, {
    target: document.body,
    props: {
      active: overlay_active,
      closeHandler
    }
  });
}
console.log('Content script loaded');
let overlay_active = writable(false);
chrome.runtime.onMessage.addListener((action: searchAction) => {
  switch (action) {
    case searchAction.Open:
      mount(Overlay, {
        target: document.body,
        props: {
          active: overlay_active,
          closeHandler
        }
      });
      break;
    case searchAction.Close:
      unmount(Overlay);
      break;
  }
});

// Some JS on the page
//storage.get().then(console.log);
const closeHandler = async () => {
  overlay_active.set(false);
};
// Some svelte component on the page
//new Overlay({ target: document.body, props: { closeHandler: closeHandler } });
mount(Overlay, {
  target: document.body,
  props: {
    active: overlay_active,
    closeHandler
  }
});
