// content.js — Brave-compatible DOM-injected sidebar with Chat + Settings + Theme Toggle
(function () {
    if (document.getElementById("chatgpt-sidebar-wrapper")) {
      document.getElementById("chatgpt-sidebar-wrapper").remove();
      chrome.storage.local.set({ sidebarOpen: false });
      return;
    }

    chrome.storage.local.set({ sidebarOpen: true });

    const wrapper = document.createElement("div");
    wrapper.id = "chatgpt-sidebar-wrapper";
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.right = "0";
    wrapper.style.height = "100vh";
    wrapper.style.width = "400px";
    wrapper.style.zIndex = "9999999";
    wrapper.style.background = "#f9f9f9";
    wrapper.style.boxShadow = "-2px 0 5px rgba(0,0,0,0.1)";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.borderLeft = "1px solid #ccc";

    const style = document.createElement("style");
    style.textContent = `
      #chatgpt-sidebar-wrapper button {
        font-family: sans-serif;
        cursor: pointer;
      }
      #chatgpt-sidebar-wrapper.dark {
        background: #1e1e1e;
        color: white;
      }
      #chatgpt-sidebar-wrapper.dark #chatgpt-menu {
        background: #333;
        color: white;
      }
      #chatgpt-sidebar-wrapper.dark #chatgpt-output {
        background: #2a2a2a;
        color: #eee;
        border-color: #444;
      }
      #chatgpt-sidebar-wrapper.dark #chatgpt-prompt {
        background: #2e2e2e;
        color: #f0f0f0;
        border: 1px solid #555;
      }
      #chatgpt-sidebar-wrapper.dark button {
        background-color: #444;
        color: #f0f0f0;
        border: 1px solid #555;
      }
      #chatgpt-sidebar-wrapper.dark input {
        background-color: #2a2a2a;
        color: #eee;
        border: 1px solid #555;
      }
      #chatgpt-sidebar-wrapper.dark ::-webkit-scrollbar {
        width: 8px;
      }
      #chatgpt-sidebar-wrapper.dark ::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 4px;
      }
      #chatgpt-menu {
        display: flex;
        justify-content: space-between;
        background: #2e8b57;
        padding: 10px;
        color: white;
      }
      #chatgpt-menu button {
        background: none;
        border: none;
        color: white;
        font-size: 14px;
      }
      #chatgpt-chat, #chatgpt-settings {
        flex: 1;
        padding: 10px;
        display: none;
        overflow-y: auto;
      }
      #chatgpt-chat.active, #chatgpt-settings.active {
        display: block;
      }
      #chatgpt-output {
        height: 60vh;
        overflow-y: auto;
        padding: 10px;
        background: #fff;
        border: 1px solid #ddd;
        margin-bottom: 8px;
      }
      #chatgpt-prompt {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
      }
      #chatgpt-settings input {
        width: 100%;
        margin-bottom: 6px;
        padding: 6px;
      }
      #chatgpt-settings button {
        margin-top: 4px;
        width: 100%;
      }
      #chatgpt-theme-toggle {
        margin-top: 10px;
        padding: 6px;
      }
    `;
  
    const menu = document.createElement("div");
    menu.id = "chatgpt-menu";
    menu.innerHTML = `
      <span>ChatGPT Assistant</span>
      <div>
        <button id="chatgpt-tab-chat">💬 Chat</button>
        <button id="chatgpt-tab-settings">⚙️ Settings</button>
        <button id="chatgpt-close">✖</button>
      </div>
    `;
  
    const chat = document.createElement("div");
    chat.id = "chatgpt-chat";
    chat.classList.add("active");
    chat.innerHTML = `
      <div id="chatgpt-output"></div>
      <textarea id="chatgpt-prompt" rows="3" placeholder="Ask ChatGPT..."></textarea>
      <button id="chatgpt-send">Send</button>
    `;
  
    const settings = document.createElement("div");
    settings.id = "chatgpt-settings";
    settings.innerHTML = `
      <input type="password" id="chatgpt-apikey" placeholder="Enter API Key (sk-...)" />
      <button id="chatgpt-savekey">Save API Key</button>
      <button id="chatgpt-removekey">Remove API Key</button>
      <button id="chatgpt-theme-toggle">Toggle Light/Dark Mode</button>
      <p id="chatgpt-status"></p>
    `;
  
    wrapper.appendChild(style);
    wrapper.appendChild(menu);
    wrapper.appendChild(chat);
    wrapper.appendChild(settings);
    document.body.appendChild(wrapper);
  
    const $ = (id) => document.getElementById(id);
  
    $("chatgpt-tab-chat").onclick = () => {
      chat.classList.add("active");
      settings.classList.remove("active");
    };
  
    $("chatgpt-tab-settings").onclick = () => {
      chat.classList.remove("active");
      settings.classList.add("active");
      chrome.storage.local.get("openaiApiKey", (data) => {
        $("chatgpt-apikey").value = data.openaiApiKey || "";
      });
      chrome.storage.local.get("chatgptTheme", (data) => {
        wrapper.classList.toggle("dark", data.chatgptTheme === "dark");
      });
    };
  
    $("chatgpt-savekey").onclick = () => {
      const key = $("chatgpt-apikey").value.trim();
      chrome.storage.local.set({ openaiApiKey: key }, () => {
        $("chatgpt-status").textContent = "✅ API Key saved.";
        $("chatgpt-status").style.color = "green";
      });
    };
  
    $("chatgpt-removekey").onclick = () => {
      chrome.storage.local.remove("openaiApiKey", () => {
        $("chatgpt-apikey").value = "";
        $("chatgpt-status").textContent = "🗑️ Key removed.";
        $("chatgpt-status").style.color = "red";
      });
    };
  
    $("chatgpt-theme-toggle").onclick = () => {
      const isDark = wrapper.classList.toggle("dark");
      chrome.storage.local.set({ chatgptTheme: isDark ? "dark" : "light" });
    };
  
    $("chatgpt-close").onclick = () => {
      wrapper.remove();
      chrome.storage.local.set({ sidebarOpen: false });
    };
  
    $("chatgpt-send").onclick = async () => {
      const prompt = $("chatgpt-prompt").value.trim();
      if (!prompt) return;
  
      const out = $("chatgpt-output");
      out.innerHTML += `<div><strong>You:</strong> ${prompt}</div>`;
      $("chatgpt-prompt").value = "";
  
      chrome.storage.local.get("openaiApiKey", async ({ openaiApiKey }) => {
        if (!openaiApiKey) {
          out.innerHTML += `<div style='color:red;'>❌ No API Key found.</div>`;
          return;
        }
        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: prompt }]
            })
          });
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content || "(No response)";
          out.innerHTML += `<div><strong>ChatGPT:</strong> ${reply}</div>`;
          out.scrollTop = out.scrollHeight;
        } catch (err) {
          out.innerHTML += `<div style='color:red;'>❌ ${err.message}</div>`;
        }
      });
    };
  
    // Apply saved theme on initial load
    chrome.storage.local.get("chatgptTheme", (data) => {
      wrapper.classList.toggle("dark", data.chatgptTheme === "dark");
    });
  })();