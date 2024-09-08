import { storage } from "./storage";


/// Used to create a new stack with the given name, returns false if the stack already exists
/// or is an empty string
/// Returns true if the stack was successfully created
export async function tryCreateNewStack(stackName: string) {
    console.log("Creating new stack with name: " + stackName);
    const data = await storage.get();
    console.log(data);
    if (stackName==="" || data.stack_list.stacks[stackName]) {
        return false;
    }

    data.stack_list.stacks[stackName] = {
        tabs: []
    };
    await storage.set(data)
    return true;
}


/// Save the currently open tabs to the current stack, should be called prior to switching stacks
export async function SaveCurrentStack() {
    const data = await storage.get();
    const tabs = await chrome.tabs.query({ currentWindow: true });
    
    console.log("tabs: ", tabs);
    data.stack_list.stacks[data.stack_list.currentStack].tabs = tabs;
    storage.set(data);
}


/// Attempts to switch from the currently active stack to the stack with the given name
/// If the stack has associated tabs, they will be opened in the current window
/// otherwise a new tab will be opened
/// Returns false if the stack is the same as the current stack or the stack does not exist
/// Returns true if the stack was successfully switched
export async function switchStack(stackName: string) {
    await SaveCurrentStack();
    //create placeholder for new stack
    const data = await storage.get();
    if (data.stack_list.currentStack === stackName||!data.stack_list.stacks[stackName]) {
        return false;
    }
    let tabs = await chrome.tabs.query({ currentWindow: true });
    let placeholder = await chrome.tabs.create({ url: "chrome://newtab" });
    tabs.forEach(tab => {
        if (tab.id){
            chrome.tabs.remove(tab.id);
        }
    });
    data.stack_list.currentStack = stackName;
    if (data.stack_list.stacks[stackName].tabs.length > 0) {
        data.stack_list.stacks[stackName].tabs.forEach(tab => {
            chrome.tabs.create({ url: tab.url });
        });
        if (placeholder.id) {
            chrome.tabs.remove(placeholder.id);
        }
    }
    storage.set(data);
    return true;
}

/// Attempts to create a new stack with the given name and switch to it
export async function CreateAndSwitchStack(stackName: string) {
    let success = await tryCreateNewStack(stackName);
    if (success) {
        return await switchStack(stackName);
    }
}

export async function getBestMatch(searchQuery: string) {

}