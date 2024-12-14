# TabStack

A working memory friedly tab manager. It limits the number of tabs that can be open at once, while making it easy to switch between task relevant tab groups

## Features

- limit the number of tabs to a set amount (default is 7)
- Choose different strategies for what to do once the tab limit is reached
  - autoclose new tabs (currently implemented, default)
  - close the least recently used tab (currently implemented)
- switch between task-associated tab groups via the sidebar or an overlay (in progress, requires scripting permission)

## Rationale

Working memory, the number of individual pieces of information we can juggle at once, is pretty limited; it's capacity is generally assumed to be around 7 items. Once that's exceeded, we start losing the ability to track relevant information, and [having trouble encoding the information into long term memory](https://cei.umn.edu/teaching-resources/leveraging-learning-sciences/working-memory-limited).

When working on a task, limiting the number of tabs open to what you can actively track is arguably a good idea. This extension limits the number of tabs to a managable number, and makes it easy to switch between groups of tabs relevant to a specific task
