import { get } from "svelte/store";
import { storage } from "../storage";

//const browser = chrome || browser
// interface StackList {
//     stacks: Record<string, Stack>
//     currentStack: string
// }
// interface Stack {
//     //probably should change this to something else
//     tabs: chrome.tabs.Tab[]
// }

// function closeStack() {

//     let currentStack = storage.get().then((data) => {
//         let currentStack = data.currentStack;
//         let stacks = data.stacks;
//         stacks[currentStack].tabs.forEach(tab => {
//             chrome.tabs.remove(tab.id);
//         });
//     }
//     chrome.tabs.query({ currentWindow: true }, function (tabs) {
//         tabs.forEach(tab => {
            
            
//         });
//     }
//     //get the current stack

// }
// Background service workers
// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// async function switchStack(stackName: string) {
//     let stack_list = await storage.get_stack_list();
//     let current = stack_list.currentStack;
//     chrome.tabs.query({ currentWindow: true }, function (tabs) {
//         tabs.forEach(tab => {
//             stack_list.stacks[current].tabs.push(tab);
//             tab.remove();
//         });
//     });
// }

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
function openNewNamedStack() {
    //TODO: popup a window to get the name of the new stack
    
    //TODO: Save the currently open tabs to the current stack
    //TODO: Set the active stack to new name, Close currently all active tabs 
    
}

/// called when a new tab is created, either pushes the tab to the current stack
/// or closes the tab if the tab limit has been reached
async function tryPushStack(newTab: chrome.tabs.Tab) {
    //first check if the tab limit has been reached
    let data = await storage.get();
    
    let current = data.stack_list.currentStack;
    console.log(data)
    if (data.tab_limit!=0 && data.stack_list.stacks[current].tabs.length >= data.tab_limit) {
        //if the tab limit has been reached, close the new tab
        
            console.log("here")
            if (newTab.id !== undefined) {
                chrome.tabs.remove(newTab.id);
            }
        
    } else {
        //if it hasn't been reached, push the new tab to the current stack
        data.stack_list.stacks[current].tabs.push(newTab);

    }
}

chrome.tabs.onCreated.addListener(tryPushStack);

chrome.runtime.onInstalled.addListener( () => {
    // populate the default stack
        storage.get().then(console.log)
        chrome.tabs.query({ currentWindow: true }).then(tabs => {
            tabs.forEach(tab => {
                tryPushStack(tab).then(() => {  });
            });
        });
    });




// NOTE: If you want to toggle the side panel from the extension's action button,
// you can use the following code:
// chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
//    .catch((error) => console.error(error));
