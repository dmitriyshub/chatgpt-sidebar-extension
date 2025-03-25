chrome.action.onClicked.addListener(async (tab) => {
    console.log("Extension icon clicked");
  
    // ⛔ Don't run on disallowed URLs
    if (!tab.url || !tab.url.startsWith("http")) {
      console.log("Blocked: not a valid URL tab.");
      return;
    }
  
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => !!document.getElementById("chatgpt-sidebar-wrapper"),
      });
  
      if (result) {
        console.log("Sidebar exists. Removing...");
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            document.getElementById("chatgpt-sidebar-wrapper").remove();
            chrome.storage.local.set({ sidebarOpen: false });
          },
        });
      } else {
        console.log("Injecting sidebar...");
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });
        chrome.storage.local.set({ sidebarOpen: true });
      }
    } catch (e) {
      console.error("Failed to inject:", e);
    }
  });
  
  // Handle tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      if (tab.url && tab.url.startsWith("http")) {
        chrome.storage.local.get("sidebarOpen", (data) => {
          if (data.sidebarOpen) {
            console.log(`Tab ${tabId} updated. Injecting sidebar...`);
            chrome.scripting.executeScript({
              target: { tabId },
              files: ["content.js"],
            });
          }
        });
      }
    }
  });
  
  // Reinject on startup
  chrome.runtime.onStartup.addListener(() => {
    console.log("Browser started");
    chrome.storage.local.get("sidebarOpen", (data) => {
      if (data.sidebarOpen) {
        chrome.tabs.query({}, (tabs) => {
          for (let tab of tabs) {
            if (tab.url && tab.url.startsWith("http")) {
              console.log(`Injecting sidebar into tab ${tab.id}`);
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"],
              });
            }
          }
        });
      }
    });
  });
  