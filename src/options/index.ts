import Options from "../components/Options.svelte";
import { storage } from "../storage";

// Options
// https://developer.chrome.com/docs/extensions/mv3/options/

function render() {
    const target = document.getElementById("app");

    if (target) {
        storage.get().then(({ tab_limit }) => {
            new Options({
                target,
                props: { tab_limit },
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", render);
