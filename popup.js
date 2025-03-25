document.getElementById("saveBtn").addEventListener("click", () => {
    const key = document.getElementById("apiKey").value;
    chrome.storage.local.set({ openaiApiKey: key }, () => {
      document.getElementById("status").textContent = "✅ Saved!";
  
      // Inject sidebar into current tab after saving
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["content.js"]
        });
      });
  
      // Optional: close the popup after delay
      setTimeout(() => window.close(), 1000);
    });
  });