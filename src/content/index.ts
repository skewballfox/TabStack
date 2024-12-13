import { mount } from 'svelte';
import Overlay from '../components/Overlay.svelte';
import { is_open } from './state';
//import { storage } from '../storage';

// Content scripts
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/

// Some global styles on the page
import './styles.css';
console.log('Content script loaded');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.greeting === 'open') {
    is_open.set(true);
    document.body.classList.add('background-overlay');
  }
  if (request.greeting === 'close') {
    is_open.set(false);
    document.body.classList.remove('background-overlay');
  }
});
// Some JS on the page
//storage.get().then(console.log);
const closeHandler = async () => {
  chrome.runtime.sendMessage({ greeting: 'close' });
};
// Some svelte component on the page
//new Overlay({ target: document.body, props: { closeHandler: closeHandler } });
mount(Overlay, { target: document.body, props: { closeHandler } });
