import { stack_list, SearchTool, config, LimitStrategy } from '../storage';
// more info on using dynamic content scripts with vite:
// https://dev.to/jacksteamdev/advanced-config-for-rpce-3966#dynamic-content-scripts
//import searchScript from "../content/search?script"
import {
  searchAction,
  stack_control_request_handler,
  type ControlAction
} from '../stack_controls';

//const browser = chrome || browser

// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/

chrome.runtime.onInstalled.addListener(async (details) => {
  // populate the default stack

  // initialize the stacks with the current tabs
  async function initializeStacks() {
    const tabs = await chrome.tabs.query({ currentWindow: true });

    stack_list.update((stacklist) => {
      stacklist.stacks[stacklist.currentStack].tabs = tabs;
      return stacklist;
    });
  }

  if (details.reason === 'install' || details.reason === 'update') {
    // Initialize the stack list
    await initializeStacks();
  }

  // Set up listener for tab creation
  chrome.tabs.onCreated.addListener((tab) => {
    console.log('New tab created:', tab.id);
    tryOpenTab(tab);
    if (tab.id) {
      maybeInjectOverlay(tab);
    }
  });

  // Set up listener for tab removal
  // relevant docs: https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#programmatic
  chrome.commands.onCommand.addListener(async (command, current_tab) => {
    console.log('Command:', command);
    console.log('Current tab:', current_tab);
    if (command === Command.SearchStacks) {
      await searchHandler(current_tab);
    }
  });

  chrome.runtime.onMessage.addListener(async function (
    request: ControlAction,
    sender,
    _
  ) {
    console.log(
      sender.tab
        ? 'from a content script:' + sender.tab.url
        : 'from the extension'
    );
    stack_control_request_handler(request);
  });
});

enum Command {
  SearchStacks = 'search-stacks',
  pushTabToStack = 'push_tab_to_stack'
}

function maybeInjectOverlay(tab: chrome.tabs.Tab) {
  config.subscribe(async (config) => {
    if (config.search_handler === SearchTool.Overlay) {
      chrome.permissions.contains({ permissions: ['scripting'] }, (result) => {
        if (result) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id ?? 0 },
            files: ['content.js']
          });
        } else {
          console.error('Scripting permission not granted');
        }
      });
    }
  });
}

async function evictTab(strat: LimitStrategy, tabs: chrome.tabs.Tab[]) {
  let tab: chrome.tabs.Tab | undefined;
  switch (strat) {
    case LimitStrategy.LRU:
      tab = tabs.toSorted(
        (a, b) => (a.lastAccessed ?? 0) - (b.lastAccessed ?? 0)
      )[-1];
      break;
    case LimitStrategy.NewestTab:
      tab = tabs.pop();
      break;
  }
  if (tab?.id) {
    chrome.tabs.remove(tab.id);
  }
}

async function tryOpenTab(newtab: chrome.tabs.Tab) {
  config.subscribe(async (config) => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    if (tabs.length > config.tab_limit) {
      // If the tab limit has been reached, close the appropriate tab
      console.log('limit reached: closing tab');
      evictTab(config.limit_strategy, tabs);
    }
  });
}

async function searchHandler(current_tab: chrome.tabs.Tab) {
  config.subscribe(async (config) => {
    switch (config.search_handler) {
      case SearchTool.SidePanel:
        sidePanelSearchHandler(current_tab);
        break;
      case SearchTool.Overlay:
        chrome.permissions.contains(
          { permissions: ['scripting'] },
          (result) => {
            if (result) {
              overlaySearchHandler(current_tab);
            } else {
              console.error('Scripting permission not granted');
            }
          }
        );
        break;
    }
  });
}

async function sidePanelSearchHandler(current_tab: chrome.tabs.Tab) {
  await chrome.sidePanel.open({
    tabId: current_tab.id,
    windowId: current_tab.windowId
  });
  const current_id = current_tab.id;
  if (current_tab.id) {
    console.log('Executing search script');
    chrome.tabs.sendMessage(current_tab.id, { greeting: 'open' });
  }

  chrome.tabs.onActivated.addListener(function closeOnTabSwitch(activeInfo) {
    if (activeInfo.tabId !== current_id) {
      chrome.runtime.sendMessage(searchAction.Close).then(() => {
        chrome.tabs.onActivated.removeListener(closeOnTabSwitch);
      });
    }
  });
}

async function overlaySearchHandler(current_tab: chrome.tabs.Tab) {
  if (current_tab.id) {
    console.log('Executing search script');
    chrome.tabs.sendMessage(current_tab.id, { greeting: 'open' });
  }
}
