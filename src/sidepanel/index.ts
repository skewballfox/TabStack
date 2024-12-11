import { mount } from "svelte";
import StackList from "../components/StackList.svelte";
import { storage } from "../storage";

// Side panel
// https://developer.chrome.com/docs/extensions/reference/sidePanel/


document.documentElement.style.minHeight = '100%';
document.documentElement.style.margin = '0';
document.documentElement.style.display = 'flex';
document.documentElement.style.flexDirection = 'column';
document.documentElement.style.flexGrow = '1';
document.body.style.minHeight = '100%';
document.body.style.margin = '0';
document.body.style.flexDirection = 'column';
document.body.style.flexGrow = '1';

function setDarkMode() {
  document.documentElement.style.backgroundColor = "#232b2b";
  document.body.style.backgroundColor = "#232b2b";
  document.body.style.color = "white";
}

function setLightMode() {
  document.documentElement.style.backgroundColor = "white";
  document.body.style.backgroundColor = "white";
  document.body.style.color = "black";
}
setDarkMode();
function render() {
    const target = document.getElementById("app");
    

    chrome.runtime.onMessage.addListener(
        function closeSidePanel(message) {
            if (message === 'closeSidePanel') {
                chrome.runtime.onMessage.removeListener(closeSidePanel);
                window.close();
            }
        }
    );

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (e.matches) {
          document.body.classList.add("dark-mode");
          setDarkMode();
        } else {
          document.body.classList.remove("dark-mode");
          setLightMode();
        }

      });
    
    //the close handler defines what happens on successfully switching stacks,
    //not events external to the stacklist, such as switching to a different tab
    let closeHandler = async () => {
        await chrome.runtime.sendMessage('closeSidePanel');
    };
    if (target) {
        storage.get().then(({ stack_list }) => {
            //TODO: set focus to the search bar depending on whether eventual fix for issue below is
            // focus on open or expose focus method
            // https://github.com/w3c/webextensions/issues/693
            mount(StackList, { target, props: { closeHandler } });
            
        });
        
    }
    
}
document.addEventListener("DOMContentLoaded", render);