// background.js
chrome.action.onClicked.addListener(async (tab) => {
  // Inject or remove the sidebar (content.js)
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});