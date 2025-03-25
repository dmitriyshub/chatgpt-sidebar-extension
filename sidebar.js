const sendBtn = document.getElementById("sendBtn");
const promptInput = document.getElementById("prompt");
const outputDiv = document.getElementById("output");

sendBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  outputDiv.innerHTML += `<div><strong>You:</strong> ${prompt}</div>`;
  promptInput.value = "";

  chrome.storage.local.get("openaiApiKey", async ({ openaiApiKey }) => {
    if (!openaiApiKey) {
      outputDiv.innerHTML += `<div style="color:red;">⚠️ No API Key found.</div>`;
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
      outputDiv.innerHTML += `<div><strong>ChatGPT:</strong> ${reply}</div>`;
      outputDiv.scrollTop = outputDiv.scrollHeight;
    } catch (err) {
      outputDiv.innerHTML += `<div style="color:red;">❌ Error: ${err.message}</div>`;
    }
  });
});