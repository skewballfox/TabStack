import { derived, writable, type Updater, type Writable } from 'svelte/store';

export enum LimitStrategy {
  /// Close the oldest tab
  LRU = 'least-recently-used',
  // /// open a popup to let user know the limit has been reached
  //popup = "popup",
  /// close the newest tab without prompting the user
  NewestTab = 'auto'
}
export enum SearchTool {
  SidePanel = 'side-panel',
  Overlay = 'overlay'
}
export type Config = {
  /// The maximum number of tabs that can be stored in a stack
  tab_limit: number;
  /// how to handle the limit being reached
  limit_strategy: LimitStrategy;
  /// The Method used for searching and managing stacks
  search_handler: SearchTool;
};

export const defaultConfig: Config = {
  tab_limit: 7,
  limit_strategy: LimitStrategy.NewestTab,
  search_handler: SearchTool.SidePanel
};

export type StackList = {
  stacks: Record<string, Stack>;
  currentStack: string;
};

export type TabData = {
  url: string;
  title: string;
  favIconUrl: string;
  id: number;
};

// }
interface Stack {
  //probably should change this to something else
  tabs: chrome.tabs.Tab[];
}

/**
 * Creates a persistent Svelte store backed by Chrome's sync storage.
 * @template T The type of the store's value
 * @param key The key to use in Chrome's storage
 * @param initialValue The initial value of the store
 * @returns A writable Svelte store
 */
export function persistentStore<T>(key: string, initialValue: T): Writable<T> {
  const store = writable<T>(initialValue);

  function updateChromeStorage(value: T): void {
    chrome.storage.sync.set({ [key]: value });
  }

  function watchChromeStorage() {
    chrome.storage.sync.onChanged.addListener((changes) => {
      if (Object.hasOwn(changes, key)) {
        store.set(changes[key].newValue);
      }
    });
  }

  function initStoreFromChromeStorage() {
    chrome.storage.sync.get(key).then((result) => {
      if (Object.hasOwn(result, key)) {
        store.set(result[key]);
      }
    });
  }

  initStoreFromChromeStorage();
  watchChromeStorage();

  return {
    set(this: void, value: T): void {
      store.set(value);
      updateChromeStorage(value);
    },
    update(this: void, updater: Updater<T>): void {
      return store.update((prev: T): T => {
        const value = updater(prev);
        updateChromeStorage(value);
        return value;
      });
    },
    subscribe: store.subscribe
  };
}

export const config = persistentStore<Config>('config', {
  tab_limit: 7,
  limit_strategy: LimitStrategy.NewestTab,
  search_handler: SearchTool.SidePanel
});

export const stack_list = persistentStore<StackList>('stack_list', {
  stacks: {
    default: {
      tabs: []
    }
  },
  currentStack: 'default'
});

export const searchQuery = writable('');
/// Svlete store for a copy of the stack list, updates when the chrome storage is updated
//export const stack_list: Writable<StackList> = writable(defaultStackList);

export const filtered_res = derived(
  [searchQuery, stack_list],
  ([$searchQuery, $stack_list]) =>
    Object.entries($stack_list.stacks)
      .filter(([stack, _]) =>
        stack.toLowerCase().includes($searchQuery.toLowerCase())
      )
      .map(([stack_name, _]): [string, boolean] => [
        stack_name,
        stack_name === $stack_list.currentStack
      ])
      .sort((a, b) => a[0].localeCompare(b[0]))
);
