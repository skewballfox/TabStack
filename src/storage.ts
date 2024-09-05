import { writable, type Writable } from "svelte/store";


type IStorage = {
    stack_list: StackList;
    tab_limit: number;
};
export type Config = {
    tab_limit: number;
    
};
  
export const defaultStackList: StackList = {
    stacks: {
        "default": {
            tabs: []
        }
    },
    currentStack: "default"
};

export const stack_list: Writable<StackList> = writable(defaultStackList);

const defaultStorage: IStorage = {
    stack_list: defaultStackList,
    tab_limit: 7,
    
};

export interface StackList {
    stacks: Record<string, Stack>;
    currentStack: string;
}
interface Stack {
    //probably should change this to something else
    tabs: chrome.tabs.Tab[];
}

/// Used to create a new stack, returns false if the stack already exists
export async function tryAddStack(stackName: string) {
    const data = await storage.get();
    console.log(data)
    
    if (data.stack_list.stacks[stackName]) {
        return false;
    }
    data.stack_list.stacks[stackName] = {
        tabs: []
    };
    await storage.set(data)
    
    return true;
}


interface Tab {
    url: string
    lastAccessed: number
}

export const storage = {
    get: (): Promise<IStorage> =>
        chrome.storage.sync.get(defaultStorage) as Promise<IStorage>,
    get_config: (): Promise<Config> => chrome.storage.sync.get("tab_limit").then((value) => value.tab_limit),
    set_config: (config: Config): Promise<void> => chrome.storage.sync.set({ tab_limit: config.tab_limit }),
    set: (value: IStorage): Promise<void> => {
        stack_list.set(value.stack_list)
        chrome.storage.sync.set(value)
        return Promise.resolve();
    }
};
