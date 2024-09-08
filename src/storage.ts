import { derived, writable, type Writable } from "svelte/store";


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

export const searchQuery = writable("");
/// Svlete store for a copy of the stack list, updates when the chrome storage is updated
export const stack_list: Writable<StackList> = writable(defaultStackList);

export const filtered_res = derived(
    [searchQuery, stack_list],
    ([$searchQuery, $stack_list]) =>
      Object.entries($stack_list.stacks)
        .filter(([stack, _]) =>
          stack.toLowerCase().includes($searchQuery.toLowerCase())
        ).map(([stack_name, _]): [string,boolean]  => [stack_name, stack_name===$stack_list.currentStack])
        .sort((a, b) => a[0].localeCompare(b[0]))
);

export const defaultStorage: IStorage = {
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



interface Tab {
    url: string
    lastAccessed: number
}

export const storage = {
    get: (): Promise<IStorage> =>
        chrome.storage.sync.get() as Promise<IStorage>,
    get_config: (): Promise<Config> => chrome.storage.sync.get("tab_limit").then((value) => value.tab_limit),
    set_config: (config: Config): Promise<void> => chrome.storage.sync.set({ tab_limit: config.tab_limit }),
    set: (value: IStorage): Promise<void> => {
        stack_list.set(value.stack_list)
        chrome.storage.sync.set(value)
        return Promise.resolve();
    }
};
