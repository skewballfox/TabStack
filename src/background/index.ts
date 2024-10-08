import { get } from "svelte/store";
import { storage, defaultStorage } from "../storage";
import searchScript from "../content/search?script"
import { SaveCurrentStack } from "../stack_controls";


//const browser = chrome || browser


// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/


// TODO: handle LRU
//   chrome.tabs.onActivated.addListener(moveToFirstPosition);

//   async function moveToFirstPosition(activeInfo) {
//     try {
//       await chrome.tabs.move(activeInfo.tabId, {index: 0});
//       console.log("Success.");
//     } catch (error) {
//       if (error == "Error: Tabs cannot be edited right now (user may be dragging a tab).") {
//         setTimeout(() => moveToFirstPosition(activeInfo), 50);
//       } else {
//         console.error(error);
//       }
//     }
//   }

enum Command {
    SearchStacks = "search-stacks",
    pushTabToStack = "push_tab_to_stack",
}

// function search() {
//     //document.body.style.backgroundColor = 'rgba(232, 240, 254, 0.4)';
//     new StackList({ target: document.body });
// }



/// called when a new tab is created, either pushes the tab to the current stack
/// or closes the tab if the tab limit has been reached
async function tryPushStack(newTab: chrome.tabs.Tab) {
    // first check if the tab limit has been reached
    const data = await storage.get();
    console.log(data)
    const tabs = data.stack_list.stacks[data.stack_list.currentStack].tabs
    if (tabs.length > data.tab_limit) {
        // If the tab limit has been reached, close the new tab
        console.log("here")
        if (newTab.id) {
            chrome.tabs.remove(newTab.id); // Close the new tab if it has a valid ID
        }
    } else {
        tabs.push(newTab);
    }
    storage.set(data)
}

async function tryOpenTab(tab: chrome.tabs.Tab) {
    const data = await storage.get();
    const tabs = await chrome.tabs.query({ currentWindow: true });
    if (tabs.length > data.tab_limit) {
        // If the tab limit has been reached, close the new tab
        console.log("here")
        if (tab.id) {
            chrome.tabs.remove(tab.id); // Close the new tab if it has a valid ID
        }
    }
}
    

chrome.runtime.onInstalled.addListener(async (details) => {
    // populate the default stack
    
    

    // initialize the stacks with the current tabs
    async function initializeStacks() {
        let data = defaultStorage;
        const tabs = await chrome.tabs.query({ currentWindow: true });
        data.stack_list.stacks[data.stack_list.currentStack].tabs = tabs;
        await storage.set(data)
    }
    
    if (details.reason === "install"||details.reason === "update") {
        // Initialize the stack list
        await initializeStacks();
    }
    

    // Set up listener for tab creation
    chrome.tabs.onCreated.addListener((tab) => {
        console.log("New tab created:", tab.id);
        tryOpenTab(tab);
    });

    chrome.commands.onCommand.addListener(async (command,current_tab) => {
        console.log("Command:", command);
        console.log("Current tab:", current_tab);
        if (command === Command.SearchStacks) {
            if (current_tab.id) {
                console.log("Executing search script");
                chrome.scripting.executeScript({
                    target: { tabId: current_tab.id },
                    files: [searchScript],
                })
            }
        }
    });
});




// NOTE: If you want to toggle the side panel from the extension's action button,
// you can use the following code:
// chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
//    .catch((error) => console.error(error));
