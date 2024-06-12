import Options from "../components/Options.svelte";
import { storage } from "../storage";

// Options
// https://developer.chrome.com/docs/extensions/mv3/options/

function render() {
    const target = document.getElementById("app");

    if (target) {
        storage.get().then(({ count, tab_limit }) => {
            new Options({
                target,
                props: { count, tab_limit },
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
