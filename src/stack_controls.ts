import { stack_list } from './storage';
export type ControlAction = { action: StackAction; stackName: string };
//TODO: impolement stack deletion
export enum StackAction {
  Create = 'create-stack',
  CreateAndSwitch = 'create-and-switch-stack',
  Switch = 'switch-stack'
}

export async function stack_control_request_handler(
  request: ControlAction,
  sender: chrome.runtime.MessageSender
) {
  switch (request.action) {
    case StackAction.Create:
      await tryCreateNewStack(request.stackName);
      break;
    case StackAction.CreateAndSwitch:
      await CreateAndSwitchStack(request.stackName);
      break;
    case StackAction.Switch:
      await switchStack(request.stackName);
      break;
  }
}

/// Used to create a new stack with the given name, returns false if the stack already exists
/// or is an empty string
/// Returns true if the stack was successfully created
export async function tryCreateNewStack(stackName: string) {
  console.log('Creating new stack with name: ' + stackName);
  let was_created = false;

  if (stackName) {
    stack_list.update((stacklist) => {
      if (!stacklist.stacks[stackName]) {
        was_created = true;
        stacklist.stacks[stackName] = {
          tabs: []
        };
      }
      return stacklist;
    });
  }

  return was_created;
}

/// Save the currently open tabs to the current stack, should be called prior to switching stacks
export async function SaveCurrentStack() {
  const tabs = await chrome.tabs.query({ currentWindow: true });

  console.log('tabs: ', tabs);
  stack_list.update((stacklist) => {
    stacklist.stacks[stacklist.currentStack].tabs = tabs;
    return stacklist;
  });
}

/// Attempts to switch from the currently active stack to the stack with the given name
/// If the stack has associated tabs, they will be opened in the current window
/// otherwise a new tab will be opened
/// Returns false if the stack is the same as the current stack or the stack does not exist
/// Returns true if the stack was successfully switched
export async function switchStack(stackName: string) {
  await SaveCurrentStack();
  //create placeholder for new stack
  stack_list.subscribe(async (stacklist) => {
    if (stacklist.currentStack === stackName || !stacklist.stacks[stackName]) {
      return stacklist;
    }
    let tabs = await chrome.tabs.query({ currentWindow: true });
    let placeholder = await chrome.tabs.create({ url: 'chrome://newtab' });
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.remove(tab.id);
      }
    });

    if (stacklist.stacks[stackName].tabs.length > 0) {
      stacklist.stacks[stackName].tabs.forEach((tab) => {
        chrome.tabs.create({ url: tab.url });
      });
      if (placeholder.id) {
        chrome.tabs.remove(placeholder.id);
      }
    }
  });
  stack_list.update((stacklist) => {
    stacklist.currentStack = stackName;
    return stacklist;
  });
}

/// Attempts to create a new stack with the given name and switch to it
export async function CreateAndSwitchStack(stackName: string) {
  let was_stack_created = await tryCreateNewStack(stackName);
  if (was_stack_created) {
    await switchStack(stackName);
  }
  return was_stack_created;
}
