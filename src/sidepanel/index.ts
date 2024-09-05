import StackList from "../components/StackList.svelte";
import { storage } from "../storage";

// Side panel
// https://developer.chrome.com/docs/extensions/reference/sidePanel/

function render() {
    const target = document.getElementById("app");

    if (target) {
        storage.get().then(({ stack_list }) => {
            new StackList({
                target,
                props: { stack_list },
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
