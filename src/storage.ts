type IStorage = {
    stack_list: StackList;
    tab_limit: number;
};
export type Config = {
    tab_limit: number;
    
};
const defaultStorage: IStorage = {
    stack_list: {
        stacks: {
            "default": {
                tabs: []
            }
        },
        currentStack: "default"
    },
    tab_limit: 7,
    
};

export interface StackList {
    stacks: Record<string, Stack>
    currentStack: string
}
interface Stack {
    //probably should change this to something else
    tabs: chrome.tabs.Tab[]
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
    set: (value: IStorage): Promise<void> => chrome.storage.sync.set(value),
};
