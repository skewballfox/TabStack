type IStorage = {
    count: number;
    tab_limit: number;
};

const defaultStorage: IStorage = {
    count: 0,
    tab_limit: 7,
    
};

export const storage = {
    get: (): Promise<IStorage> =>
        chrome.storage.sync.get(defaultStorage) as Promise<IStorage>,
    set: (value: IStorage): Promise<void> => chrome.storage.sync.set(value),
};
