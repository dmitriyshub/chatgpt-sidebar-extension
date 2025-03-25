(function () {
    const existing = document.getElementById('chatgpt-sidebar-wrapper');
    if (existing) {
      existing.remove();
      chrome.storage.local.set({ sidebarOpen: false });
      return;
    }
  
    const wrapper = document.createElement('div');
    wrapper.id = 'chatgpt-sidebar-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.right = '0';
    wrapper.style.width = '400px';
    wrapper.style.height = '100vh';
    wrapper.style.zIndex = '9999999';
    wrapper.style.background = '#f9f9f9';
    wrapper.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    wrapper.style.fontFamily = 'sans-serif';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
  
    // Header
    const header = document.createElement('div');
    header.style.background = '#4a90e2';
    header.style.color = '#fff';
    header.style.padding = '12px 16px';
    header.style.fontSize = '16px';
    header.style.fontWeight = 'bold';
    header.textContent = 'ChatGPT Sidebar Assistant';
  
    // Content
    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.padding = '16px';
    content.style.overflowY = 'auto';
    content.innerHTML = `<p>Sidebar loaded successfully.</p>`;
  
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.margin = '12px';
    closeBtn.style.alignSelf = 'flex-end';
    closeBtn.style.padding = '6px 12px';
    closeBtn.style.border = 'none';
    closeBtn.style.background = '#ccc';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
      wrapper.remove();
      chrome.storage.local.set({ sidebarOpen: false });
    };
  
    wrapper.appendChild(header);
    wrapper.appendChild(content);
    wrapper.appendChild(closeBtn);
    document.body.appendChild(wrapper);
    chrome.storage.local.set({ sidebarOpen: true });
  })();